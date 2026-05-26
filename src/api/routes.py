"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User
from api.utils import hash_password, verify_password
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = (data.get('password') or '').strip()

    if not email or not password:
        return jsonify({"ok": False, "msg": "Email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"ok": False, "msg": "Password must be at least 6 characters long"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"ok": False, "msg": "A user with this email already exists"}), 409

    new_user = User(
        email=email,
        password=hash_password(password),
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "ok": True,
        "msg": "User created successfully",
        "user": new_user.serialize()
    }), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = (data.get('password') or '').strip()

    if not email or not password:
        return jsonify({"ok": False, "msg": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None or not verify_password(password, user.password):
        return jsonify({"ok": False, "msg": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "ok": True,
        "msg": "Login successful",
        "token": token,
        "user": user.serialize()
    }), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    user_id = get_jwt_identity()

    try:
        user = User.query.get(int(user_id))
    except (TypeError, ValueError):
        return jsonify({"ok": False, "msg": "Invalid token subject"}), 422

    if user is None:
        return jsonify({"ok": False, "msg": "User not found"}), 404

    return jsonify({
        "ok": True,
        "msg": "You are authorized to view this private page",
        "user": user.serialize()
    }), 200
