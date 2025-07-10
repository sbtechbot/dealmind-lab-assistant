
"""
Dataset management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

# from database import get_db
# from models.schemas import DatasetEntry, DatasetEntryCreate, DatasetResponse
# from services.auth import get_current_user
# from services.dataset_service import DatasetService

router = APIRouter()

# @router.post("/entries", response_model=DatasetEntry, status_code=status.HTTP_201_CREATED)
# async def create_dataset_entry(
#     entry_data: DatasetEntryCreate,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     """Create a new dataset entry"""
#     service = DatasetService(db)
#     return await service.create_entry(entry_data, current_user.id)

# @router.get("/entries", response_model=DatasetResponse)
# async def get_dataset_entries(
#     page: int = Query(1, ge=1),
#     size: int = Query(20, ge=1, le=100),
#     intent: Optional[str] = Query(None),
#     business_type: Optional[str] = Query(None),
#     outcome: Optional[str] = Query(None),
#     search: Optional[str] = Query(None),
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     """Get paginated dataset entries with filters"""
#     service = DatasetService(db)
#     filters = {
#         "intent": intent,
#         "business_type": business_type,
#         "outcome": outcome,
#         "search": search
#     }
#     return await service.get_entries(current_user.id, page, size, filters)

# @router.get("/entries/{entry_id}", response_model=DatasetEntry)
# async def get_dataset_entry(
#     entry_id: str,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     """Get a specific dataset entry"""
#     service = DatasetService(db)
#     entry = await service.get_entry_by_id(entry_id, current_user.id)
#     if not entry:
#         raise HTTPException(status_code=404, detail="Dataset entry not found")
#     return entry

# @router.put("/entries/{entry_id}", response_model=DatasetEntry)
# async def update_dataset_entry(
#     entry_id: str,
#     entry_data: DatasetEntryCreate,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     """Update a dataset entry"""
#     service = DatasetService(db)
#     entry = await service.update_entry(entry_id, entry_data, current_user.id)
#     if not entry:
#         raise HTTPException(status_code=404, detail="Dataset entry not found")
#     return entry

# @router.delete("/entries/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_dataset_entry(
#     entry_id: str,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     """Delete a dataset entry"""
#     service = DatasetService(db)
#     success = await service.delete_entry(entry_id, current_user.id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Dataset entry not found")

# @router.post("/entries/bulk", status_code=status.HTTP_201_CREATED)
# async def bulk_create_entries(
#     entries: List[DatasetEntryCreate],
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     """Bulk create dataset entries"""
#     service = DatasetService(db)
#     result = await service.bulk_create_entries(entries, current_user.id)
#     return {"created": result["created"], "failed": result["failed"]}

# @router.get("/analytics")
# async def get_dataset_analytics(
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     """Get dataset analytics and statistics"""
#     service = DatasetService(db)
#     return await service.get_analytics(current_user.id)

# @router.post("/validate")
# async def validate_dataset_entries(
#     entries: List[DatasetEntryCreate],
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     """Validate dataset entries before creation"""
#     service = DatasetService(db)
#     return await service.validate_entries(entries)
