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

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

# Existing Routes (unchanged)
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if db.users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 400
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), salt)
    user = {
        "email": data["email"],
        "password": hashed_password,
        "role": data["role"],
        "created_at": datetime.utcnow()
    }
    db.users.insert_one(user)
    access_token = create_access_token({"sub": data["email"]})
    return jsonify({
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer"
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = db.users.find_one({"email": data["email"]})
    if not user or not bcrypt.checkpw(data["password"].encode('utf-8'), user["password"]) or user["role"] != data["role"]:
        return jsonify({"error": "Invalid credentials"}), 401
    access_token = create_access_token({"sub": user["email"]})
    return jsonify({
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"email": user["email"], "role": user["role"]}
    })

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Invalid token"}), 401
    token = auth_header.split(' ')[1]
    email = verify_token(token)
    if not email:
        return jsonify({"error": "Invalid token"}), 401
    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.pop("password", None)
    return jsonify(user)

# New Appointment Scheduling Route
@app.route('/api/appointments/schedule', methods=['POST'])
def schedule_appointment():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authentication required"}), 401
    
    token = auth_header.split(' ')[1]
    patient_email = verify_token(token)
    if not patient_email:
        return jsonify({"error": "Invalid token"}), 401
    
    data = request.get_json()
    
    # Verify user is a patient
    user = db.users.find_one({"email": patient_email})
    if not user or user["role"] != "patient":
        return jsonify({"error": "Only patients can schedule appointments"}), 403
    
    # Basic validation
    required_fields = ['specialty', 'doctor', 'date', 'time', 'reason']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if appointment slot is available (simplified check)
    existing_appointment = db.appointments.find_one({
        "doctor": data["doctor"],
        "date": data["date"],
        "time": data["time"]
    })
    if existing_appointment:
        return jsonify({"error": "This time slot is already booked"}), 409
    
    # Create appointment document
    appointment = {
        "patientEmail": patient_email,
        "specialty": data["specialty"],
        "doctor": data["doctor"],
        "date": data["date"],
        "time": data["time"],
        "reason": data["reason"],
        "status": "Scheduled",
        "created_at": datetime.utcnow()
    }
    
    # Insert into database
    result = db.appointments.insert_one(appointment)
    
    return jsonify({
        "message": "Appointment scheduled successfully",
        "appointment_id": str(result.inserted_id),
        "details": {
            "specialty": data["specialty"],
            "doctor": data["doctor"],
            "date": data["date"],
            "time": data["time"],
            "reason": data["reason"]
        }
    }), 201

if __name__ == '__main__':
    app.run(debug=True)