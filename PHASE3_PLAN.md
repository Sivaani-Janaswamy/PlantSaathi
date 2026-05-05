# Phase 3: Backend Integration & API Implementation

**Objective:** Build production-grade backend APIs and integrate with Supabase  
**Timeline:** 3-4 days | **Focus:** Scalable, type-safe, well-documented

---

## 3A: Supabase Database Schema (Day 1)

### Task 3A.1: Create Users & Authentication Tables

**File:** `backend/supabase/migrations/001_create_auth_tables.sql`

```sql
-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_premium BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only view/edit their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Task 3A.2: Create Plants Table

**File:** `backend/supabase/migrations/002_create_plants_table.sql`

```sql
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  common_name TEXT NOT NULL,
  scientific_name TEXT UNIQUE NOT NULL,
  family TEXT NOT NULL,
  description TEXT,
  origin TEXT,
  plant_type TEXT NOT NULL, -- 'herb', 'flower', 'vegetable', 'tree', etc.
  
  -- Care requirements
  watering_frequency TEXT, -- 'daily', 'every-2-days', 'weekly', etc.
  sunlight_requirement TEXT, -- 'full-sun', 'partial-shade', 'full-shade'
  temperature_min INTEGER, -- Celsius
  temperature_max INTEGER,
  humidity_level TEXT, -- 'low', 'medium', 'high'
  soil_type TEXT, -- 'sandy', 'loamy', 'clay'
  
  -- Metadata
  difficulty_level TEXT, -- 'beginner', 'intermediate', 'advanced'
  growth_rate TEXT, -- 'slow', 'medium', 'fast'
  mature_height TEXT, -- e.g., "30-60 cm"
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search
CREATE INDEX idx_plants_common_name ON plants USING GIN (common_name gin_trgm_ops);
CREATE INDEX idx_plants_scientific_name ON plants USING GIN (scientific_name gin_trgm_ops);
CREATE INDEX idx_plants_type ON plants(plant_type);

-- Full-text search
CREATE INDEX idx_plants_search ON plants USING GIN (
  to_tsvector('english', common_name || ' ' || scientific_name || ' ' || description)
);
```

### Task 3A.3: Plant Images Table

```sql
CREATE TABLE plant_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL, -- Path in Supabase storage
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plant_images_plant_id ON plant_images(plant_id);
```

### Task 3A.4: User Favorites Table

```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, plant_id)
);

-- RLS: Users can only manage their own favorites
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
```

### Task 3A.5: Care History Table

```sql
CREATE TABLE care_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  care_type TEXT NOT NULL, -- 'watered', 'fertilized', 'pruned', 'repotted'
  notes TEXT,
  date_performed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE care_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own care history" ON care_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create care records" ON care_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_care_history_user_plant ON care_history(user_id, plant_id);
CREATE INDEX idx_care_history_date ON care_history(date_performed DESC);
```

### Task 3A.6: Chat Messages Table

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
```

---

## 3B: Express.js API Setup (Day 1-2)

### Task 3B.1: Project Structure

```
backend/
├── src/
│   ├── index.js                 # Entry point
│   ├── config/
│   │   ├── database.js          # Supabase client
│   │   ├── env.js               # Environment variables
│   │   └── constants.js         # App constants
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── logger.js            # Request logging
│   ├── routes/
│   │   ├── index.js             # Route aggregator
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── plants.routes.js     # Plant endpoints
│   │   ├── favorites.routes.js  # Favorite endpoints
│   │   ├── care.routes.js       # Care history
│   │   └── ai.routes.js         # AI chat
│   ├── services/
│   │   ├── plantService.js      # Plant logic
│   │   ├── aiService.js         # AI integration
│   │   ├── favoriteService.js   # Favorites logic
│   │   └── careService.js       # Care tracking
│   ├── controllers/
│   │   ├── plantController.js
│   │   ├── aiController.js
│   │   └── careController.js
│   ├── utils/
│   │   ├── validators.js        # Input validation
│   │   ├── errors.js            # Custom errors
│   │   └── helpers.js           # Utility functions
│   └── integrations/
│       └── anthropic.js         # Claude API
├── .env.example
├── .env                         # Secrets (not in repo)
├── package.json
└── README.md
```

