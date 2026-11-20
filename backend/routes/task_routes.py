
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from db import get_db_connection

task_bp = Blueprint("tasks", __name__)


# CREATE TASK
@task_bp.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    data = request.get_json() or {}

    title = data.get("title")
    description = data.get("description")
    priority = data.get("priority", "medium")
    due_date = data.get("due_date")

    if not title:
        return jsonify({"message": "Task title is required"}), 400

    if priority not in ["low", "medium", "high"]:
        return jsonify({"message": "Invalid priority"}), 400

    user_id = get_jwt_identity()

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            INSERT INTO tasks (user_id, title, description, priority, due_date)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (user_id, title, description, priority, due_date)
        )

        task_id = cursor.lastrowid
        connection.commit()

        cursor.execute(
            "SELECT * FROM tasks WHERE id = %s AND user_id = %s",
            (task_id, user_id)
        )

        task = cursor.fetchone()

        return jsonify({
            "message": "Task created successfully",
            "task": task
        }), 201

    finally:
        cursor.close()
        connection.close()


# GET ALL USER TASKS
@task_bp.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM tasks WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )

        tasks = cursor.fetchall()

        return jsonify({"tasks": tasks}), 200

    finally:
        cursor.close()
        connection.close()


# UPDATE TASK
@task_bp.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    data = request.get_json() or {}
    user_id = get_jwt_identity()

    allowed_fields = ["title", "description", "status", "priority", "due_date"]
    updates = []
    values = []

    for field in allowed_fields:
        if field in data:
            updates.append(f"{field} = %s")
            values.append(data[field])

    if not updates:
        return jsonify({"message": "No fields provided for update"}), 400

    if "title" in data and not data["title"]:
        return jsonify({"message": "Task title cannot be empty"}), 400

    if "status" in data and data["status"] not in ["pending", "completed"]:
        return jsonify({"message": "Invalid task status"}), 400

    if "priority" in data and data["priority"] not in ["low", "medium", "high"]:
        return jsonify({"message": "Invalid priority"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        values.extend([task_id, user_id])

        cursor.execute(
            f"UPDATE tasks SET {', '.join(updates)} WHERE id = %s AND user_id = %s",
            tuple(values)
        )

        if cursor.rowcount == 0:
            connection.rollback()
            return jsonify({"message": "Task not found"}), 404

        connection.commit()

        return jsonify({"message": "Task updated successfully"}), 200

    finally:
        cursor.close()
        connection.close()


# DELETE TASK
@task_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "DELETE FROM tasks WHERE id = %s AND user_id = %s",
            (task_id, user_id)
        )

        if cursor.rowcount == 0:
            return jsonify({"message": "Task not found"}), 404

        connection.commit()

        return jsonify({"message": "Task deleted successfully"}), 200

    finally:
        cursor.close()
        connection.close()
