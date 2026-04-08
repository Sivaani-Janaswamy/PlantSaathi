```markdown
# PlantSaathi Implementation Guide

## Overview
This document provides a step-by-step implementation plan for the PlantSaathi backend, aligning with the OpenAPI specification, architecture, and database design. The approach emphasizes modularity, clarity, and maintainability, using Node.js (Express) for the backend, Supabase for database/auth, and integration with external APIs.

---

## Backend Setup

1. **Initialize Node.js Project**
   - `npm init -y`
   - Use ES modules or CommonJS as preferred

2. **Install Dependencies**
   - Express (`npm install express`)
   - Supabase client (`npm install @supabase/supabase-js`)
   - dotenv (`npm install dotenv`)
   - multer (`npm install multer`)
   - cors, helmet, and other middleware as needed

3. **Folder Structure**
   ```
   /controllers
   /services
   /routes
   /config
   /middlewares
   app.js
   ```

---

## Environment Configuration

Set the following environment variables in a `.env` file:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `PLANT_API_KEY`
- `AI_API_KEY`

---

## Database Setup (Supabase)

1. **Create Tables**
   - `plants` (see database_design.md for fields and constraints)
   - `favorites` (see database_design.md for fields and constraints)

2. **Relationships & Constraints**
   - `favorites.user_id` → `auth.users.id` (foreign key)
   - `favorites.plant_id` → `plants.id` (nullable foreign key)
   - CHECK constraint on `favorites` for type/field logic
   - Optional: unique constraint on (`common_name`, `scientific_name`) in `plants`

---

## API Implementation Plan

### /plants/search
- **Controller:** Validates query, calls service
- **Service:** Queries Supabase for plants matching `q` (use index on `common_name`)
- **DB Interaction:** SELECT from `plants` with LIKE/ILIKE

### /plants/{id}
- **Controller:** Extracts plant ID, calls service
- **Service:** Fetches plant by ID from Supabase
- **DB Interaction:** SELECT by primary key

### /plants/identify
- **Controller:** Handles image upload (multer), calls service
- **Service:** Sends image to Plant Identification API, checks if plant exists in DB, inserts if new, returns details
- **DB/External:** POST to Plant API, SELECT/INSERT in `plants`

### /ai/ask
- **Controller:** Validates question, calls service
- **Service:** Sends question to AI API, returns answer (optionally store for analytics)
- **External:** POST to AI API

### /favorites (GET)
- **Controller:** Verifies user, calls service
- **Service:** Fetches all favorites for user from Supabase
- **DB Interaction:** SELECT from `favorites` WHERE `user_id` = current user

### /favorites (POST)
- **Controller:** Validates input, verifies user, calls service
- **Service:** Inserts new favorite (plant or AI) for user
- **DB Interaction:** INSERT into `favorites` with constraints

---

## External API Integration

- **Plant Identification API**
  - Use HTTP client (e.g., axios/fetch)
  - Send image as multipart/form-data
  - Parse response, map to plant schema

- **AI API**
  - Send question as JSON
  - Parse and return answer

- **Request/Response Handling**
  - Handle errors and timeouts gracefully
  - Map external API errors to standard error format

---

## Authentication Integration (Supabase)

- **Frontend:** Handles user login/signup via Supabase Auth SDK
- **Backend:** Receives JWT in Authorization header, verifies using Supabase client
- **Extract user_id:** Decode JWT, use for all user-specific DB operations

---

## File Upload Handling

- Use `multer` middleware for `/plants/identify`
- Accept image files, store temporarily or stream to external API

---

## Error Handling

- All error responses should use:
  ```json
  {
    "message": "error message"
  }
  ```
- Use consistent status codes (400, 404, 500, etc.)

---

## Development Flow (Step-by-Step)

1. **Setup backend**
   - Initialize project, install dependencies, set up folder structure

2. **Setup database**
   - Create tables and relationships in Supabase

3. **Implement APIs**
   - Build controllers, services, and routes for each endpoint

4. **Test with Postman/Swagger**
   - Validate endpoints, error handling, and data flows

5. **Connect Flutter app**
   - Integrate frontend with backend APIs

---

## Future Improvements (Optional)

- Add pagination to plant search and favorites
- Optimize caching for plant data and AI responses
- Implement notifications for user actions or plant care reminders

---

## Implementation Progress

### Backend Setup
- [x] Initialize Node.js project
- [x] Install dependencies
- [x] Setup folder structure
- [x] Configure environment variables

### Database (Supabase)
- [x] Create plants table
- [x] Create favorites table
- [x] Add constraints
- [x] Add indexes

### API Development

#### Plants
- [ ] GET /plants/search
- [ ] GET /plants/{id}
- [ ] POST /plants/identify

#### AI
- [ ] POST /ai/ask

#### Favorites
- [ ] GET /favorites
- [ ] POST /favorites

### Integrations
- [ ] Plant Identification API integration
- [ ] AI API integration

### Authentication
- [ ] Setup Supabase Auth in frontend
- [ ] Verify JWT in backend

### Testing
- [ ] Test APIs using Postman or Swagger
- [ ] Handle error cases

### Frontend Integration
- [ ] Connect Flutter app to backend
- [ ] Test complete user flows

---