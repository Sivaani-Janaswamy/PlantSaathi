# PlantSaathi Backend API

**Production-grade Node.js/Express backend for PlantSaathi plant identification and care service**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Claude API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/plant-saathi.git
cd plant-saathi/backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

### Verify Setup
```bash
# Check if server is running
curl http://localhost:3000/health

# Response:
# {"status":"ok","timestamp":"2026-05-05T..."}
```

---

## 📋 Environment Variables

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Claude API
ANTHROPIC_API_KEY=your-claude-api-key

# Logging
LOG_LEVEL=info
```

---

## 🏗️ Architecture

```
Backend
├── Express.js (HTTP Server)
├── Supabase (Database + Auth)
├── Claude API (AI Chat)
└── Services Layer
    ├── Plant Service (Search, Details)
    ├── AI Service (Chat Integration)
    ├── Favorites Service
    └── Care History Service
```

---

## 📡 API Endpoints

### Public Endpoints (No Auth Required)

#### Search Plants
```
GET /api/plants/search?q=tulsi&type=herb&limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "common_name": "Tulsi",
      "scientific_name": "Ocimum sanctum",
      "plant_type": "herb",
      "difficulty_level": "beginner"
    }
  ],
  "total": 245,
  "limit": 20,
  "offset": 0
}
```

#### Get Plant Details
```
GET /api/plants/:plantId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "common_name": "Tulsi",
    "scientific_name": "Ocimum sanctum",
    "family": "Lamiaceae",
    "watering_frequency": "daily",
    "sunlight_requirement": "full-sun",
    "plant_images": [
      {
        "image_url": "https://...",
        "alt_text": "Tulsi plant",
        "is_primary": true
      }
    ]
  }
}
```

#### Get Recommendations
```
GET /api/plants/recommendations?type=herb&limit=10
```

#### AI Chat (Optional Auth)
```
POST /api/ai/chat
Header: Authorization: Bearer <token> (optional)
Content-Type: text/event-stream

Body:
{
  "message": "How to care for tulsi?",
  "plantId": "uuid" (optional)
}
```

**Response:** Server-Sent Events (SSE) stream
```
data: {"text":"Tulsi is a beautiful herb..."}
data: {"text":" that requires..."}
data: [DONE]
```

### Protected Endpoints (Auth Required)

#### Add Favorite
```
POST /api/favorites
Header: Authorization: Bearer <token>

Body:
{
  "plantId": "uuid"
}
```

#### Remove Favorite
```
DELETE /api/favorites/:plantId
Header: Authorization: Bearer <token>
```

#### Get Favorites
```
GET /api/favorites?limit=50&offset=0
Header: Authorization: Bearer <token>
```

---

## 🔐 Authentication

All protected endpoints require a Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/favorites
```

Tokens are issued by Supabase Auth and valid for 1 hour.

---

## 🗄️ Database Schema

### Tables
- **users** - User profiles
- **plants** - Plant database
- **plant_images** - Plant photos
- **user_favorites** - Saved plants
- **care_history** - Plant care logs
- **chat_messages** - AI conversation history

### Row-Level Security (RLS)
All user data is protected with RLS policies:
- Users can only access their own data
- Public endpoints don't require authentication
- Admin operations protected

---

## 📊 Performance

### Targets
- Search response: < 200ms
- Chat streaming: Real-time
- API availability: 99.9%

### Optimization
- Database indexes on search fields
- Response caching (1 hour TTL)
- Rate limiting (100 req/min per IP)
- Pagination support

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- test/plants.test.js
```

---

## 📦 Deployment

### Production Build
```bash
npm start
```

### Docker
```bash
docker build -t plant-saathi-backend .
docker run -p 3000:3000 --env-file .env plant-saathi-backend
```

### Environment Setup for Prod
```bash
NODE_ENV=production
PORT=3000
# Use production Supabase project
# Use production Claude API key
```

---

## 🛠️ Development

### Code Style
- Follows Airbnb JavaScript style guide
- Enforced with ESLint

```bash
npm run lint           # Check style
npm run lint:fix      # Auto-fix issues
```

### Structure
```
src/
├── index.js           # Entry point
├── config/            # Configuration
├── middleware/        # Express middleware
├── routes/            # API routes
├── controllers/       # Request handlers
├── services/          # Business logic
├── integrations/      # External APIs
└── utils/             # Utilities
```

---

## 🐛 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Plant not found"
}
```

### Status Codes
- `200` - Success
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error
- `503` - Service unavailable

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [Claude API](https://api.anthropic.com)

---

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Commit with conventional commits
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📄 License

MIT - See LICENSE file

---

**Last Updated:** 2026-05-05  
**Maintained by:** PlantSaathi Team
