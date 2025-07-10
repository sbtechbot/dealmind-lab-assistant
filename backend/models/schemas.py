
"""
Pydantic models for request/response schemas
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from enum import Enum

# Base Models
class TimestampMixin(BaseModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

# Authentication
class UserCreate(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    created_at: datetime
    is_active: bool

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# Dataset Models
class DatasetEntryCreate(BaseModel):
    customer_message: str = Field(..., min_length=1, max_length=2000)
    business_response: str = Field(..., min_length=1, max_length=2000)
    intent: str = Field(..., example="discount_request")
    business_type: str = Field(..., example="retail")
    outcome: Literal["successful", "failed", "partial"] = "successful"
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class DatasetEntry(DatasetEntryCreate, TimestampMixin):
    id: str
    user_id: str

class DatasetResponse(BaseModel):
    entries: List[DatasetEntry]
    total: int
    page: int
    size: int

# Conversation Models
class MessageCreate(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=2000)
    tags: List[str] = Field(default_factory=list)

class Message(MessageCreate, TimestampMixin):
    id: str
    session_id: str

class ConversationSessionCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    scenario: str = Field(default="", max_length=1000)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ConversationSession(ConversationSessionCreate, TimestampMixin):
    id: str
    user_id: str
    messages: List[Message] = Field(default_factory=list)
    status: Literal["active", "completed", "archived"] = "active"

# Training Models
class TrainingJobCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    model_type: str = Field(..., example="gpt-3.5-turbo")
    dataset_ids: List[str]
    hyperparameters: Dict[str, Any] = Field(default_factory=dict)
    description: Optional[str] = None

class TrainingJob(TrainingJobCreate, TimestampMixin):
    id: str
    user_id: str
    status: Literal["pending", "running", "completed", "failed"] = "pending"
    progress: float = 0.0
    results: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None

# Prompt Models
class PromptTemplateCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    template: str = Field(..., min_length=1)
    variables: List[str] = Field(default_factory=list)
    category: str = Field(..., example="negotiation")
    description: Optional[str] = None

class PromptTemplate(PromptTemplateCreate, TimestampMixin):
    id: str
    user_id: str
    is_active: bool = True
    usage_count: int = 0

class FewShotExampleCreate(BaseModel):
    input_text: str = Field(..., min_length=1)
    expected_output: str = Field(..., min_length=1)
    context: Optional[str] = None
    category: str = Field(..., example="discount_negotiation")

class FewShotExample(FewShotExampleCreate, TimestampMixin):
    id: str
    user_id: str

# Export Models
class ExportRequest(BaseModel):
    format: Literal["json", "csv", "jsonl"] = "json"
    dataset_ids: List[str]
    filters: Dict[str, Any] = Field(default_factory=dict)
    include_metadata: bool = True

class ExportJob(BaseModel):
    id: str
    user_id: str
    format: str
    status: Literal["pending", "processing", "completed", "failed"] = "pending"
    file_url: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

# Model Integration
class ModelConfigCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    provider: Literal["openai", "anthropic", "google", "local"] = "openai"
    model_id: str = Field(..., example="gpt-4")
    api_key: Optional[str] = None
    endpoint_url: Optional[str] = None
    parameters: Dict[str, Any] = Field(default_factory=dict)

class ModelConfig(ModelConfigCreate, TimestampMixin):
    id: str
    user_id: str
    is_active: bool = True

class ChatRequest(BaseModel):
    model_id: str
    messages: List[Dict[str, str]]
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=None, gt=0)

class ChatResponse(BaseModel):
    message: str
    model_used: str
    tokens_used: int
    response_time: float

# Analytics Models
class AnalyticsRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    metrics: List[str] = Field(default_factory=list)
    filters: Dict[str, Any] = Field(default_factory=dict)

class AnalyticsResponse(BaseModel):
    metrics: Dict[str, Any]
    charts: Dict[str, Any]
    summary: Dict[str, Any]
    generated_at: datetime = Field(default_factory=datetime.utcnow)
