"""Main applicaion module that defines routes"""
import os
import traceback
from flask import Flask, request, jsonify, make_response, redirect, url_for
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity, verify_jwt_in_request, set_access_cookies, unset_jwt_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import timedelta, datetime, timezone
import time
import random
import string
import requests

from models.base_model import BaseModel
from models.main_models import *
from db_storage import DBStorage

from sqlalchemy.exc import SQLAlchemyError
from jwt import PyJWTError

app = Flask(__name__)
jwt = JWTManager(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://192.168.88.148:5173"}})  # Enable CORS for all routes

# app.secret_key = '1234567890op[kljhtresdfjkl.,mn]'
app.config["JWT_SECRET_KEY"] = 'os.urandom(32)'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']  # Instruct Flask-JWT-Extended to read tokens from cookies
app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['JWT_COOKIE_CSRF_PROTECT'] = False


def role_required(*roles):
    """Roles check wrapper"""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get('role', None)
            if user_role in roles:  # Check if user's role matches any of the required roles
                return fn(*args, **kwargs)
            else:
                return jsonify(access_denied="Invalid role")
        return decorator
    return wrapper

# Instantiate a storage object and flush all classes that needs to be mapped to database tables
storage = DBStorage()
storage.reload()
storage.save()
storage.close()

@app.route('/api/reg_temp_user', methods=['GET'], strict_slashes=False)
def create_temp_user():
    """Create temporary username and password"""
    def generate_username(length=8):
        """Generate a random username."""
        username = 'user_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
        return username

    def generate_password(length=12):
        """Generate a random password."""
        characters = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(random.choices(characters, k=length))
        return password
    
    username = generate_username()
    password = generate_password()
    role = 'member'

    # Check if username already exists
    if storage.get_user(username):
        return jsonify({"error": "Username already exists"}), 400

    password_hashed = generate_password_hash(password)

    try:
        storage.reload()
        new_user = User(
            username=username,
            password=password_hashed,
            role=role
        )
        storage.new(new_user)
        storage.save()

        access_token = create_access_token(
            identity=username,
            additional_claims={"role": role},
            expires_delta=timedelta(days=365)
        )
        response = jsonify(username=new_user.username, role=new_user.role, score=new_user.score)
        response = make_response(response)
        response.set_cookie('access_token_cookie', access_token, httponly=False, samesite='None', secure=True)
        
        # Set visited cookie
        expires_at = datetime.now(timezone.utc) + timedelta(days=365)
        response.set_cookie('visited', 'true', httponly=False, samesite='None', secure=True, expires=expires_at)

        return response

    except (SQLAlchemyError, PyJWTError) as e:
        storage.rollback()
        traceback.print_exc()
        return jsonify(error=str(e)), 500
    finally:
        storage.close()
    

@app.route('/api/register', methods=['POST', 'GET'], strict_slashes=False)
def register_user():
    """Register a new user."""
    if request.method == 'POST':
        registration_data = request.get_json()
        username = registration_data.get('username')
        password = registration_data.get('password')
        role = registration_data.get('role', 'member')

        # Early return if essential fields are missing
        if not all([username, password]):
            return jsonify({"error": "Missing required fields"}), 400

        # Check if username already exists
        if storage.get_user(username):
            return jsonify({"error": "Username already exists"}), 400

        password_hashed = generate_password_hash(password)

        try:
            storage.reload()
            new_user = User(
                username=username,
                password=password_hashed,
                role=role
            )
            storage.new(new_user)
            storage.save()

            access_token = create_access_token(
                identity=username,
                additional_claims={"role": role},
                expires_delta=timedelta(days=365)
            )
            response = jsonify(user=new_user.username, role=new_user.role)
            response = make_response(response)
            response.set_cookie('access_token_cookie', access_token, httponly=False, samesite='None', secure=True)
            
            # Set visited cookie
            expires_at = datetime.now(timezone.utc) + timedelta(days=365)
            response.set_cookie('visited', 'true', httponly=False, samesite='None', secure=True, expires=expires_at)

            return response

        except (SQLAlchemyError, PyJWTError) as e:
            storage.rollback()
            traceback.print_exc()
            return jsonify(error=str(e)), 500
        finally:
            storage.close()
    else:
        return jsonify({"error": "Invalid method"}), 405

@app.route('/api/login', methods=['POST'], strict_slashes=False)
def login():
    """Log in a user."""
    if request.method == 'POST':
        login_data = request.get_json()
        username = login_data.get('user')
        password = login_data.get('password')

        try:
            storage.reload()
            user = storage.get_user(username)

            if not user or not check_password_hash(user.password, password):
                return jsonify(error='Wrong username or password'), 401

            access_token = create_access_token(
                identity=user.username,
                additional_claims={"role": user.role},
                expires_delta=timedelta(days=356)
            )
            response = jsonify(username=user.username, role=user.role, score=user.score)
            response = make_response(response)
            response.set_cookie('access_token_cookie', access_token, httponly=False, samesite='None', secure=True)
            
            return response

        except (SQLAlchemyError, PyJWTError) as e:
            storage.rollback()
            traceback.print_exc()
            return jsonify(error=str(e)), 500

        finally:
            storage.close()
    return jsonify({"error": "Invalid method"}), 405


@app.route("/api/logout", methods=["POST"])
@jwt_required()
def logout():
    """Log out a user."""
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

# # Using an `after_request` callback, we refresh any token that is within 30 minutes of expiry
# @app.after_request
# def refresh_expiring_jwts(response):
#     """Refresh expiring JWT tokens."""
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
#         if target_timestamp > exp_timestamp:
#             username = get_jwt()["sub"]
#             role = get_jwt()["role"]
#             access_token = create_access_token(
#                 identity=username,
#                 additional_claims={"role": role},
#                 expires_delta=timedelta(hours=5000)
#             )
#             response.set_cookie('access_token', access_token, httponly=True, samesite='None', secure=True)
#         return response
#     except (RuntimeError, KeyError):
#         # Case where there is not a valid JWT. Just return the original response
#         return response

@app.route('/api/questions', methods=['GET'])
@jwt_required()
def get_questions():
    """retrieves trivia questions"""
    try:
        questions = storage.all_questions()
        return jsonify(questions)
    except Exception as e:
        traceback.print_exc()
        return jsonify(error="Error retrieving questions")
    finally:
        storage.close()

@app.route('/api/score', methods=['POST'])
@jwt_required()
def calculate_score():
    """calculates scores"""
    try:
        player_answers = request.json
        username = get_jwt_identity()
        score = storage.update_score(username, player_answers)

        return jsonify({"score": score})
    except Exception as e:
        storage.rollback()
        traceback.print_exc()
        return jsonify(error="Error calculating score")
    finally:
        storage.close()

@app.route('/api/leaderboard', methods=['GET'])
@jwt_required()
def get_leader_board():
    """Get top five highest scores(username and score) and the position and score of the current user"""
    try:
        username = get_jwt_identity()
        leader_board = storage.get_top_scores(username)
        print(leader_board)
        return jsonify(leader_board)
    except Exception as e:
        traceback.print_exc()
        return jsonify(error='Error getting score board')
    finally:
        storage.close()

@app.route('/api/episodes', methods=['GET'])
@jwt_required()
def get_all_episodes():
    """Retrieves all podcast episodes in the database"""
    try:
        episodes = storage.all_episodes()
        return jsonify(episodes)
    except Exception as e:
        traceback.print_exc()
        return jsonify(error='Unable to retrieve episodes')
    finally:
        storage.close()

@app.route('/api/categories', methods=['GET'])
@jwt_required()
def get_all_categories():
    """Retrieves all question categories in the database"""
    try:
        categories = storage.all_categories()
        return jsonify(categories)
    except Exception as e:
        traceback.print_exc()
        return jsonify(error='Unable to retrieve categories')
    finally:
        storage.close()

@app.route('/api/new_episode', methods=['POST'])
@jwt_required()
def add_new_episode():
    """Adds a new episode to the database"""
    try:
        data = request.get_json()
        print(data)
        new_episode = Episode(
            title = data['episodeTitle'],
            episode_no = data['episodeNumber'],
            featured_guest = data['featuredGuest']
        )
        storage.new(new_episode)
        return jsonify(status='Success')

    except Exception as e:
        traceback.print_exc()
        storage.rollback()
        return jsonify(error='Unable to add episode')
    
    finally:
        storage.save()
        storage.close()

@app.route('/api/new_question', methods=['POST'])
@jwt_required()
def add_new_question():
    """Adds a new question to the database"""
    try:
        data = request.get_json()
        print(data)
        new_question = Question(
            question_text=data['question'],
            episode_id=data['selectedEpisode'],
            category_id=data['selectedCategory']
        )
        storage.new(new_question)
        
        # Create Answer objects and associate them with the new question
        answer_objects = []
        for answer in data['choices']:
            if answer['choiceText'] != '':
                answer_object = Answer(
                        answer_text=answer['choiceText'],
                        is_correct=answer['isCorrect'],
                        question_id=new_question.id
                    )
                answer_objects.append(answer_object)
                
        for choice in answer_objects:
            storage.new(choice)

        return jsonify(status='Success')

    except Exception as e:
        traceback.print_exc()
        storage.rollback()
        return jsonify(error='Unable to add question')
    
    finally:
        storage.save()
        storage.close()

@app.route('/api/admin_data', methods=['GET'])
@jwt_required()
def get_admin_data():
    """Retrieves data neede in the admin dashboard"""
    try:
        admin_data = storage.all_admin_data()
        return jsonify(admin_data)
    except Exception as e:
        traceback.print_exc()
        return jsonify(error='Unable to retrieve dashboard data')
    finally:
        storage.close()

@app.route('/api/change_username', methods=['POST'])
@jwt_required()
def update_username():
    """Updates username"""
    try:
        data = request.get_json()
        username = get_jwt_identity()
        change_status = storage.update_username(username, data["user"])
        response = jsonify(status=change_status)

        if change_status == 'Success':
        #Ensure that you issue a new access token coz of the identity change due to change in username
            access_token = create_access_token(
                    identity=data["user"],
                    additional_claims={"role": "member"},
                    expires_delta=timedelta(days=365)
                )
            response.set_cookie('access_token_cookie', access_token, httponly=False, samesite='None', secure=True)
        return response

    except Exception as e:
        traceback.print_exc()
        return jsonify(error="Error updating username")
    finally:
        storage.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, ssl_context=('192.168.88.148.pem', '192.168.88.148-key.pem'), debug=True)