### Task 3B.2: Express Setup & Middleware

**File:** `backend/src/index.js`

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 3C: Plant Search API (Day 2)

### Task 3C.1: Plant Controller

**File:** `backend/src/controllers/plantController.js`

```javascript
import { plantService } from '../services/plantService.js';
import { validateSearchQuery, validatePlantId } from '../utils/validators.js';
import { AppError } from '../utils/errors.js';

export const searchPlants = async (req, res, next) => {
  try {
    const { q, type, limit = 20, offset = 0 } = req.query;

    if (!q || q.trim().length < 2) {
      throw new AppError('Search query must be at least 2 characters', 400);
    }

    if (limit > 100) {
      throw new AppError('Limit cannot exceed 100', 400);
    }

    const results = await plantService.search(q, {
      type,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: results.data,
      total: results.total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    next(error);
  }
};

export const getPlantDetail = async (req, res, next) => {
  try {
    const { plantId } = req.params;

    validatePlantId(plantId);

    const plant = await plantService.getById(plantId);

    if (!plant) {
      throw new AppError('Plant not found', 404);
    }

    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { type = 'herb', limit = 10 } = req.query;

    const recommendations = await plantService.getRecommendations(type, limit);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};
```

### Task 3C.2: Plant Service

**File:** `backend/src/services/plantService.js`

```javascript
import { supabase } from '../config/database.js';

export const plantService = {
  async search(query, options = {}) {
    const { type, limit = 20, offset = 0 } = options;

    let builder = supabase
      .from('plants')
      .select('id, common_name, scientific_name, plant_type, difficulty_level', {
        count: 'exact'
      })
      .or(`common_name.ilike.%${query}%,scientific_name.ilike.%${query}%,description.ilike.%${query}%`);

    if (type) {
      builder = builder.eq('plant_type', type);
    }

    builder = builder
      .range(offset, offset + limit - 1)
      .order('common_name', { ascending: true });

    const { data, count, error } = await builder;

    if (error) throw error;

    return {
      data,
      total: count || 0
    };
  },

  async getById(plantId) {
    const { data, error } = await supabase
      .from('plants')
      .select(`
        *,
        plant_images(image_url, alt_text, is_primary)
      `)
      .eq('id', plantId)
      .single();

    if (error) throw error;
    return data;
  },

  async getRecommendations(type, limit) {
    const { data, error } = await supabase
      .from('plants')
      .select('id, common_name, scientific_name, plant_type, difficulty_level')
      .eq('plant_type', type)
      .eq('difficulty_level', 'beginner')
      .limit(limit)
      .order('common_name', { ascending: true });

    if (error) throw error;
    return data;
  }
};
```

### Task 3C.3: Plant Routes

**File:** `backend/src/routes/plants.routes.js`

```javascript
import express from 'express';
import { searchPlants, getPlantDetail, getRecommendations } from '../controllers/plantController.js';

const router = express.Router();

router.get('/search', searchPlants);
router.get('/recommendations', getRecommendations);
router.get('/:plantId', getPlantDetail);

export default router;
```

---

## 3D: AI Chat Service (Day 2-3)

### Task 3D.1: Anthropic Integration

**File:** `backend/src/integrations/anthropic.js`

```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const generatePlantAdvice = async (message, plantContext = null) => {
  const systemPrompt = `You are PlantSaathi, a helpful plant care assistant. 
    You provide friendly, accurate advice about plant identification, care, and troubleshooting.
    Keep responses concise (under 300 words) and friendly.
    ${plantContext ? `The user is asking about: ${plantContext.common_name} (${plantContext.scientific_name})` : ''}`;

  const stream = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      { role: 'user', content: message }
    ],
    stream: true
  });

  return stream;
};

export const calculateTokens = async (message) => {
  // Rough estimate: ~4 chars per token
  return Math.ceil(message.length / 4);
};
```

