"""Base model for all models"""

from sqlalchemy import Column, String, DateTime, Date, Integer, Enum, Float, Index, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship
from models.base_model import BaseModel, Base

class User(BaseModel, Base):
    """Defines the User class"""
    __tablename__ = "users"

    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(500), nullable=False)
    role = Column(Enum('admin', 'member'), nullable=False)
    score = Column(Integer, nullable=False, default=0)

    # Defining relationship between users and questions
    answered_questions = relationship('UserAnsweredQuestion')

    # Defining relationship between users and episodes
    answered_episodes = relationship(
        'Episode',
        secondary='user_answered_episodes',
    )


    def __init__(self, **kwargs):
        """Initializes a User instance
        """
        super().__init__(**kwargs)

class Episode(BaseModel, Base):
    """Defines the Category class"""
    __tablename__ = "episodes"

    title = Column(String(64), unique=True, nullable=False)
    episode_no = Column(Integer, nullable=True)
    featured_guest = Column(String(100), nullable=True)
    image_path = Column(String(100), nullable=True)
    questions = relationship('Question', backref='episode')

    def __init__(self, **kwargs):
        """Initializes an instance
        """
        super().__init__(**kwargs)

    def __repr__(self):
        return f'<Category {self.name}>'

class Question(BaseModel, Base):
    """Defines the Question class"""
    __tablename__ = "questions"

    question_text = Column(String(256), nullable=False)
    episode_id = Column(String(100), ForeignKey('episodes.id'), nullable=True)
    category_id = Column(String(100), ForeignKey('categories.id'), nullable=True)
    answers = relationship('Answer', backref='question')

    users_answered = relationship("UserAnsweredQuestion")

    def __init__(self, **kwargs):
        """Initializes an instance
        """
        super().__init__(**kwargs)

    def __repr__(self):
        return f'<Question {self.question_text[:20]}...>'
    
class Category(BaseModel, Base):
    """Defines the Question category class"""
    __tablename__ = "categories"

    category_name = Column(String(256), nullable=False)
    questions = relationship('Question', backref='category')

    def __init__(self, **kwargs):
        """Initializes an instance
        """
        super().__init__(**kwargs)

    def __repr__(self):
        return f'<Question {self.question_text[:20]}...>'

class Answer(BaseModel, Base):
    """Defines the Answer class"""
    __tablename__ = "answers"

    answer_text = Column(String(256), nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    question_id = Column(String(100), ForeignKey('questions.id'), nullable=False)

    def __init__(self, **kwargs):
        """Initializes an instance
        """
        super().__init__(**kwargs)

    def __repr__(self):
        return f'<Answer {self.answer_text} {"(correct)" if self.is_correct else ""}>'

    
# Association class(table) between Users and Questions
class UserAnsweredQuestion(Base):
    __tablename__ = 'user_answered_questions'
    user_id = Column(String(100), ForeignKey('users.id'), primary_key=True)
    question_id = Column(String(100), ForeignKey('questions.id'), primary_key=True)
    episode_id = Column(String(100), ForeignKey('episodes.id'))
    isCorrect = Column(Boolean, default=False)



# Association table between Users and Episodes
user_answered_episodes = Table(
    "user_answered_episodes", Base.metadata,
    Column('user_id', String(100), ForeignKey('users.id'), nullable=False),
    Column('episode_id', String(100), ForeignKey('episodes.id'), nullable=False),
    Column('episode_score', nullable=False, default=0),
)

