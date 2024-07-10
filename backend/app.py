"""Main applicaion module that defines routes"""
import os
import traceback
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity, verify_jwt_in_request, set_access_cookies, unset_jwt_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import timedelta, datetime, timezone

from models.base_model import BaseModel
from models.main_models import *
from db_storage import DBStorage

from sqlalchemy.exc import SQLAlchemyError
from jwt import PyJWTError

app = Flask(__name__)
jwt = JWTManager(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://localhost:5173"}})  # Enable CORS for all routes

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

# Dummy data for questions
questions = [
    {"id": 1, "question": "What is the capital of France?", "options": ["Paris", "London", "Berlin", "Madrid"], "answer": "Paris"},
    {"id": 2, "question": "What is 2 + 2?", "options": ["3", "4", "5", "6"], "answer": "4"},
    {"id": 3, "question": "Who painted the Mona Lisa?", "options": ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"], "answer": "Leonardo da Vinci"},
    {"id": 4, "question": "What is the largest planet in our solar system?", "options": ["Earth", "Jupiter", "Saturn", "Mars"], "answer": "Jupiter"},
    {"id": 5, "question": "Which country is famous for kangaroos?", "options": ["Australia", "Brazil", "Canada", "India"], "answer": "Australia"},
    {"id": 7, "question": "Which planet is known as the Red Planet?", "options": ["Earth", "Jupiter", "Mars", "Venus"], "answer": "Mars"},
    {"id": 8, "question": "What is the tallest mountain in the world?", "options": ["Mount Everest", "K2", "Kangchenjunga", "Makalu"], "answer": "Mount Everest"},
    {"id": 9, "question": "What is the chemical symbol for water?", "options": ["H2O", "CO2", "NaCl", "O2"], "answer": "H2O"}
]

# Instantiate a storage object and flush all classes that needs to be mapped to database tables
storage = DBStorage()
storage.reload()
storage.save()
storage.close()

@app.route('/', methods=['GET'], strict_slashes=False)
def test():
    """Test."""
    return jsonify(test="Success")


@app.route('/api/register', methods=['POST'], strict_slashes=False)
def register_user():
    """Register a new user."""
    if request.method == 'POST':
        print(request.get_json())
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
                expires_delta=timedelta(hours=24)
            )
            response = jsonify({"message": "User registered successfully"})
            response = make_response(response)
            response.set_cookie('access_token_cookie', access_token, httponly=True, samesite='None', secure=True)
            return response

        except (SQLAlchemyError, PyJWTError) as e:
            storage.rollback()
            traceback.print_exc()
            return jsonify(error=str(e)), 500
        finally:
            storage.close()
    return jsonify({"error": "Invalid method"}), 405

@app.route('/api/login', methods=['POST'], strict_slashes=False)
def login():
    """Log in a user."""
    if request.method == 'POST':
        login_data = request.get_json()
        username = login_data.get('username')
        password = login_data.get('password')

        try:
            storage.reload()
            user = storage.get_user(username)

            if not user or not check_password_hash(user.password, password):
                return jsonify(error='Wrong username or password'), 401

            access_token = create_access_token(
                identity=user.username,
                additional_claims={"role": user.role},
                expires_delta=timedelta(hours=24)
            )
            response = jsonify(user=user.username)
            response = make_response(response)
            response.set_cookie('access_token_cookie', access_token, httponly=True, samesite='None', secure=True)
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

# Using an `after_request` callback, we refresh any token that is within 30 minutes of expiry
@app.after_request
def refresh_expiring_jwts(response):
    """Refresh expiring JWT tokens."""
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            username = get_jwt()["sub"]
            role = get_jwt()["role"]
            access_token = create_access_token(
                identity=username,
                additional_claims={"role": role},
                expires_delta=timedelta(hours=24)
            )
            response.set_cookie('access_token', access_token, httponly=True, samesite='None', secure=True)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response


@app.route('/api/questions', methods=['GET'])
@jwt_required()
def get_questions():
    """retrieves trivia questions"""
    return jsonify(questions)

@app.route('/api/score', methods=['POST'])
@jwt_required()
def calculate_score():
    """calculates scores"""
    data = request.json
    print(data)
    score = 0
    for question in questions:
        user_answer = data.get(str(question["id"]))
        if user_answer == question["answer"]:
            score += 1
    return jsonify({"score": score})

if __name__ == '__main__':
    app.run(ssl_context=('localhost.pem', 'localhost-key.pem'), debug=True)
