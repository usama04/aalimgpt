from hypercorn.config import Config
from hypercorn.asyncio import serve
from api.api import app
import settings

config = Config()
url = f"{settings.HOST}:{settings.PORT}"
config.bind = [url]
config.accesslog = "-"
config.errorlog = "-"
#config.loglevel = settings.LOG_LEVEL

async def run_api():
    await serve(get_app(), config)
    
def get_app():
    return app