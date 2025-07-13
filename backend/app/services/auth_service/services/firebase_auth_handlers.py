# app/services/auth_service/services/firebase_auth_handlers.py

from app.services.firebase_service import firebase_service
from app.services.auth_service.models.user import User
from app.services.auth_service.services.jwt_handler import create_access_token
from fastapi import HTTPException
from typing import Optional


async def handle_firebase_auth(firebase_token: str, role: str = "candidate") -> dict:
    """Handle Firebase authentication and create/login user"""
    try:
        # Verify Firebase token
        decoded_token = await firebase_service.verify_firebase_token(firebase_token)
        if not decoded_token:
            raise HTTPException(status_code=401, detail="Invalid Firebase token")
        
        # Extract user data from token
        firebase_uid = decoded_token.get('uid')
        email = decoded_token.get('email')
        name = decoded_token.get('name', '')
        picture = decoded_token.get('picture', '')
        email_verified = decoded_token.get('email_verified', False)
        
        if not email or not firebase_uid:
            raise HTTPException(status_code=400, detail="Email and UID are required")
        
        # Check if user already exists
        existing_user = await User.find_one(
            {"$or": [
                {"email": email},
                {"firebase_uid": firebase_uid}
            ]}
        )
        
        if existing_user:
            # Update existing user with Firebase data if needed
            if not existing_user.firebase_uid:
                existing_user.firebase_uid = firebase_uid
                existing_user.auth_provider = "firebase"
                existing_user.email_verified = email_verified
                if picture:
                    existing_user.profile_picture = picture
                await existing_user.save()
            
            user = existing_user
        else:
            # Create new user
            user = User(
                email=email,
                full_name=name,
                role=role,
                firebase_uid=firebase_uid,
                profile_picture=picture,
                auth_provider="firebase",
                email_verified=email_verified,
                hashed_password=None  # No password for Firebase users
            )
            await user.insert()
        
        # Generate JWT token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        # Prepare user response
        user_dict = user.dict()
        user_dict["id"] = str(user.id)
        user_dict.pop("hashed_password", None)  # Remove password from response
        
        return {"access_token": access_token, **user_dict}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in Firebase auth: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")


async def link_firebase_account(user_id: str, firebase_token: str) -> dict:
    """Link Firebase account to existing user"""
    try:
        # Verify Firebase token
        decoded_token = await firebase_service.verify_firebase_token(firebase_token)
        if not decoded_token:
            raise HTTPException(status_code=401, detail="Invalid Firebase token")
        
        # Get existing user
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update user with Firebase data
        firebase_uid = decoded_token.get('uid')
        picture = decoded_token.get('picture', '')
        email_verified = decoded_token.get('email_verified', False)
        
        user.firebase_uid = firebase_uid
        user.auth_provider = "firebase"
        user.email_verified = email_verified
        if picture:
            user.profile_picture = picture
        
        await user.save()
        
        # Prepare user response
        user_dict = user.dict()
        user_dict["id"] = str(user.id)
        user_dict.pop("hashed_password", None)
        
        return user_dict
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error linking Firebase account: {e}")
        raise HTTPException(status_code=500, detail="Account linking failed")