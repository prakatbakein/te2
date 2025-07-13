from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FavoriteCreate(BaseModel):
    job_id: str

class FavoriteResponse(BaseModel):
    id: str
    user_id: str
    job_id: str
    created_at: datetime

class FavoriteDelete(BaseModel):
    job_id: str