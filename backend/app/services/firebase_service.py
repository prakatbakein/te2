# # app/services/firebase_service.py

# import firebase_admin
# from firebase_admin import credentials, auth
# import os
# import json
# from fastapi import HTTPException
# from typing import Optional

# class FirebaseService:
#     def __init__(self):
#         self.app = None
#         self.initialize_firebase()
    
#     def initialize_firebase(self):
#         """Initialize Firebase Admin SDK"""
#         try:
#             # Check if Firebase app is already initialized
#             if not firebase_admin._apps:
#                 # Load service account from JSON file
#                 service_account_path = os.path.join(os.path.dirname(__file__), '../../firebase-service-account.json')
#                 cred = credentials.Certificate(service_account_path)
                
#                 self.app = firebase_admin.initialize_app(cred)
#                 print("Firebase Admin SDK initialized successfully")
#             else:
#                 self.app = firebase_admin.get_app()
#                 print("Firebase Admin SDK already initialized")
#         except Exception as e:
#             print(f"Error initializing Firebase: {e}")
#             raise e
    
#     async def verify_firebase_token(self, token: str) -> Optional[dict]:
#         """Verify Firebase ID token and return user data"""
#         try:
#             # Verify the token
#             decoded_token = auth.verify_id_token(token)
#             return decoded_token
#         except Exception as e:
#             print(f"Error verifying Firebase token: {e}")
#             return None
    
#     async def get_user_by_uid(self, uid: str) -> Optional[dict]:
#         """Get user data by Firebase UID"""
#         try:
#             user_record = auth.get_user(uid)
#             return {
#                 'uid': user_record.uid,
#                 'email': user_record.email,
#                 'display_name': user_record.display_name,
#                 'photo_url': user_record.photo_url,
#                 'email_verified': user_record.email_verified,
#                 'provider_data': [
#                     {
#                         'provider_id': provider.provider_id,
#                         'uid': provider.uid,
#                         'email': provider.email,
#                         'display_name': provider.display_name,
#                         'photo_url': provider.photo_url
#                     }
#                     for provider in user_record.provider_data
#                 ]
#             }
#         except Exception as e:
#             print(f"Error getting user by UID: {e}")
#             return None

# # Create global instance
# firebase_service = FirebaseService()


# app/services/firebase_service.py

import firebase_admin
from firebase_admin import credentials, auth
import os
import json
from fastapi import HTTPException
from typing import Optional

class FirebaseService:
    def __init__(self):
        self.app = None
        self.initialize_firebase()
    
    def initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if Firebase app is already initialized
            if not firebase_admin._apps:
                # For testing, skip Firebase initialization if service account file doesn't exist
                service_account_path = os.path.join(os.path.dirname(__file__), '../../firebase-service-account.json')
                
                if not os.path.exists(service_account_path):
                    print("Firebase service account file not found. Skipping Firebase initialization for testing.")
                    self.app = None
                    return
                
                cred = credentials.Certificate(service_account_path)
                self.app = firebase_admin.initialize_app(cred)
                print("Firebase Admin SDK initialized successfully")
            else:
                self.app = firebase_admin.get_app()
                print("Firebase Admin SDK already initialized")
        except Exception as e:
            print(f"Error initializing Firebase: {e}")
            # For testing, don't raise the error
            self.app = None
    
    async def verify_firebase_token(self, token: str) -> Optional[dict]:
        """Verify Firebase ID token and return user data"""
        try:
            if self.app is None:
                print("Firebase not initialized, skipping token verification")
                return None
            # Verify the token
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            print(f"Error verifying Firebase token: {e}")
            return None
    
    async def get_user_by_uid(self, uid: str) -> Optional[dict]:
        """Get user data by Firebase UID"""
        try:
            if self.app is None:
                print("Firebase not initialized, skipping user lookup")
                return None
            user_record = auth.get_user(uid)
            return {
                'uid': user_record.uid,
                'email': user_record.email,
                'display_name': user_record.display_name,
                'photo_url': user_record.photo_url,
                'email_verified': user_record.email_verified,
                'provider_data': [
                    {
                        'provider_id': provider.provider_id,
                        'uid': provider.uid,
                        'email': provider.email,
                        'display_name': provider.display_name,
                        'photo_url': provider.photo_url
                    }
                    for provider in user_record.provider_data
                ]
            }
        except Exception as e:
            print(f"Error getting user by UID: {e}")
            return None

# Create global instance
firebase_service = FirebaseService()