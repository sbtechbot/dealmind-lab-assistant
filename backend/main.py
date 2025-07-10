
"""
FastAPI Backend for DealMind Lab - AI Negotiation Training System
Main application entry point
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn

# from routers import datasets, conversations, training, prompts, exports, models, auth
# from database import init_db
# from config import settings

app = FastAPI(
    title="DealMind Lab API",
    description="AI Negotiation Training System Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Initialize database on startup
#     await init_db()
#     yield

# Include routers
# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(datasets.router, prefix="/api/datasets", tags=["Datasets"])
# app.include_router(conversations.router, prefix="/api/conversations", tags=["Conversations"])
# app.include_router(training.router, prefix="/api/training", tags=["Training"])
# app.include_router(prompts.router, prefix="/api/prompts", tags=["Prompts"])
# app.include_router(exports.router, prefix="/api/exports", tags=["Exports"])
# app.include_router(models.router, prefix="/api/models", tags=["Models"])

@app.get("/")
async def root():
    return {"message": "DealMind Lab API - AI Negotiation Training System"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "dealmind-api"}

# if __name__ == "__main__":
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True,
#         log_level="info"
#     )
