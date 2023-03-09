from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from api.responses import CustomJSONResponse
import fastapi.security as security
import sqlalchemy.orm as orm
import services as services
import databases.schemas as schemas
import databases.models as models
import openai
import settings
import passlib.hash as ph


openai.api_key = settings.OPENAI_API_KEY

app = FastAPI(
    default_response_class=CustomJSONResponse,
)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/")
async def root():
    return {"message": "Check docs for more info."}

### AUTHENTICATION ###

@app.post("/api/register")
async def create_user(user: schemas.UserCreate, db: orm.Session = Depends(services.get_db)):
    db_user = await services.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user_obj = await services.create_user(db, user)
    profile_obj = await services.create_user_profile(db, schemas.ProfileCreate(), user_obj.id)
    return await services.create_token(db, user_obj)

@app.post("/api/login")
async def generate_token(form_data: security.OAuth2PasswordRequestForm = Depends(), db: orm.Session = Depends(services.get_db)):
    user = await services.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    return await services.create_token(db, user)

@app.post("/api/verify-token")
async def verify_token(db: orm.Session = Depends(services.get_db), user: schemas.User = Depends(services.get_current_user)):
    return await services.verify_token(db, user)

@app.post("/api/logout")
async def logout(db: orm.Session = Depends(services.get_db), user: schemas.User = Depends(services.get_current_user)):
    return await services.logout(db, user)

@app.get("/api/users/me", response_model=schemas.User)
async def get_user(user: schemas.User = Depends(services.get_current_user)):
    return user

@app.put("/api/users/me", response_model=schemas.User)
async def update_user(user: schemas.UserUpdate, db: orm.Session = Depends(services.get_db)):
    return await services.update_user(db, user)

### USER PROFILE ###

@app.get("/api/profile/me", response_model=schemas.Profile)
async def get_profile(db: orm.Session = Depends(services.get_db), user: schemas.User = Depends(services.get_current_user)):
    return await services.get_profile_by_user_id(db, user=user)

@app.put("/api/profile/me", response_model=schemas.Profile)
async def update_profile(profile: schemas.ProfileUpdate, db: orm.Session = Depends(services.get_db), user: schemas.User = Depends(services.get_current_user)):
    return await services.update_profile(db, profile, user)

### CHATBOT ###
# Prompt: You are a well versed Islamic Scholar and Mufti who can be asked questions from and he can give answers according to Quran and Sunnah with proper references.
@app.post("/api/mufti")
async def mufti(request: Request, db: orm.Session = Depends(services.get_db), user: schemas.User = Depends(services.get_current_user)):
    received = await request.json()
    messages = received["messages"]
    prompt = [
        {"role": "system", "content": "You are a well versed Islamic Scholar and Mufti who can be asked questions from and he can give answers according to Quran and Sunnah with proper references."},
    ]
    for message in messages:
        if message["role"] == "user":
            try:
                mes = message["message"]
            except KeyError:
                mes = message["content"]
            except:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid message format")
            prompt.append({"role": "user", "content": mes})
        else:
            try:
                mes = message["message"]
            except KeyError:
                mes = message["content"]
            except:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid message format")
            prompt.append({"role": "assistant", "content": mes})
    response = openai.ChatCompletion.create(
        model=settings.OPENAI_CHAT_MODEL,
        messages=prompt,
        temperature=0.4,
        max_tokens=500,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0.6
    )
    ret_response = {"user": "assistant", "message": response.choices[0].message.content}
    await services.save_chat_response(db, user, prompt=messages, generated_response=ret_response)
    return ret_response

@app.get("/api/chat-history")
async def get_chat_history(db: orm.Session = Depends(services.get_db), user: schemas.User = Depends(services.get_current_user)):
    return await services.get_chat_history(db, user)

@app.get("/api/chat-history/{chat_id}")
async def get_chat_history_by_id(chat_id: int, db: orm.Session = Depends(services.get_db), user: schemas.User = Depends(services.get_current_user)):
    return await services.get_chat_history_by_id(db, user, chat_id)