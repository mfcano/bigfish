from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.config.database import init_db
from app.routes import mvp

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Big Fish API",
    description="Backend for Big Fish Guild Management",
    version="1.0.0"
)

@app.on_event("startup")
async def start_db():
    await init_db()

app.include_router(mvp.router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Big Fish API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

