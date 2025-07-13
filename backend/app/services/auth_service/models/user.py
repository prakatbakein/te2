from beanie import Document
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime


class User(Document):
    email: EmailStr
    hashed_password: Optional[str] = None  # Made optional for Google OAuth users
    full_name: Optional[str] = None
    role: str = Field(default="candidate", description="candidate or employer")
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Firebase/Google OAuth specific fields
    firebase_uid: Optional[str] = None  # Firebase UID for Google auth users
    google_id: Optional[str] = None  # Google account ID
    profile_picture: Optional[str] = None  # Google profile picture URL
    auth_provider: str = Field(default="local", description="local, google, or firebase")
    email_verified: bool = Field(default=False)

    class Settings:
        name = "users"  # MongoDB collection name

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "john@example.com",
                "hashed_password": "hashedpassword123",
                "full_name": "John Doe",
                "role": "candidate",
                "firebase_uid": "firebase_uid_here",
                "google_id": "google_id_here",
                "profile_picture": "https://example.com/profile.jpg",
                "auth_provider": "google",
                "email_verified": True
            }
        }
    }
