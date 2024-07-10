#!/usr/bin/python3
"""Defines the db storage methods."""

import os

from sqlalchemy import create_engine, select, desc, and_
from sqlalchemy.orm import sessionmaker, scoped_session

from models.base_model import Base
from models.main_models import User


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



