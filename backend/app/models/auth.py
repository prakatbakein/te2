from pydantic import BaseModel, EmailStr
from typing import Optional


class UserSignup(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str  # e.g., 'candidate' or 'employer'


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class FirebaseAuthRequest(BaseModel):
    firebase_token: str
    role: str = "candidate"  # Default role for Firebase auth


class FirebaseLinkRequest(BaseModel):
    firebase_token: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    access_token: Optional[str] = None
    firebase_uid: Optional[str] = None
    profile_picture: Optional[str] = None
    auth_provider: Optional[str] = None
    email_verified: Optional[bool] = None
