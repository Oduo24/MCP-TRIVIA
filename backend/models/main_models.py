"""Base model for all models"""

from sqlalchemy import Column, String, DateTime, Date, Integer, Enum, Float, Index, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from models.base_model import BaseModel, Base

class User(BaseModel, Base):
    """Defines the User class"""
    __tablename__ = "users"

    username = Column(String(100), nullable=False)
    password = Column(String(500), nullable=False)
    role = Column(Enum('admin', 'member'), nullable=False)


    def __init__(self, **kwargs):
        """Initializes a User instance
        """
        super().__init__(**kwargs)

