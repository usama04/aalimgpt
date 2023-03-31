import asyncio
from api import run_api
## New Stuff

async def main():
    await run_api()

if __name__ == "__main__":
    event_loop = asyncio.get_event_loop()
    event_loop.run_until_complete(main())
    #import asyncio
    #asyncio.run(main())