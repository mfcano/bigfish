from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import List
import os
import certifi

# Import models here (we will add them as we create them)
from app.models.mvp import Mvp


async def init_db():
    # Get MongoDB URI and database name from environment variables
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/bigfish")
    database_name = os.getenv("DATABASE_NAME", "bigfish")

    # Create Motor client with SSL context
    client = AsyncIOMotorClient(
        mongo_uri,
        tlsCAFile=certifi.where()
    )

    # Initialize Beanie with the database and models
    await init_beanie(
        database=client[database_name],
        document_models=[
            Mvp,
        ]
    )
