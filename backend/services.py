from fastapi import Depends, HTTPException
import fastapi.security as security
from databases import database as db
import sqlalchemy.orm as orm
import databases.models as models
import databases.schemas as schemas
import passlib.hash as ph
import datetime as dt
import jwt
import settings
from typing import List, Dict


def create_database():
    return db.Base.metadata.create_all(bind=db.engine)

def get_db():
    db_session = db.SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        
async def get_user_by_email(db: orm.Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

async def create_user(db: orm.Session, user: schemas.UserCreate):
    password = user.hashed_password
    confirm_password = user.confirm_password
    if user.email is None:
        raise HTTPException(status_code=400, detail='Email is required')
    if await get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail='Email already registered')
    if password is None:
        raise HTTPException(status_code=400, detail='Password is required')
    if password != confirm_password:
        raise HTTPException(status_code=400, detail='Passwords do not match')
    db_user = models.User(email=user.email, first_name=user.first_name, last_name=user.last_name, hashed_password=ph.bcrypt.hash(password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def create_user_profile(db: orm.Session, profile: schemas.ProfileCreate, user_id: int):
    db_profile = models.Profile(bio=profile.bio, location=profile.location, birth_date=profile.birth_date, profile_image=profile.profile_image, user_id=user_id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

async def authenticate_user(db: orm.Session, email: str, password: str):
    user = await get_user_by_email(db, email=email)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user

async def create_token(db: orm.Session, user: models.User):
    user_obj = schemas.User.from_orm(user)
    expiry = dt.datetime.utcnow() + dt.timedelta(minutes=settings.JWT_TOKEN_EXPIRE_MINUTES)
    payload = {"user": user_obj.dict(), "exp": expiry}
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    return dict(access_token=token, token_type='bearer')

async def get_current_user(db: orm.Session = Depends(get_db), token: str = Depends(settings.OAUTH2_SCHEME)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        if dt.datetime.fromtimestamp(payload.get('exp')) < dt.datetime.utcnow():
            raise HTTPException(status_code=401, detail='Invalid Credentials')
        else:
            user = db.query(models.User).get(payload.get('user')["id"])
    except:
        raise HTTPException(status_code=401, detail='Invalid Credentials')
    return schemas.User.from_orm(user)

async def verify_token(db: orm.Session = Depends(get_db), user: schemas.User = Depends(get_current_user)):
    if user:
        return dict(message='Token is valid')
    else:
        raise HTTPException(status_code=401, detail='Invalid Credentials')

async def logout(db: orm.Session, user: schemas.User = Depends(get_current_user)):
    return dict(message='Logged out successfully')

async def update_user(db: orm.Session = Depends(get_db), user: schemas.UserUpdate = Depends(get_current_user)):
    #update existing user
    db_user = db.query(models.User).get(user.id)
    db_user.email = user.email
    db_user.first_name = user.first_name
    db_user.last_name = user.last_name
    db.commit()
    db.refresh(db_user)
    return db_user

async def get_profile_by_user_id(db: orm.Session = Depends(get_db), user: int = Depends(get_current_user)):
    return db.query(models.Profile).filter(models.Profile.user_id == user.id).first()

async def update_profile(db: orm.Session = Depends(get_db), profile: schemas.ProfileUpdate = Depends(get_profile_by_user_id), user: schemas.User = Depends(get_current_user)):
    db_profile = db.query(models.Profile).filter(models.Profile.user_id == user.id).first()
    db_profile.bio = profile.bio
    db_profile.location = profile.location
    db_profile.birth_date = profile.birth_date
    db_profile.profile_image = profile.profile_image
    db.commit()
    db.refresh(db_profile)
    return db_profile

async def save_chat_response(db: orm.Session = Depends(get_db), user: schemas.User = Depends(get_current_user), prompt: List[Dict[str, str]] = None, generated_response: Dict[str, str] = None):
    chat = models.Chats(user_id=user.id)
    chat.set_prompt(prompt)
    chat.set_generated_response(generated_response)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


async def get_chat_history(db: orm.Session = Depends(get_db), user: schemas.User = Depends(get_current_user)):
    return db.query(models.Chats).filter(models.Chats.user_id == user.id).all()

async def get_chat_history_by_id(db: orm.Session = Depends(get_db), user: schemas.User = Depends(get_current_user), chat_id: int = None):
    return db.query(models.Chats).filter(models.Chats.user_id == user.id, models.Chats.id == chat_id).first()