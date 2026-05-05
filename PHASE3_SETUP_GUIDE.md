# Phase 3: Backend Setup & Deployment Guide

**Complete guide to deploying PlantSaathi backend and connecting with frontend**

---

## Step 1: Supabase Project Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name: `plant-saathi` (or similar)
4. Choose region closest to you
5. Set strong database password
6. Wait for project initialization (~2 min)

### 1.2 Get Credentials

Once project is ready:

1. Go to **Settings** → **API**
2. Copy these credentials to `.env`:
   - **SUPABASE_URL** - Project URL
   - **SUPABASE_KEY** - Anon key (public)
   - **SUPABASE_SERVICE_ROLE_KEY** - Service Role Key (keep secret!)

### 1.3 Apply Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy contents of `backend/supabase/migrations/001_init.sql`
4. Paste into query editor
5. Click **Run**
6. Verify all tables created in **Table Editor**

**Expected tables:**
- ✅ users
- ✅ plants
- ✅ plant_images
- ✅ user_favorites
- ✅ care_history
- ✅ chat_messages

---

## Step 2: Backend Configuration

### 2.1 Setup Environment File

```bash
cd backend
cp .env.example .env
```

**Edit `.env` with values:**
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=https://your-project-xyz.supabase.co
SUPABASE_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...

ANTHROPIC_API_KEY=sk-ant-v1-...

LOG_LEVEL=info
```

### 2.2 Get Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or login
3. Go to **API Keys**
4. Click **Create Key**
5. Copy key to `ANTHROPIC_API_KEY` in `.env`

### 2.3 Install Dependencies

```bash
npm install
```

---

## Step 3: Seed Database with Plants

Create test data for searching and recommendations:

```bash
# Create seed script
cat > backend/scripts/seed-plants.js << 'SEED'
import { supabase } from '../src/config/database.js';

const plants = [
  {
    common_name: 'Tulsi',
    scientific_name: 'Ocimum sanctum',
    family: 'Lamiaceae',
    description: 'Holy basil, sacred plant in Hindu tradition',
    plant_type: 'herb',
    watering_frequency: 'daily',
    sunlight_requirement: 'full-sun',
    difficulty_level: 'beginner',
    temperature_min: 20,
    temperature_max: 35,
    humidity_level: 'medium'
  },
  // ... add more plants
];

const { error } = await supabase
  .from('plants')
  .insert(plants);

if (error) console.error('Seed failed:', error);
else console.log('✅ Plants seeded successfully');
SEED

# Run seed
node backend/scripts/seed-plants.js
```

---

## Step 4: Test Backend Locally

### 4.1 Start Development Server

```bash
cd backend
npm run dev
```

Expected output:
```
🌿 PlantSaathi Backend running on port 3000
📍 Environment: development
```

### 4.2 Test Endpoints

#### Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{"status":"ok","timestamp":"2026-05-05T10:30:00.000Z"}
```

#### Search Plants
```bash
curl "http://localhost:3000/api/plants/search?q=tulsi&limit=5"
```

#### Get Recommendations
```bash
curl "http://localhost:3000/api/plants/recommendations?type=herb"
```

#### Test AI Chat
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"How do I care for tulsi?"}'
```

---

## Step 5: Connect Frontend to Backend

### 5.1 Update Flutter Config

Edit `mobile/lib/core/api_service.dart`:

```dart
const String BASE_URL = 'http://localhost:3000/api';
// or for production:
// const String BASE_URL = 'https://api.plantsaathi.com/api';
```

### 5.2 Update Plant Service

```dart
// mobile/lib/services/plant_service.dart
Future<List<PlantSummary>> searchPlants(String query) async {
  final response = await apiClient.get(
    '/plants/search',
    queryParameters: {'q': query, 'limit': 20}
  );
  
  final plants = (response['data'] as List)
    .map((p) => PlantSummary.fromJson(p))
    .toList();
  
  return plants;
}
```

### 5.3 Test Frontend → Backend Connection

1. Run frontend: `flutter run`
2. Navigate to Search screen
3. Search for "tulsi"
4. Should see results from backend ✅

---

## Step 6: Production Deployment

### 6.1 Deploy to Railway or Render

**Option A: Railway (Recommended)**

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your repo
5. Select `backend` folder
6. Add environment variables from `.env`
7. Deploy!

**Option B: Vercel/AWS/Heroku**

Similar setup with environment variables

### 6.2 Production Environment

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://plantsaathi.app

# Use production Supabase project
SUPABASE_URL=https://prod-project.supabase.co
SUPABASE_KEY=eyJ0eXAi...

# Production Claude key
ANTHROPIC_API_KEY=sk-ant-...
```

### 6.3 Monitor Deployment

```bash
# Check production logs
curl https://your-api.onrailway.app/health
```

Should respond with 200 OK

---

## Step 7: Database Backup & Maintenance

### 7.1 Weekly Backups

Supabase auto-backs up daily. Manual backup:

1. Go to Supabase dashboard
2. Settings → Backups
3. Click "Request backup"

### 7.2 Monitor Performance

```bash
# Check API response times
curl -w "Total: %{time_total}s" \
  http://localhost:3000/api/plants/search?q=test

# Monitor database size
# In Supabase: Settings → Database → Size
```

---

## Troubleshooting

### Connection Failed
```
Error: Cannot reach Supabase
```

**Fix:**
- Verify SUPABASE_URL and SUPABASE_KEY in `.env`
- Check internet connection
- Verify Supabase project is running

### Plants Not Seeded
```
Error: insert or update on table "plants" violates foreign key
```

**Fix:**
- Ensure migrations ran successfully
- Run seed script after migrations
- Check plant data is valid

### AI Chat Not Working
```
Error: ANTHROPIC_API_KEY is not set
```

**Fix:**
- Get key from [console.anthropic.com](https://console.anthropic.com)
- Add to `.env`
- Verify key is valid (doesn't start with wrong prefix)

### CORS Errors
```
Access-Control-Allow-Origin error
```

**Fix:**
- Update FRONTEND_URL in `.env`
- Make sure CORS middleware is enabled
- Check frontend is making requests to correct backend URL

---

## Testing Checklist

- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Backend runs locally (`npm run dev`)
- [ ] Health check responds
- [ ] Plants search works
- [ ] AI chat streams responses
- [ ] Frontend connects to backend
- [ ] Favorites can be saved/loaded
- [ ] Care history records saved
- [ ] Authentication tokens work
- [ ] Error handling tested
- [ ] Performance acceptable (< 200ms)

---

## Next Steps

1. ✅ **Phase 3B**: Optimize API performance
2. ⏳ **Phase 4**: Add comprehensive testing
3. ⏳ **Phase 5**: Prepare for production release

---

**Last Updated:** 2026-05-05
