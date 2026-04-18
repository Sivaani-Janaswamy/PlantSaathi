````markdown
# PlantSaathi Architecture

## Overview
PlantSaathi is a Flutter-based mobile application that helps users identify plants, learn about them, and ask AI-powered plant care questions. The app provides plant search, detailed plant information, image-based plant identification, an AI assistant, and the ability to save favorite plants or AI responses.

## Tech Stack
- **Frontend:** Flutter (mobile)
- **Backend:** Node.js (Express)
- **Database, Auth, Storage:** Supabase
- **External APIs:**
  - Plant Identification API (for image-based plant recognition)
  - AI API (LLM for plant-related questions)

## System Architecture
The system follows a modular, service-oriented architecture:
- The Flutter app communicates with the backend via RESTful APIs (as defined in the OpenAPI spec).
- The backend handles business logic, integrates with Supabase for data/auth, and calls external APIs for plant identification and AI responses.
- Supabase manages user authentication, database storage, and file storage (for images).

## Architecture Diagram

```
+-------------------+         +-------------------+         +-------------------+
|   Flutter Mobile  | <-----> |   Node.js Backend | <-----> |    Supabase DB    |
|      (Client)     |  REST   |   (Express API)   |  SQL    |  (Postgres/Auth)  |
+-------------------+         +-------------------+         +-------------------+
         |                             |
         |                             |
         |                             v
         |                  +-------------------+
         |                  |  External APIs    |
         |                  |  (Plant ID, AI)   |
         |                  +-------------------+
```

## Backend Architecture
- **Controller Layer:** Handles HTTP requests, input validation, and routes requests to the service layer.
- **Service Layer:** Contains business logic for each feature (search, identify, AI, favorites).
- **Integration Layer:** 
  - Integrates with Supabase for database operations (CRUD), authentication verification, and file storage.
  - Connects to external APIs for plant identification and AI question answering.
- **Data Layer:** Manages data persistence and retrieval using Supabase/Postgres.

## Data Flow
### a) Plant Search
1. User searches for a plant in the app.
2. Flutter app calls `GET /plants/search?q=`.
3. Controller validates query and calls Service.
4. Service queries Supabase for matching plants.
5. Results returned to client.

### b) Plant Identification
1. User uploads/takes a plant image.
2. Flutter app calls `POST /plants/identify` with image.
3. Controller receives image, calls Plant Identification API.
4. Service processes API response, then:
   - **Checks if the identified plant already exists in Supabase.**
   - If not, stores the new plant data in Supabase for future use (caching).
5. Identified plant details returned to client.
6. This caching reduces repeated external API calls, resulting in faster response and a smoother user experience.

### c) AI Question
1. User asks a plant-related question.
2. Flutter app calls `POST /ai/ask` with question.
3. Controller validates input, calls AI API.
4. Service returns AI-generated answer to client.
5. *Optionally, AI responses may be stored for reuse or analytics.*

### d) Saving Favorites
1. User saves a plant or AI response as favorite.
2. Flutter app calls `POST /favorites`.
3. Controller validates input, calls Service.
4. Service stores favorite in Supabase (linked to user).
5. Confirmation returned to client.

### e) Removing Favorites
1. User taps unsave/remove from a favorite card or detail action.
2. Flutter app calls `DELETE /favorites/{id}`.
3. Controller verifies the authenticated user owns the favorite.
4. Service deletes the record from Supabase.
5. The UI refreshes the saved list or toggle state.

### f) Plant Identification
1. User opens the identify screen from the home app bar or the Search tab.
2. Flutter app lets the user choose a clear photo from the gallery.
3. Flutter app calls `POST /plants/identify` with multipart image data.
4. Controller forwards the request to the plant identification service.
5. Service maps the identified plant into the canonical plant model and returns it to the client.
6. The UI can copy, share, or open the identified plant in detail view.

## External API Integration

---

## API Endpoints (Updated)

