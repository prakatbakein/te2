from fastapi import APIRouter, Depends, HTTPException
from app.models.favorite import FavoriteCreate, FavoriteResponse, FavoriteDelete
from app.services.auth_service.services.jwt_handler import get_current_user
from typing import List
import uuid
from datetime import datetime

router = APIRouter()

# In-memory storage for favorites (in production, use database)
favorites_db = []

@router.post("/", response_model=FavoriteResponse)
async def add_favorite(payload: FavoriteCreate, current_user=Depends(get_current_user)):
    """Add a job to user's favorites"""
    user_id = current_user["id"]
    
    # Check if already favorited
    existing = next((f for f in favorites_db if f["user_id"] == user_id and f["job_id"] == payload.job_id), None)
    if existing:
        raise HTTPException(status_code=400, detail="Job already in favorites")
    
    favorite = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "job_id": payload.job_id,
        "created_at": datetime.utcnow()
    }
    
    favorites_db.append(favorite)
    return FavoriteResponse(**favorite)

@router.delete("/{job_id}")
async def remove_favorite(job_id: str, current_user=Depends(get_current_user)):
    """Remove a job from user's favorites"""
    user_id = current_user["id"]
    
    global favorites_db
    favorites_db = [f for f in favorites_db if not (f["user_id"] == user_id and f["job_id"] == job_id)]
    
    return {"message": "Favorite removed successfully"}

@router.get("/", response_model=List[FavoriteResponse])
async def get_user_favorites(current_user=Depends(get_current_user)):
    """Get user's favorite jobs"""
    user_id = current_user["id"]
    
    user_favorites = [f for f in favorites_db if f["user_id"] == user_id]
    return [FavoriteResponse(**f) for f in user_favorites]

@router.get("/check/{job_id}")
async def check_favorite(job_id: str, current_user=Depends(get_current_user)):
    """Check if a job is favorited by user"""
    user_id = current_user["id"]
    
    is_favorited = any(f["user_id"] == user_id and f["job_id"] == job_id for f in favorites_db)
    return {"is_favorited": is_favorited}