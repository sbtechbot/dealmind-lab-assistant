
"""
Database configuration and session management
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import os

# from config import settings

# Database configuration
# DATABASE_URL = settings.DATABASE_URL

# engine = create_engine(
#     DATABASE_URL,
#     echo=settings.DATABASE_ECHO,
#     pool_pre_ping=True,
#     # For SQLite in development
#     poolclass=StaticPool if "sqlite" in DATABASE_URL else None,
#     connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
# )

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# def get_db() -> Session:
#     """Dependency to get database session"""
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# async def init_db():
#     """Initialize database tables"""
#     # Import all models here to ensure they are registered
#     from models import database_models
    
#     Base.metadata.create_all(bind=engine)
#     print("Database tables created successfully")

# async def close_db():
#     """Close database connections"""
#     engine.dispose()
