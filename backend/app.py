from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client.hospivibe

# JWT configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Helper functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Routes 
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if db.users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 400
    
    # Hash password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), salt)
    
    # Create user document
    user = {
        "email": data["email"],
        "password": hashed_password,
        "role": data["role"],
        "created_at": datetime.utcnow()
    }
    
    # Insert user into database
    db.users.insert_one(user)
    
    # Create access token
    access_token = create_access_token({"sub": data["email"]})
    
    return jsonify({
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer"
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Find user
    user = db.users.find_one({"email": data["email"]})
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Verify password
    if not bcrypt.checkpw(data["password"].encode('utf-8'), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Create access token
    access_token = create_access_token({"sub": user["email"]})
    
    return jsonify({
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "role": user["role"]
        }
    })

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    # Get token from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Invalid token"}), 401
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        
        # Get user from database
        user = db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Remove sensitive information
        user.pop("password", None)
        return jsonify(user)
        
    except JWTError:
        return jsonify({"error": "Invalid token"}), 401

if __name__ == '__main__':
    app.run(debug=True) 