from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from bson import ObjectId
import re
from werkzeug.security import generate_password_hash, check_password_hash

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "allow_headers": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

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

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password(password: str) -> bool:
    # Password must be at least 8 characters long and contain at least one number and one letter
    return len(password) >= 8 and bool(re.search(r'\d', password)) and bool(re.search(r'[a-zA-Z]', password))

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Validate email format
        if not validate_email(data["email"]):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Validate password strength
        if not validate_password(data["password"]):
            return jsonify({
                "error": "Password must be at least 8 characters long and contain at least one number and one letter"
            }), 400
        
        # Validate role
        valid_roles = ['admin', 'doctor', 'nurse', 'patient']
        if data["role"] not in valid_roles:
            return jsonify({"error": "Invalid role"}), 400
        
        # Check if email already exists
        if db.users.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already registered"}), 400
        
        # Hash password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), salt)
        
        # Create user document
        user = {
            "name": data["name"],
            "email": data["email"],
            "password": hashed_password,
            "role": data["role"],
            "created_at": datetime.utcnow(),
            "onboarding_complete": False
        }
        
        # Insert user into database
        result = db.users.insert_one(user)
        
        # Create access token
        access_token = create_access_token({"sub": str(result.inserted_id)})
        
        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(result.inserted_id),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Find user by email
        user = db.users.find_one({"email": data["email"]})
        
        # Check if user exists and password matches
        if not user or not bcrypt.checkpw(data["password"].encode('utf-8'), user["password"]) or user["role"] != data["role"]:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Create access token
        access_token = create_access_token({"sub": str(user["_id"])})
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "onboarding_complete": user.get("onboarding_complete", False)
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid token"}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401
        
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Remove sensitive information
        user.pop("password", None)
        user["_id"] = str(user["_id"])
        
        return jsonify(user)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user/onboarding', methods=['POST'])
def complete_onboarding():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid token"}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401
        
        # Update user's onboarding status
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"onboarding_complete": True}}
        )
        
        if result.modified_count == 0:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"message": "Onboarding completed successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Appointment routes
@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid token"}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401
        
        # Verify user is a patient
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user or user["role"] != "patient":
            return jsonify({"error": "Only patients can schedule appointments"}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['doctor_id', 'date', 'time', 'reason']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if doctor exists
        doctor = db.users.find_one({"_id": ObjectId(data["doctor_id"]), "role": "doctor"})
        if not doctor:
            return jsonify({"error": "Doctor not found"}), 404
        
        # Check if appointment slot is available
        existing_appointment = db.appointments.find_one({
            "doctor_id": ObjectId(data["doctor_id"]),
            "date": data["date"],
            "time": data["time"],
            "status": {"$ne": "cancelled"}
        })
        
        if existing_appointment:
            return jsonify({"error": "This time slot is already booked"}), 409
        
        # Create appointment
        appointment = {
            "patient_id": ObjectId(user_id),
            "doctor_id": ObjectId(data["doctor_id"]),
            "date": data["date"],
            "time": data["time"],
            "reason": data["reason"],
            "status": "scheduled",
            "created_at": datetime.utcnow()
        }
        
        result = db.appointments.insert_one(appointment)
        
        return jsonify({
            "message": "Appointment scheduled successfully",
            "appointment": {
                "id": str(result.inserted_id),
                "patient_id": str(appointment["patient_id"]),
                "doctor_id": str(appointment["doctor_id"]),
                "date": appointment["date"],
                "time": appointment["time"],
                "reason": appointment["reason"],
                "status": appointment["status"]
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Existing appointment schedule route (keeping for backward compatibility)
@app.route('/api/appointments/schedule', methods=['POST'])
def schedule_appointment_legacy():
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

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        auth_header = request.headers.get('Authorization')
        print(f"Auth header: {auth_header}")
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid token"}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401
        
        # Get role from query parameters
        role = request.args.get('role')
        if not role:
            return jsonify({"error": "Role parameter is required"}), 400
        
        # Find users by role
        users = list(db.users.find({"role": role}))
        
        # Remove sensitive information and convert ObjectId to string
        for user in users:
            user.pop("password", None)
            user["_id"] = str(user["_id"])
        
        return jsonify(users)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid token"}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401
        
        # Get user role
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Build query based on user role
        query = {}
        if user["role"] == "patient":
            query["patient_id"] = ObjectId(user_id)
        elif user["role"] == "doctor":
            query["doctor_id"] = ObjectId(user_id)
        
        # Get appointments
        appointments = list(db.appointments.find(query))
        
        # Get related user information
        for appointment in appointments:
            # Get patient information
            patient = db.users.find_one({"_id": appointment["patient_id"]})
            if patient:
                appointment["patient"] = {
                    "id": str(patient["_id"]),
                    "name": patient["name"],
                    "email": patient["email"]
                }
            
            # Get doctor information
            doctor = db.users.find_one({"_id": appointment["doctor_id"]})
            if doctor:
                appointment["doctor"] = {
                    "id": str(doctor["_id"]),
                    "name": doctor["name"],
                    "email": doctor["email"]
                }
            
            # Convert ObjectId to string
            appointment["_id"] = str(appointment["_id"])
            appointment["patient_id"] = str(appointment["patient_id"])
            appointment["doctor_id"] = str(appointment["doctor_id"])
        
        return jsonify(appointments)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/appointments/<appointment_id>', methods=['PUT'])
def update_appointment_status(appointment_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid token"}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401
        
        data = request.get_json()
        update_fields = {}
        
        # Check which fields to update
        if "status" in data:
            update_fields["status"] = data["status"]
        
        if "doctor_notes" in data:
            update_fields["doctor_notes"] = data["doctor_notes"]
        
        if not update_fields:
            return jsonify({"error": "No fields to update provided"}), 400
        
        # Verify user has permission to update appointment
        appointment = db.appointments.find_one({"_id": ObjectId(appointment_id)})
        if not appointment:
            return jsonify({"error": "Appointment not found"}), 404
        
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Permission checks based on role
        if user["role"] == "doctor":
            if str(appointment["doctor_id"]) != user_id:
                return jsonify({"error": "Unauthorized"}), 403
        elif user["role"] == "patient":
            if str(appointment["patient_id"]) != user_id:
                return jsonify({"error": "Unauthorized"}), 403
            # Patients can only cancel appointments, not add notes
            if "doctor_notes" in update_fields:
                return jsonify({"error": "Patients cannot add doctor notes"}), 403
        
        # Update appointment with allowed fields
        result = db.appointments.update_one(
            {"_id": ObjectId(appointment_id)},
            {"$set": update_fields}
        )
        
        if result.modified_count == 0:
            return jsonify({"error": "Failed to update appointment"}), 500
        
        return jsonify({"message": "Appointment updated successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 