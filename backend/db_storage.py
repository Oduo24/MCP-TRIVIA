#!/usr/bin/python3
"""Defines the db storage methods."""

import os

from sqlalchemy import create_engine, select, desc, and_, func
from sqlalchemy.orm import sessionmaker, scoped_session, joinedload

from models.base_model import Base
from models.main_models import User, Question, Episode, Category


class DBStorage:
    """Defines a db storage object"""
    __engine = None
    __session = None
    

    def __init__(self):
        """Class constructor, instantiates a DBStorage object
        """
        MYSQL_USER = os.environ.get('MYSQL_USER', 'gerald')
        MYSQL_PWD = os.environ.get('MYSQL_PWD', 'ruphinee')
        MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
        MYSQL_DB = os.environ.get('MYSQL_DB', 'mcp_db')

        self.__engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'.format(MYSQL_USER, MYSQL_PWD, MYSQL_HOST, MYSQL_DB),
                pool_size=100, max_overflow=0)


    def new(self, obj):
        """Adds a new object to the current db session
        """
        self.__session.add(obj)


    def save(self):
        """Commits all changes of the current db session
        """
        self.__session.commit()

    def rollback(self):
        """Rolls back the changes in a particular session
        """
        self.__session.rollback()

    def delete(self, obj = None):
        """Deletes an object from the current db session if obj is not none
        """
        if obj is not None:
            self.__session.delete(obj)

    def reload(self):
        """Sets a new session
        """
        Base.metadata.create_all(self.__engine)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False, autoflush=False)
        Session = scoped_session(sess_factory)
        self.__session = Session()

    def close(self):
        """Closes the current session
        """
        self.__session.close()

    def get_user(self, username):
        """Retrieves a single object of the specified class and column value
        """
        #retrieve the user with the username
        obj = self.__session.query(User).filter_by(username=username).first()
        return obj if obj else None


    def all_questions(self):
        """Retrieves all questions
        """
        self.reload()
        #retrieve the user with the username
        questions = self.__session.query(Question).options(joinedload(Question.answers)).all()

        formatted_questions = []
        for question in questions:
            options = [answer.answer_text for answer in question.answers]
            correct_answer = next((answer.answer_text for answer in question.answers if answer.is_correct), None)
            
            formatted_questions.append({
                "id": question.id,
                "question": question.question_text,
                "options": options,
                "answer": correct_answer
            })
        return formatted_questions if formatted_questions else None


    def update_score(self, username, player_answers):
        """Update user score
        """
        self.reload()
        # Get user
        user = self.get_user(username)
        # Convert the keys of the dictionary to a list of IDs
        question_ids = list(player_answers.keys())
        # Get answers for the question ids provided
        correct_answers = (
            self.__session.query(Question)
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
                    user.score += 1
                else:
                    raise ValueError('User not found')
        self.save()
        return user.score
    
    def get_top_scores(self, username):
        """Get top five scorers and current user's score and position"""
        self.reload()
        current_user_score = self.get_user(username).score
        top_five_scorers = self.__session.query(User).order_by(desc(User.score)).limit(5)

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
        self.reload()
        episodes = self.__session.query(Episode).all()
        episodes_list = [{
            'id': episode.id,
            'title': episode.title,
            'episode_no': episode.episode_no,
            'featured_guest': episode.featured_guest
        } for episode in episodes]

        return episodes_list
    
    def all_categories(self):
        """Retrieves all categories"""
        self.reload()
        categories = self.__session.query(Category).all()
        categories_list = [{
            'id': category.id,
            'category_name': category.category_name,
        } for category in categories]

        return categories_list
    
    def all_admin_data(self):
        """Retrieves all data for admin panel"""
        self.reload()

        admin_data = []

        # get episodes
        episodes = self.__session.query(Episode).all()
        episodes_list = [{
            'id': episode.id,
            'title': episode.title,
            'episode_no': episode.episode_no,
            'featured_guest': episode.featured_guest
        } for episode in episodes]

        # get categories
        categories = self.__session.query(Category).all()
        categories_list = [{
            'id': category.id,
            'category_name': category.category_name,
        } for category in categories]

        # get top scorers
        top_five_scorers = self.__session.query(User).order_by(desc(User.score)).limit(5)

        top_scorers = []
        
        for user in top_five_scorers:
            score_object = {}
            score_object["username"] = user.username
            score_object["score"] = user.score
            top_scorers.append(score_object)

        user_count = self.__session.query(func.count(User.id)).scalar()
        question_count = self.__session.query(func.count(Question.id)).scalar()

        data = [episodes_list, categories_list, top_scorers, user_count, question_count]

        for data_item in data:
            admin_data.append(data_item)
        
        return admin_data



        

        