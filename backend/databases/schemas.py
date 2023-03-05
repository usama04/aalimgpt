from typing import List, Optional
import datetime as dt
import pydantic as pyd

class UserBase(pyd.BaseModel):
    email: str
    first_name: str = None
    last_name: str = None
    
class UserCreate(UserBase):
    hashed_password: str
    confirm_password: str
    
    class Config:
        orm_mode = True
        
class User(UserBase):
    id: int
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    
    class Config:
        orm_mode = True
        
class UserUpdate(UserBase):
    id: int = None
        
class ProfileBase(pyd.BaseModel):
    bio: str = None
    location: str = None
    birth_date: dt.date = None
    profile_image: str = None
    
class ProfileCreate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: int
    user_id: int
    created_at: dt.datetime
    updated_at: dt.datetime
    
    class Config:
        orm_mode = True
        
class ProfileUpdate(ProfileBase):
    user_id: int = None

class UserProfileResponse(pyd.BaseModel):
    user: User
    profile: Profile
    
    class Config:
        orm_mode = True