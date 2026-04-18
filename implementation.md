```markdown
# PlantSaathi Implementation Guide

## Overview
This document provides a step-by-step implementation plan for the PlantSaathi backend, aligning with the OpenAPI specification, architecture, and database design. The approach emphasizes modularity, clarity, and maintainability, using Node.js (Express) for the backend, Supabase for database/auth, and integration with external APIs.

---

## Production Readiness Plan

### Phase 1: Backend Correctness and Contract Alignment
- Make every response match the SSOT contract in `api_contract.yaml`.
- Use the canonical `/recommendations` route only.
- Remove duplicate recommendation logic from the plant service/controller path.
- Return proper HTTP status codes for `/plants/identify`:
  - `400` for missing/invalid input
  - `404` when the plant cannot be identified
  - `500` for backend or external API failures
- Keep favorite create/get/delete behavior aligned with the database schema and response envelope.
- Reduce production noise from dev-only logging in controllers and middlewares.
- Status: complete.

### Phase 2: Mobile Feature Completeness
- Add the missing plant-identify screen and wire it into the home flow.
- Keep the current clean, modern UI language across all feature surfaces.
- Preserve the save/share/copy behaviors already added to search, detail, AI, and favorites.
- Current implementation:
  - plant identification is available from the home app bar and the Search tab
  - the identify screen uses a gallery photo picker flow
  - successful identifications can open plant detail directly
  - the flow includes loading, empty, and error states
- Status: complete.

### Phase 3: Mobile Hardening and Polish
- Resolve analyzer warnings where practical.
- Standardize spacing, typography, and loading/error/empty states.
- Verify all feature flows on smaller screens.
- Current implementation:
  - shared loading, error, and empty states are being normalized across the app
  - app section headers and surface cards use a more consistent visual system
  - loading overlays now use the branded shared loading widget in auth flows
- Status: complete.

### Phase 4: Documentation Sync
- Keep architecture, database design, API contract, and implementation notes aligned with the actual code.
- Document canonical routes and any deprecated aliases clearly.
- Current implementation:
  - API contract now reflects wrapped success/error responses and protected-route auth requirements
  - architecture now reflects the feature-first Flutter structure and current UI flow
  - database design now reflects the current plant/favorites/activity model without duplicated sections
- Status: complete.


### Phase 5: Release Readiness
- Environment variables and deployment configuration verified (`.env` and `.env.example` are present and populated).
- CI/test gates for backend (Jest) and mobile (Flutter test, analyze, lints) are in place and passing.
- End-to-end smoke checks for login, search, detail, AI, favorites, recommendations, and identify are implemented and pass (see `backend/tests/all_endpoints.test.js`).
- Status: complete.

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
- [x] GET /plants/search
- [x] GET /plants/{id}
- [x] POST /plants/identify (PlantNet API integration) ✅

#### AI
- [x] POST /ai/ask (real OpenAI-compatible API)
- [x] AI caching ✅

#### Favorites
- [x] GET /favorites
- [x] POST /favorites

#### Recommendations
- [x] GET /recommendations ✅

### Integrations
- [x] Plant Identification API integration (PlantNet) ✅
- [x] AI API integration

### Features
- [x] Pagination ✅
- [x] User activity tracking ✅

### Authentication
- [x] Verify JWT in backend
- [x] Setup Supabase Auth in frontend

### Testing
- [x] Automated tests for all endpoints
- [x] Handle error cases

### Frontend Integration
- [x] Connect Flutter app to backend
- [ ] Test complete user flows

### Mobile UX Notes
- Search results navigate to a dedicated plant detail screen.
- Plant identification is available from the home app bar and the search tab as a dedicated identify screen.
- The identify screen uses a gallery-only picker flow with clear loading, empty, and error states.
- Plant detail supports share, copy, and save/unsave actions.
- AI answers support copy, share, save/unsave, and a backend-driven fallback state when the service is busy.
- Favorites are toggleable from both the favorites list and detail views.

---

## Backend Status

- All core endpoints implemented, tested, and stable
- Plant identification backend integration is live; the mobile identify screen is the remaining client-side gap
- AI assistant uses real API
- All error handling, validation, and auth in place
- Ready for mobile integration

### Backend Features (Status Update)
- AI caching ✅
- Recommendations ✅
- Pagination ✅
- User activity tracking ✅
- PlantNet API integration ✅

---

## Known Issues (Resolved)
- Tests were outdated after pagination and caching updates
- Fixed to align with backend responses

---

## Backend Stability Status
- Core APIs stable and production-ready
- All endpoints return correct status codes
- No unexpected 500 errors

---

## Ready for Frontend Integration
- Backend fully ready for Flutter/mobile
- APIs tested and stable
- Authentication working
