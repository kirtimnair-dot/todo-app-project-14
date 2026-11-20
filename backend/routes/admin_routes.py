
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity

from db import get_db_connection
from middleware.auth_middleware import role_required

admin_bp = Blueprint("admin", __name__)


# VIEW ALL USERS
@admin_bp.route("/users", methods=["GET"])
@role_required("admin")
def get_all_users():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, name, email, role, created_at FROM users"
        )
        users = cursor.fetchall()

        return jsonify({"users": users}), 200

    finally:
        cursor.close()
        connection.close()


# UPDATE USER ROLE
@admin_bp.route("/users/<int:user_id>/role", methods=["PUT"])
@role_required("admin")
def update_user_role(user_id):
    data = request.get_json() or {}
    role = data.get("role")

    if role not in ["user", "admin"]:
        return jsonify({"message": "Invalid role"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "UPDATE users SET role = %s WHERE id = %s",
            (role, user_id)
        )

        if cursor.rowcount == 0:
            return jsonify({"message": "User not found or role unchanged"}), 404

        connection.commit()

        return jsonify({"message": "User role updated successfully"}), 200

    finally:
        cursor.close()
        connection.close()


# DELETE USER
@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@role_required("admin")
def delete_user(user_id):
    current_admin_id = int(get_jwt_identity())

    if user_id == current_admin_id:
        return jsonify({"message": "You cannot delete your own account"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "DELETE FROM users WHERE id = %s",
            (user_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({"message": "User not found"}), 404

        connection.commit()

        return jsonify({"message": "User deleted successfully"}), 200

    finally:
        cursor.close()
        connection.close()


# VIEW ALL TASKS
@admin_bp.route("/tasks", methods=["GET"])
@role_required("admin")
def get_all_tasks():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT tasks.*, users.name AS user_name, users.email AS user_email
            FROM tasks
            JOIN users ON tasks.user_id = users.id
            ORDER BY tasks.created_at DESC
        """)

        tasks = cursor.fetchall()

        return jsonify({"tasks": tasks}), 200

    finally:
        cursor.close()
        connection.close()


# DASHBOARD STATISTICS
@admin_bp.route("/stats", methods=["GET"])
@role_required("admin")
def get_statistics():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM tasks) AS total_tasks,
                (SELECT COUNT(*) FROM tasks WHERE status = 'pending') AS pending_tasks,
                (SELECT COUNT(*) FROM tasks WHERE status = 'completed') AS completed_tasks
        """)

        stats = cursor.fetchone()

        return jsonify({"statistics": stats}), 200

    finally:
        cursor.close()
        connection.close()
