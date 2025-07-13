#!/usr/bin/env python3
"""
Script to create demo users that match the login page display
"""
import asyncio
import sys
import os
sys.path.append('/app/backend')

from app.core.db import init_db
from app.services.auth_service.models.user import User
from app.services.auth_service.services.auth_utils import hash_password

async def create_demo_users():
    """Create demo users that match the login page display"""
    
    # Initialize database
    await init_db()
    
    # Create demo users mentioned in login page
    demo_users = [
        {
            "email": "testuser@example.com",
            "full_name": "Test User",
            "role": "candidate",
            "password": "password123"
        },
        {
            "email": "frontend.test@example.com",
            "full_name": "Frontend Test",
            "role": "candidate", 
            "password": "testpass123"
        }
    ]
    
    created_users = []
    for user_data in demo_users:
        existing = await User.find_one(User.email == user_data["email"])
        if not existing:
            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                role=user_data["role"],
                hashed_password=hash_password(user_data["password"])
            )
            await user.insert()
            created_users.append(user_data["email"])
            print(f"✅ Created demo user: {user_data['email']}")
        else:
            print(f"⚠️  Demo user already exists: {user_data['email']}")
    
    print(f"\n🔑 Demo accounts ready for testing:")
    print(f"📧 testuser@example.com / password123")
    print(f"📧 frontend.test@example.com / testpass123")
    
    return created_users

if __name__ == "__main__":
    asyncio.run(create_demo_users())