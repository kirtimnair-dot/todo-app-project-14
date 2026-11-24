from routes.task_routes import task_bp
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.admin_routes import admin_bp

from config import Config
from routes.auth_routes import auth_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for all routes and standard origins/headers
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    supports_credentials=False
)
jwt = JWTManager(app)

# Register authentication and resource routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(task_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api/admin")


@app.route("/")
def home():
    return jsonify({
        "message": "To-Do App Backend is Running!",
        "status": "success"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "message": "Backend API is working"
    })


@app.errorhandler(400)
def bad_request(e):
    return jsonify({"message": getattr(e, "description", "Bad Request")}), 400


@app.errorhandler(404)
def not_found(e):
    return jsonify({"message": getattr(e, "description", "Resource Not Found")}), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({"message": "An internal server error occurred"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
