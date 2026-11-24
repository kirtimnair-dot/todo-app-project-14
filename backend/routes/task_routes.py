from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from db import get_db_connection

task_bp = Blueprint("tasks", __name__)


def format_task(task_dict):
    """Format MySQL row dictionary to ensure dates are ISO strings."""
    if not task_dict:
        return task_dict
    formatted = dict(task_dict)
    if formatted.get("due_date") and hasattr(formatted["due_date"], "isoformat"):
        formatted["due_date"] = formatted["due_date"].isoformat()
    if formatted.get("created_at") and hasattr(formatted["created_at"], "isoformat"):
        formatted["created_at"] = formatted["created_at"].isoformat()
    return formatted


# CREATE TASK
@task_bp.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    data = request.get_json() or {}

    title = (data.get("title") or "").strip()
    description = data.get("description")
    if description is not None and str(description).strip() == "":
        description = None

    priority = data.get("priority", "medium")
    if priority not in ["low", "medium", "high"]:
        priority = "medium"

    due_date = data.get("due_date")
    if not due_date or str(due_date).strip() == "":
        due_date = None

    if not title:
        return jsonify({"message": "Task title is required"}), 400

    user_id = int(get_jwt_identity())

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

        raw_task = cursor.fetchone()
        task = format_task(raw_task)

        return jsonify({
            "message": "Task created successfully",
            "task": task
        }), 201

    except Exception as error:
        connection.rollback()
        return jsonify({"message": f"Failed to create task: {str(error)}"}), 500

    finally:
        cursor.close()
        connection.close()


# GET ALL USER TASKS
@task_bp.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = int(get_jwt_identity())

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM tasks WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )

        raw_tasks = cursor.fetchall()
        tasks = [format_task(t) for t in raw_tasks]

        return jsonify({"tasks": tasks}), 200

    except Exception as error:
        return jsonify({"message": f"Failed to fetch tasks: {str(error)}"}), 500

    finally:
        cursor.close()
        connection.close()


# UPDATE TASK
@task_bp.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    data = request.get_json() or {}
    user_id = int(get_jwt_identity())

    allowed_fields = ["title", "description", "status", "priority", "due_date"]
    updates = []
    values = []

    for field in allowed_fields:
        if field in data:
            val = data[field]
            if field == "title":
                if not val or not str(val).strip():
                    return jsonify({"message": "Task title cannot be empty"}), 400
                val = str(val).strip()
            elif field == "due_date":
                if not val or str(val).strip() == "":
                    val = None
            elif field == "description":
                if val is not None and str(val).strip() == "":
                    val = None
            elif field == "status":
                if val not in ["pending", "completed"]:
                    return jsonify({"message": "Invalid task status"}), 400
            elif field == "priority":
                if val not in ["low", "medium", "high"]:
                    return jsonify({"message": "Invalid priority"}), 400

            updates.append(f"{field} = %s")
            values.append(val)

    if not updates:
        return jsonify({"message": "No fields provided for update"}), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        values.extend([task_id, user_id])

        cursor.execute(
            f"UPDATE tasks SET {', '.join(updates)} WHERE id = %s AND user_id = %s",
            tuple(values)
        )

        if cursor.rowcount == 0:
            # Check if task actually exists but values were unchanged
            cursor.execute(
                "SELECT * FROM tasks WHERE id = %s AND user_id = %s",
                (task_id, user_id)
            )
            existing = cursor.fetchone()
            if not existing:
                connection.rollback()
                return jsonify({"message": "Task not found"}), 404

        connection.commit()

        cursor.execute(
            "SELECT * FROM tasks WHERE id = %s AND user_id = %s",
            (task_id, user_id)
        )
        updated_task = format_task(cursor.fetchone())

        return jsonify({
            "message": "Task updated successfully",
            "task": updated_task
        }), 200

    except Exception as error:
        connection.rollback()
        return jsonify({"message": f"Failed to update task: {str(error)}"}), 500

    finally:
        cursor.close()
        connection.close()


# DELETE TASK
@task_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = int(get_jwt_identity())

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

    except Exception as error:
        connection.rollback()
        return jsonify({"message": f"Failed to delete task: {str(error)}"}), 500

    finally:
        cursor.close()
        connection.close()
