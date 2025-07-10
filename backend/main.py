
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pathlib import Path
import os
import json
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
import uvicorn

app = FastAPI(
    title="DealMind Lab API",
    description="AI Negotiation Training System Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def get_datasets_dir():
    home_dir = Path.home()
    datasets_dir = home_dir / "Documents" / "datasets"
    datasets_dir.mkdir(parents=True, exist_ok=True)
    return datasets_dir

def get_conversations_file():
    datasets_dir = get_datasets_dir()
    conversations_file = datasets_dir / "conversations.json"
    if not conversations_file.exists():
        conversations_file.write_text("[]")
    return conversations_file

def get_table_data_file():
    datasets_dir = get_datasets_dir()
    table_data_file = datasets_dir / "table_data.json"
    if not table_data_file.exists():
        table_data_file.write_text("[]")
    return table_data_file

def get_models_file():
    datasets_dir = get_datasets_dir()
    models_file = datasets_dir / "trained_models.json"
    if not models_file.exists():
        models_file.write_text("[]")
    return models_file

@app.get("/")
async def root():
    return {"message": "DealMind Lab API - AI Negotiation Training System"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "dealmind-api"}

@app.get("/api/conversations")
async def get_conversations():
    conversations_file = get_conversations_file()
    with open(conversations_file, 'r') as f:
        conversations = json.load(f)
    return conversations

@app.post("/api/conversations")
async def create_conversation(conversation: Dict[str, Any]):
    conversations_file = get_conversations_file()
    with open(conversations_file, 'r') as f:
        conversations = json.load(f)
    
    conversation['id'] = str(uuid.uuid4())
    conversation['created_at'] = datetime.now().isoformat()
    conversations.append(conversation)
    
    with open(conversations_file, 'w') as f:
        json.dump(conversations, f, indent=2)
    
    return conversation

@app.put("/api/conversations/{conversation_id}")
async def update_conversation(conversation_id: str, conversation: Dict[str, Any]):
    conversations_file = get_conversations_file()
    with open(conversations_file, 'r') as f:
        conversations = json.load(f)
    
    for i, conv in enumerate(conversations):
        if conv['id'] == conversation_id:
            conversation['id'] = conversation_id
            conversations[i] = conversation
            break
    else:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    with open(conversations_file, 'w') as f:
        json.dump(conversations, f, indent=2)
    
    return conversation

@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    conversations_file = get_conversations_file()
    with open(conversations_file, 'r') as f:
        conversations = json.load(f)
    
    conversations = [conv for conv in conversations if conv['id'] != conversation_id]
    
    with open(conversations_file, 'w') as f:
        json.dump(conversations, f, indent=2)
    
    return {"message": "Conversation deleted successfully"}

@app.get("/api/table-data")
async def get_table_data():
    table_data_file = get_table_data_file()
    with open(table_data_file, 'r') as f:
        table_data = json.load(f)
    return table_data

@app.post("/api/table-data")
async def save_table_data(data: Dict[str, Any]):
    table_data_file = get_table_data_file()
    
    data['id'] = str(uuid.uuid4())
    data['createdAt'] = datetime.now().isoformat()
    
    with open(table_data_file, 'r') as f:
        existing_data = json.load(f)
    
    existing_data.append(data)
    
    with open(table_data_file, 'w') as f:
        json.dump(existing_data, f, indent=2)
    
    return data

@app.get("/api/models")
async def get_trained_models():
    models_file = get_models_file()
    with open(models_file, 'r') as f:
        models = json.load(f)
    return models

@app.post("/api/models/train")
async def train_model(config: Dict[str, Any]):
    return {
        "message": "Training started",
        "training_id": str(uuid.uuid4()),
        "status": "training"
    }

@app.post("/api/models")
async def save_trained_model(model: Dict[str, Any]):
    models_file = get_models_file()
    with open(models_file, 'r') as f:
        models = json.load(f)
    
    model['id'] = str(uuid.uuid4())
    model['trainingDate'] = datetime.now().isoformat()
    models.append(model)
    
    with open(models_file, 'w') as f:
        json.dump(models, f, indent=2)
    
    return model

@app.get("/api/export/{data_type}")
async def export_data(data_type: str):
    if data_type == "conversations":
        file_path = get_conversations_file()
    elif data_type == "table_data":
        file_path = get_table_data_file()
    elif data_type == "models":
        file_path = get_models_file()
    else:
        raise HTTPException(status_code=404, detail="Data type not found")
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    return {"data": data, "filename": f"{data_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
