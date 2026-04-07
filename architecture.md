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

## External API Integration
- **Plant Identification API:** Used in `/plants/identify` endpoint. Receives image, returns plant data. Backend may map or enrich this data with local plant info from Supabase. Plant data is cached in Supabase to reduce redundant API calls.
- **AI API:** Used in `/ai/ask` endpoint. Receives question, returns answer. Backend acts as a proxy and may log, filter, or optionally store questions and responses.

## Supabase Integration
- **Auth:** User authentication is handled by Supabase directly on the client side (Flutter). The backend verifies user identity by validating Supabase-issued JWT tokens on each request.
- **Database:** Stores plant catalog, user favorites, and user profiles.
- **Storage:** Used for storing uploaded plant images (if needed).
- All database operations (search, save, retrieve) are performed via Supabase client in the backend.

## Design Decisions
- **Flutter** chosen for cross-platform mobile development.
- **Node.js (Express)** for a simple, scalable backend with wide ecosystem support.
- **Supabase** provides managed Postgres, authentication, and storage, reducing backend complexity.
- **External APIs** are used for specialized tasks (plant identification, AI) to avoid reinventing complex ML solutions.
- **Caching plant data** in Supabase reduces dependency on external APIs and improves performance.
- **Service-oriented backend** keeps logic modular and maintainable.
- **RESTful API** design ensures clear separation between frontend and backend, and easy future integration with other clients.

---
This architecture balances simplicity, scalability, and rapid development, making PlantSaathi easy to maintain and extend.
````