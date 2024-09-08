#!/usr/bin/python3
"""Defines the db storage methods."""

import os

from sqlalchemy import create_engine, select, desc, and_, func, text
from sqlalchemy.orm import sessionmaker, scoped_session, joinedload

from models.base_model import Base
from models.main_models import User, Question, Episode, Category, UserAnsweredQuestion, user_answered_episodes


MYSQL_USER = os.environ.get('MYSQL_USER', 'gerald')
MYSQL_PWD = os.environ.get('MYSQL_PWD', 'ruphinee')
MYSQL_HOST = os.environ.get('MYSQL_HOST', 'mcp-trivia-db-instance.c18ys0qg2qkp.af-south-1.rds.amazonaws.com')
MYSQL_DB = os.environ.get('MYSQL_DB', 'mcp_db')

engine = create_engine(
        'mysql+mysqldb://{}:{}@{}/{}'.format(MYSQL_USER, MYSQL_PWD, MYSQL_HOST, MYSQL_DB),
        pool_size=100,
        max_overflow=10,
    )

SessionFactory = sessionmaker(bind=engine)
Session = scoped_session(SessionFactory)

class DBStorage:
    """Defines a db storage object"""

    def __init__(self):
        """Class constructor, instantiates a DBStorage object
        """
        self.engine = engine
        self.Session = Session

    def new(self, instance):
        """Adds an instance to the current session."""
        session = self.Session()
        session.add(instance)

    def save(self):
        """Commits the current transaction."""
        session = self.Session()
        try:   
            session.commit()
        except Exception as e:
            session.rollback()
            raise e # Will be caught by the calling function
        
    def rollback(self):
        """rollback the current transaction."""
        session = self.Session()
        session.rollback()


    def delete(self, model, identifier):
        """Deletes a record of the given model with the specified identifier."""
        session = self.Session()
        try:
            # Query for the record to delete
            record = session.query(model).get(identifier)
            if record:
                session.delete(record)
                session.commit()
                return True
            else:
                print(f"Record with id {identifier} not found.")
                return False
        except Exception as e:
            session.rollback()  # Rollback in case of error
            print(f"Error occurred: {e}")
            return False


    def reload(self):
        """Initialize the database and create tables."""
        Base.metadata.create_all(self.engine)

    def close(self):
        """Closes the current session."""
        self.Session.remove()

    def get_user(self, username):
        """Retrieves a single user object with the username
        """
        session = self.Session()
        #retrieve the user with the username
        obj = session.query(User).filter_by(username=username).first()

        return obj if obj else None
    
    def get_objects_by_id(self, obj_class, ids):
        """Retrieves a several object with the given ids
        """
        #retrieve the user with the username
        session = self.Session()
        obj = session.query(obj_class).filter(Question.id.in_(ids)).all()

        return obj if obj else None
    
    def get_object_by_id(self, obj_class, id):
        """Retrieves a single user object with the given id
        """
        #retrieve the user with the username
        session = self.Session()
        obj = session.query(obj_class).filter_by(id=id).first()

        return obj if obj else None


    def all_questions(self, episode_id):
        """Retrieves all questions for the particular episode with associated episode names"""

        # Perform a join between Question and Episode and retrieve the data
        session = self.Session()
        questions = (
            session.query(Question).filter_by(episode_id=episode_id)
            .join(Episode, Question.episode_id == Episode.id)
            .options(joinedload(Question.answers))
            .add_columns(Episode.title, Episode.episode_no)
            .all()
        )

        formatted_questions = []
        for question, episode_name, episode_number in questions:
            options = [answer.answer_text for answer in question.answers]
            correct_answer = next((answer.answer_text for answer in question.answers if answer.is_correct), None)

            formatted_questions.append({
                "id": question.id,
                "question": question.question_text,
                "options": options,
                "answer": correct_answer,
                "episode_name": episode_name,
                "episode_number": episode_number
            })

        return formatted_questions if formatted_questions else None


    def update_score(self, username, player_answers):
        """Update user score
        """
        # Get user
        user = self.get_user(username)
        # Convert the keys of the dictionary to a list of IDs
        question_ids = list(player_answers.keys())

        # Get answers for the question ids provided
        session = self.Session()
        correct_answers = (
            session.query(Question)
            .options(joinedload(Question.answers))
            .filter(Question.id.in_(question_ids))
            .all()
        )

        for question in correct_answers:
            # Get the player's answer for the current question
            player_answer = player_answers.get(question.id)

            # Find the correct answer for the current question
            correct_answer = next((answer for answer in question.answers if answer.is_correct), None)

            # Check if the player's answer matches the correct answer
            if correct_answer and player_answer == correct_answer.answer_text:
                # Update score
                if user:
                    # Update generall score
                    user.score += 1
                    # Update score per question
                    answered_question = UserAnsweredQuestion(
                        user_id=user.id,
                        question_id=question.id,
                        episode_id=question.episode_id,
                        isCorrect=True,
                    )
                    self.new(answered_question)
                    self.save() # Commit since the direct sql queries below depends on this change 
                else:
                    raise ValueError('User not found')
            else:
                # Update score per question setting isCorrect to False
                answered_question = UserAnsweredQuestion(
                    user_id=user.id,
                    question_id=question.id,
                    isCorrect=False,
                )
                self.new(answered_question)
                self.save() # Commit since the direct sql queries below depends on this change 

        # Check if its the last set of questions for the episode and set the episode answered
        # Retrieve the episode and the total number of questions for that episode
        question = self.get_object_by_id(Question, question_ids[0])
        episode = (
            session.query(Episode, func.count(Question.id))
            .join(Question, Question.episode_id == Episode.id)
            .filter(Question.episode_id == question.episode_id)
            .group_by(Episode.id)
            .first()
        )
        episode_object = episode[0]
        total_episode_questions = episode[1]

        # To be optimized
        # Get user_answered_question object for the user where the episode_id is the episode_object_id
        user_answered_question_ids = [question.question_id for question in user.answered_questions]
        
        total_user_answered_questions_for_the_episode = session.query(Question).filter(
            Question.id.in_(user_answered_question_ids),
            Question.episode_id == episode_object.id
        ).count()

        # Check if this is the end of the questions for the episode
        if total_episode_questions == total_user_answered_questions_for_the_episode:
            user.answered_episodes.append(episode_object)
            self.save()

            # Calculate Total episode_score for the episode
            # Update episode score for the existing association
            # Do a direct sql query coz the relationship defined by secodary Table object does not include
            # additional columns
            
            # Combined SQL query
            combined_sql = text(
                "UPDATE user_answered_episodes "
                "SET episode_score = ("
                "    SELECT COUNT(*) FROM user_answered_questions "
                "    WHERE user_id = :user_id AND episode_id = :episode_id AND isCorrect = :is_correct"
                ") "
                "WHERE user_id = :user_id AND episode_id = :episode_id"
            )

            # Execute the combined query
            session.execute(combined_sql, {
                "user_id": user.id,
                "episode_id": episode_object.id,
                "is_correct": True
            })
            self.save()

            # Step 2: Retrieve the updated episode score
            select_episode_score_sql = text(
                "SELECT episode_score FROM user_answered_episodes "
                "WHERE user_id = :user_id AND episode_id = :episode_id"
            )

            result = session.execute(select_episode_score_sql, {
                "user_id": user.id,
                "episode_id": episode_object.id
            })
            updated_episode_score = result.scalar()

            return user.score, episode_object.id, updated_episode_score

        self.save()
        episode_object = None
        updated_episode_score = None
        return user.score, episode_object, updated_episode_score
    
    def get_top_scores(self, username):
        """Get top five scorers and current user's score and position"""
        current_user_score = self.get_user(username).score

        session = self.Session()
        top_five_scorers = session.query(User).order_by(desc(User.score)).limit(5)
        self.close()

        scores = []
        top_scorers = []
        
        # Append current user score
        scores.append(current_user_score)
        
        for user in top_five_scorers:
            score_object = {}
            score_object["username"] = user.username
            score_object["score"] = user.score
            top_scorers.append(score_object)
        scores.append(top_scorers)

        if scores:
            return scores
        else:
            raise ValueError('No scores found')
    
    def all_episodes(self):
        """Retrieves all episodes"""
        session = self.Session()
        episodes = session.query(Episode).all()
        episodes_list = [{
            'id': episode.id,
            'title': episode.title,
            'episode_no': episode.episode_no,
            'featured_guest': episode.featured_guest,
            'image_path': episode.image_path,
        } for episode in episodes]

        self.close()
        
        return episodes_list
    
    def all_categories(self):
        """Retrieves all categories"""
        session = self.Session()
        categories = session.query(Category).all()
        self.close()

        categories_list = [{
            'id': category.id,
            'category_name': category.category_name,
        } for category in categories]

        return categories_list
    
    def all_admin_data(self):
        """Retrieves all data for admin panel"""
        admin_data = []

        # get episodes
        session = self.Session()
        episodes = session.query(Episode).all()
        episodes_list = [{
            'id': episode.id,
            'title': episode.title,
            'episode_no': episode.episode_no,
            'featured_guest': episode.featured_guest
        } for episode in episodes]

        # get categories
        categories = session.query(Category).all()
        categories_list = [{
            'id': category.id,
            'category_name': category.category_name,
        } for category in categories]

        # get top scorers
        top_five_scorers = session.query(User).order_by(desc(User.score)).limit(5)

        top_scorers = []
        
        for user in top_five_scorers:
            score_object = {}
            score_object["username"] = user.username
            score_object["score"] = user.score
            top_scorers.append(score_object)

        user_count = session.query(func.count(User.id)).scalar()
        question_count = session.query(func.count(Question.id)).scalar()

        data = [episodes_list, categories_list, top_scorers, user_count, question_count]

        for data_item in data:
            admin_data.append(data_item)

        self.close()
        
        return admin_data


    def update_username(self, current_username, new_username):
        """Updates username"""

        # Check if username already exists if so return taken
        if self.get_user(new_username):
            self.close()
            return "taken"
        # update the current username
        user = self.get_user(current_username)
        user.username = new_username
        self.save()
        return "Success"
    
    def five_featured_episodes(self):
        """Retrieves five episodes with image urls"""
        session = self.Session()
        # Query to get 5 random episodes where image_url is not null
        episodes = (
            session.query(Episode)
            .filter(Episode.image_path.isnot(None))
            .order_by(func.random())
            .limit(3)
            .all()
        )
        self.close()

        episodes_list = [{
            'id': episode.id,
            'title': episode.title,
            'episode_no': episode.episode_no,
            'featured_guest': episode.featured_guest,
            'image_path': episode.image_path
        } for episode in episodes]

        return episodes_list
    
    def get_object_count(self, episode_id):
        """Calculate number of objects"""
        session = self.Session()
        no_of_questions = session.query(Question).filter_by(episode_id=episode_id).count()
        return no_of_questions