| Endpoint                       | Method | Auth      | Request Body / Params                | Response (200/201)                                   | Errors (400/401/404/500)                |
|--------------------------------|--------|-----------|--------------------------------------|------------------------------------------------------|-----------------------------------------|
| /ai/ask                        | POST   | Bearer    | `{question: string}`                 | `{ success: true, data: { answer: string } }`        | `{ success: false, message: ... }`      |
| /plants/search                 | GET    | Public    | `q` (query param, required)          | `{ success: true, data: { plants: [...], pagination: {...} } }` | `{ success: false, message: ... }` |
| /plants/{id}                   | GET    | Public    | `{id}` (path param)                  | `{ success: true, data: { ...plant fields... } }`    | `{ success: false, message: ... }`      |
| /plants/identify               | POST   | Public    | `image` (form-data, required)        | `{ success: true, data: { ...plant fields... } }`    | `{ success: false, message: ... }`      |
| /favorites                     | GET    | Bearer    | `page`, `limit` (query, optional)    | `{ success: true, data: [ ...favorites... ] }`       | `{ success: false, message: ... }`      |
| /favorites                     | POST   | Bearer    | `{type: plant\|ai, plant_id?, text?}` | `{ success: true, data: { ...favorite fields... } }` | `{ success: false, message: ... }`      |
| /favorites/{id}                | DELETE | Bearer    | `{id}` (path param)                  | `{ success: true, data: { ...favorite fields... } }` | `{ success: false, message: ... }`      |
| /recommendations               | GET    | Bearer    |                                      | `{ success: true, data: [ ...plants... ] }`          | `{ success: false, message: ... }`      |

- **Status Codes:** 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)
- **All protected routes require:** `Authorization: Bearer <token>`

- All database operations (search, save, retrieve) are performed via Supabase client in the backend.


## Frontend Integration Architecture

### Folder Structure

- The current Flutter app follows a modular feature-first layout:

```
/lib
  /core
    theme.dart
    routes.dart
    session_manager.dart
    api_service.dart
    supabase_config.dart
  /models
    plant.dart
    favorite.dart
    ai_response.dart
  /services
    api_service.dart
    auth_service.dart
    plant_service.dart
    ai_service.dart
    favorites_service.dart
    recommendations_service.dart
  /widgets
    app_logo_widget.dart
    app_section_header.dart
    empty_state_card.dart
    error_state_card.dart
    loading_widget.dart
    primary_action_button.dart
    skeleton_loader.dart
  /features
    splash/
    auth/
    home/
    search/
    identify/
    plant_detail/
    ai/
    favorites/
    recommendations/
    profile/
  main.dart
```

### API Integration

- All API calls must use the documented endpoints.
- All responses are in the format `{ success: true, data: ... }` or `{ success: false, message: ... }`.
- Use Supabase JWT for authentication and attach as `Authorization: Bearer <token>`.

### Error Handling

- Always check the `success` field.
- Display `message` for errors.
- For AI, handle fallback answer `"AI service busy, try again later"` gracefully.

### State Management

- The app uses local widget state for screen-specific behavior and lightweight services for backend access.
- The home shell uses an `IndexedStack` so tab state stays stable when users switch tabs.
- Session state is persisted through Supabase plus secure storage helpers rather than a large global state container.

### UI Flow

- Splash → auth-aware routing → Login or Home
- Home uses tabs for Search, AI, Favorites, Discover, and Profile.
- Search results open a dedicated plant detail page with share, copy, and save actions.
- Plant identification is reachable from the home app bar and Search tab as a dedicated screen.
- The identify screen uses a gallery picker, a loading overlay, and clear empty/error states.
- AI answers support copy/share/save and show a backend-driven fallback state when the service is busy.
- Favorites can be saved and unsaved directly from the list and from detail views.
- Recommendations are served from the canonical `/recommendations` endpoint.

## Getting Started

To run the PlantSaathi backend locally:

1. Clone the repository
2. Install dependencies using `npm install`
3. Set up environment variables:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - PLANT_API_KEY
   - AI_API_KEY
4. Run the server using `npm run dev`

The frontend (Flutter app) connects to the backend via the defined REST APIs.

---
This architecture balances simplicity, scalability, and rapid development, making PlantSaathi easy to maintain and extend.
````
