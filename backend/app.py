from flask_cors import CORS
from flask import Flask, jsonify

app = Flask(__name__)
CORS(app)

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
