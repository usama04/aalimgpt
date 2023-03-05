import os
from dotenv import load_dotenv
import fastapi.security as security

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
API_VERSION = os.environ.get("API_VERSION")
HOST = os.environ.get("HOST")
PORT = os.environ.get("PORT")
DATABASE_URL = os.environ.get("DATABASE_URL")
LOG_LEVEL = "debug"
SECRET_KEY = os.environ.get("SECRET_KEY")
OAUTH2_SCHEME = security.OAuth2PasswordBearer(tokenUrl='/api/login')
OPENAI_MODEL = os.environ.get("OPENAI_MODEL")
OPENAI_CHAT_MODEL = os.environ.get("OPENAI_CHAT_MODEL")