### Task 3D.2: AI Controller

**File:** `backend/src/controllers/aiController.js`

```javascript
import { aiService } from '../services/aiService.js';
import { supabase } from '../config/database.js';

export const chat = async (req, res, next) => {
  try {
    const { message, plantId } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Get plant context if provided
    let plantContext = null;
    if (plantId) {
      const { data } = await supabase
        .from('plants')
        .select('common_name, scientific_name, watering_frequency, sunlight_requirement')
        .eq('id', plantId)
        .single();
      plantContext = data;
    }

    // Save user message
    await supabase.from('chat_messages').insert({
      user_id: userId,
      plant_id: plantId || null,
      role: 'user',
      content: message
    });

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Get AI response (streaming)
    const stream = await aiService.getResponse(message, plantContext);

    let fullResponse = '';

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        const text = event.delta.text;
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // Save assistant message
    const tokensUsed = Math.ceil(fullResponse.length / 4);
    await supabase.from('chat_messages').insert({
      user_id: userId,
      plant_id: plantId || null,
      role: 'assistant',
      content: fullResponse,
      tokens_used: tokensUsed
    });

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    next(error);
  }
};
```

---

## 3E: Favorites & Care History (Day 3)

### Task 3E.1: Favorites Controller

```javascript
export const addFavorite = async (req, res, next) => {
  try {
    const { plantId } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, plant_id: plantId })
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { plantId } = req.params;
    const userId = req.user.id;

    await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('plant_id', plantId);

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from('user_favorites')
      .select(`
        id,
        created_at,
        plants(id, common_name, scientific_name, plant_type)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data.map(fav => fav.plants),
      total: count
    });
  } catch (error) {
    next(error);
  }
};
```

### Task 3E.2: Care History Controller

```javascript
export const logCare = async (req, res, next) => {
  try {
    const { plantId, careType, notes } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('care_history')
      .insert({
        user_id: userId,
        plant_id: plantId,
        care_type: careType,
        notes
      })
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (error) {
    next(error);
  }
};

export const getCareHistory = async (req, res, next) => {
  try {
    const { plantId } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('care_history')
      .select('*')
      .eq('user_id', userId)
      .eq('plant_id', plantId)
      .order('date_performed', { ascending: false })
      .limit(100);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
```

---

## 3F: API Documentation (Day 3)

### API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/plants/search` | GET | ❌ | Search plants |
| `/api/plants/:plantId` | GET | ❌ | Get plant details |
| `/api/plants/recommendations` | GET | ❌ | Get recommendations |
| `/api/favorites` | POST | ✅ | Add favorite |
| `/api/favorites/:plantId` | DELETE | ✅ | Remove favorite |
| `/api/favorites` | GET | ✅ | List favorites |
| `/api/ai/chat` | POST | ✅ | Chat with AI (SSE) |
| `/api/care/log` | POST | ✅ | Log plant care |
| `/api/care/:plantId/history` | GET | ✅ | Get care history |

---

## 🎯 Success Criteria

- ✅ Supabase schema created (all tables)
- ✅ Express.js API running
- ✅ Plant search endpoint working
- ✅ AI chat streaming working
- ✅ Favorites system working
- ✅ Care history tracking working
- ✅ All endpoints authenticated
- ✅ Error handling implemented
- ✅ Rate limiting active
- ✅ Documentation complete

---

## ⏱️ Estimated Timeline

- **3A (Database):** 2-3 hours
- **3B (Express setup):** 2-3 hours
- **3C (Plant API):** 2-3 hours
- **3D (AI Chat):** 3-4 hours
- **3E (Favorites/Care):** 2-3 hours
- **3F (Documentation):** 1-2 hours
- **Testing & Fixes:** 2-3 hours

**Total: 15-20 hours**
