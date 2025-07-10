
# DealMind Lab Backend API

FastAPI backend for the DealMind Lab AI Negotiation Training System.

## Features

- **Dataset Management**: CRUD operations for training datasets
- **Conversation Simulation**: Real-time chat simulation with AI models
- **Model Training**: AI model training and fine-tuning
- **Prompt Management**: System prompts and few-shot examples
- **Export Center**: Data export in multiple formats
- **Model Integration**: Support for OpenAI, Anthropic, and other AI providers
- **Authentication**: JWT-based user authentication
- **WebSocket Support**: Real-time conversation features
- **Background Tasks**: Celery for long-running operations

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database Setup**
   ```bash
   # For PostgreSQL
   createdb dealmind_db
   
   # Run migrations
   alembic upgrade head
   ```

6. **Start Redis** (for caching and background tasks)
   ```bash
   redis-server
   ```

## Running the Application

### Development
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Background Tasks
```bash
celery -A tasks.celery worker --loglevel=info
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Datasets
- `GET /api/datasets/entries` - List dataset entries
- `POST /api/datasets/entries` - Create dataset entry
- `PUT /api/datasets/entries/{id}` - Update dataset entry
- `DELETE /api/datasets/entries/{id}` - Delete dataset entry

### Conversations
- `GET /api/conversations/sessions` - List conversation sessions
- `POST /api/conversations/sessions` - Create conversation session
- `POST /api/conversations/sessions/{id}/messages` - Add message
- `WebSocket /api/conversations/sessions/{id}/live` - Real-time chat

### Training
- `POST /api/training/jobs` - Start training job
- `GET /api/training/jobs` - List training jobs
- `GET /api/training/jobs/{id}` - Get training job status

### Prompts
- `GET /api/prompts/templates` - List prompt templates
- `POST /api/prompts/templates` - Create prompt template
- `GET /api/prompts/examples` - List few-shot examples

### Models
- `GET /api/models/configs` - List model configurations
- `POST /api/models/configs` - Add model configuration
- `POST /api/models/chat` - Chat with AI model

### Exports
- `POST /api/exports/request` - Request data export
- `GET /api/exports/jobs` - List export jobs
- `GET /api/exports/download/{id}` - Download export file

## Database Schema

The application uses SQLAlchemy ORM with the following main models:

- **User**: User authentication and profile
- **DatasetEntry**: Training data entries
- **ConversationSession**: Chat simulation sessions
- **Message**: Individual chat messages
- **TrainingJob**: Model training jobs
- **PromptTemplate**: System prompt templates
- **ModelConfig**: AI model configurations

## Configuration

Key configuration options in `.env`:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/db

# AI Services
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key

# Authentication
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Security

- JWT tokens for authentication
- Password hashing with bcrypt
- CORS configuration for frontend integration
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy ORM

## Monitoring

- Health check endpoint: `GET /health`
- Prometheus metrics (optional)
- Structured logging with Loguru

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## Deployment

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db/dealmind
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: dealmind
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
  
  redis:
    image: redis:7
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
