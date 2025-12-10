import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from db_service import DatabaseService

import os
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")  # change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# Removed passlib context

class AuthService:
    def __init__(self):
        self.db = DatabaseService()

    # ✅ HASH PASSWORD (BCRYPT DIRECT)
    def hash_password(self, password: str) -> str:
        # bcrypt requires bytes
        pwd_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(pwd_bytes, salt)
        return hashed.decode('utf-8')

    # ✅ VERIFY PASSWORD (BCRYPT DIRECT)
    def verify_password(self, password: str, hashed: str) -> bool:
        pwd_bytes = password.encode('utf-8')
        hashed_bytes = hashed.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)

    # ✅ CREATE JWT TOKEN
    def create_access_token(self, data: dict):
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = data.copy()
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # ✅ SIGNUP
    def signup(self, email, password):
        hashed_pw = self.hash_password(password)   # ✅ hash ONLY ONCE
        user_id = self.db.create_user(email, hashed_pw)

        if not user_id:
            return None

        token = self.create_access_token({"user_id": user_id})
        return {"user_id": user_id, "token": token}


    # ✅ LOGIN
    def login(self, email, password):
        user = self.db.get_user_by_email(email)

        if not user:
            return None

        user_id, stored_hashed_password = user

        if not self.verify_password(password, stored_hashed_password):
            return None

        token = self.create_access_token({"user_id": user_id})

        return {
        "user_id": user_id,
        "token": token
    }



