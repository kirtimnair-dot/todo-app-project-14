from routes.task_routes import task_bp
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.admin_routes import admin_bp

from config import Config
from routes.auth_routes import auth_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
jwt = JWTManager(app)

# Register authentication routes
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


if __name__ == "__main__":
    app.run(debug=True)
