import os
from dotenv import load_dotenv
import fastapi.security as security
import boto3

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
API_VERSION = os.environ.get("API_VERSION")
HOST = os.environ.get("HOST")
PORT = os.environ.get("PORT")
DATABASE_URL = os.environ.get("DATABASE_URL")
LOG_LEVEL = "debug"
JWT_SECRET_KEY = os.environ.get("SECRET_KEY")
OAUTH2_SCHEME = security.OAuth2PasswordBearer(tokenUrl='/api/login')
OPENAI_MODEL = os.environ.get("OPENAI_MODEL")
OPENAI_CHAT_MODEL = os.environ.get("OPENAI_CHAT_MODEL")
JWT_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
ALGORITHM = "HS256"
AUTH_SCHEME = security.HTTPBearer()
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION_NAME = os.environ.get("AWS_REGION_NAME")
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name=AWS_REGION_NAME)
S3_BUCKET_URL = os.environ.get("S3_BUCKET_URL")