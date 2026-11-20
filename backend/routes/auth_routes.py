
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from db import get_db_connection
from utils.password_utils import hash_password, verify_password

auth_bp = Blueprint("auth", __name__)


# REGISTER API
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"message": "Invalid request"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        password_hash = hash_password(password)

        cursor.execute(
            """
            INSERT INTO users (name, email, password_hash, role)
            VALUES (%s, %s, %s, %s)
            """,
            (name, email, password_hash, "user")
        )

        connection.commit()

        return jsonify({"message": "Registration successful"}), 201

    except Exception as error:
        connection.rollback()

        if getattr(error, "errno", None) == 1062:
            return jsonify({"message": "Email already registered"}), 409

        return jsonify({"message": "Registration failed"}), 500

    finally:
        cursor.close()
        connection.close()


# LOGIN API
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"message": "Invalid request"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM users WHERE email = %s",
            (email,)
        )

        user = cursor.fetchone()

        if not user or not verify_password(
            password, user["password_hash"]
        ):
            return jsonify({"message": "Invalid email or password"}), 401

        access_token = create_access_token(
            identity=str(user["id"]),
            additional_claims={"role": user["role"]}
        )

        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200

    finally:
        cursor.close()
        connection.close()
