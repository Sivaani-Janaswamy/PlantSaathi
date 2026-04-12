# PlantSaathi Database Design

## Overview
The PlantSaathi backend uses PostgreSQL (managed by Supabase) to store plant data and user favorites. User authentication is handled by Supabase Auth, which manages the `auth.users` table. The database is designed to cache plant information from external APIs and allow users to save their favorite plants or AI responses. This design reduces repeated external API calls through caching and ensures efficient user-specific data retrieval.

- All IDs are UUIDs and are returned as strings in API responses.
- Timestamps follow ISO 8601 format.

## Tables

### users (Supabase Auth)
- Managed by Supabase Auth as `auth.users`
- Fields include: `id` (uuid, primary key), email, and other authentication-related fields

### plants
| Field           | Type    | Constraints                |
|-----------------|---------|----------------------------|
| id              | uuid    | primary key                |
| common_name     | text    | not null                   |
| scientific_name | text    | not null                   |
| uses            | text    |                            |
| benefits        | text    |                            |
| where_it_grows  | text    |                            |
| how_to_grow     | text    |                            |
| image_url       | text    |                            |
| created_at      | timestamptz | default now()           |
| updated_at      | timestamptz | default now()           |

- **Full-text search support:**
  - A GIN index is recommended on the concatenation of `common_name` and `scientific_name` for scalable, relevant search:
    ```sql
    CREATE INDEX plants_fulltext_idx ON plants USING GIN (to_tsvector('english', common_name || ' ' || scientific_name));
    ```

### favorites
| Field      | Type    | Constraints                                      |
|------------|---------|--------------------------------------------------|
| id         | uuid    | primary key                                      |
| user_id    | uuid    | foreign key → auth.users.id, not null            |
| plant_id   | uuid    | foreign key → plants.id, nullable                |
| text       | text    | nullable (for AI responses)                      |
| type       | text    | check (type in ('plant', 'ai')), not null        |
| created_at | timestamptz | default now()                                 |
| updated_at | timestamptz | default now()                                 |

- **Constraint:**
  - A CHECK constraint enforces:
    (type = 'plant' AND plant_id IS NOT NULL AND text IS NULL)
    OR
    (type = 'ai' AND text IS NOT NULL AND plant_id IS NULL)

- **Preventing duplicates:**
  - Unique constraints are recommended to avoid duplicate favorites:
    - For plant favorites: (`user_id`, `plant_id`, `type`)
    - For AI favorites: (`user_id`, `text`, `type`)
    ```sql
    ALTER TABLE favorites ADD CONSTRAINT unique_plant_favorite UNIQUE (user_id, plant_id, type);
    ALTER TABLE favorites ADD CONSTRAINT unique_ai_favorite UNIQUE (user_id, text, type);
    ```
### ai_responses
| Field      | Type    | Constraints                                      |
|------------|---------|--------------------------------------------------|
| id         | uuid    | primary key                                      |
| user_id    | uuid    | foreign key → auth.users.id, nullable            |
| question   | text    | not null                                         |
| answer     | text    | not null                                         |
| created_at | timestamptz | default now()                                 |

- **Purpose:**
  - Used for caching AI responses
  - Reduces API cost and latency
  - Enables analytics and history
  - Unique constraint on (`user_id`, `question`) ensures no duplicate cache entries per user:
    ```sql
    ALTER TABLE ai_responses ADD CONSTRAINT unique_user_question UNIQUE (user_id, question);
    ```
# Scalability Considerations

- **Full-text search:**
  - Use a GIN index on `plants` for efficient, scalable search across `common_name` and `scientific_name`.

- **AI response caching:**
  - The `ai_responses` table enables fast lookup and deduplication of AI answers, reducing external API calls and supporting analytics.

- **Indexing strategy:**
  - Ensure indexes on all foreign keys and frequently queried fields (e.g., `favorites.user_id`, `favorites.plant_id`, `ai_responses.user_id`, `ai_responses.question`).
  - Use unique constraints to prevent duplicate data and maintain data integrity.
## Indexes

- Index on `plants.common_name` for faster plant search
- Index on `favorites.user_id` for fast retrieval of user favorites
- Index on `favorites.plant_id` for efficient relationship queries
## Optional Uniqueness Constraint

- A unique constraint can be applied on (`common_name`, `scientific_name`) in the `plants` table to avoid duplicate plant entries.

## Relationships
- One user (`auth.users`) → many favorites (`favorites.user_id`)
- One plant (`plants`) → many favorites (`favorites.plant_id`)

## ER Diagram

```
+-----------+         +-----------+         +-----------+
|  users    | 1     * | favorites | *     1 |  plants   |
|-----------|---------|-----------|---------|-----------|
| id (PK)   |<------->| user_id   |         | id (PK)   |
| ...       |         | plant_id  |<------->| ...       |
+-----------+         | text      |         +-----------+
                     | type      |
                     | created_at|
                     +-----------+
```

## Design Decisions
- **Supabase Auth** is used for user management, so user records are not duplicated in the app database.
- **Plant data** is cached in the `plants` table to reduce external API calls and improve performance.
- **Favorites** table supports both plant and AI response favorites using a `type` field and nullable columns.
- **Simple constraints** ensure data integrity without overcomplicating the schema.
- **Timestamps** (`created_at`) are included for tracking and sorting records.

This schema is designed for clarity, maintainability, and efficient support of PlantSaathi's core features.
