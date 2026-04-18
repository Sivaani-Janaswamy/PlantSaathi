# PlantSaathi Database Design

## Overview
PlantSaathi uses Supabase Postgres for plant data, favorites, AI response caching, and lightweight personalization metadata. Authentication is handled by Supabase Auth, so user accounts live in `auth.users` and are referenced by foreign key where needed.

## Core Principles
- All IDs are UUIDs and are returned as strings in the API.
- Timestamps use ISO 8601 / `timestamptz`.
- The app treats plant and AI favorites as toggleable saved records.
- Plant data is cached locally in Postgres to reduce repeated external API calls.

## Tables

### `plants`
Stores canonical plant metadata returned by search, detail, identify, and recommendations flows.

| Field | Type | Constraints |
|---|---|---|
| id | uuid | primary key |
| common_name | text | not null |
| scientific_name | text | not null |
| uses | text | nullable |
| benefits | text | nullable |
| where_it_grows | text | nullable |
| how_to_grow | text | nullable |
| image_url | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

Recommended indexes:
- `plants.common_name`
- `plants.scientific_name`
- full-text search across `common_name` and `scientific_name`

### `favorites`
Stores saved plant or AI items for each user.

| Field | Type | Constraints |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | foreign key → `auth.users.id`, not null |
| plant_id | uuid | foreign key → `plants.id`, nullable |
| text | text | nullable |
| type | text | check in (`plant`, `ai`), not null |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

Validation rules:
- If `type = 'plant'`, then `plant_id` must be present and `text` must be null.
- If `type = 'ai'`, then `text` must be present and `plant_id` must be null.

Recommended uniqueness:
- `(user_id, plant_id, type)` for plant favorites
- `(user_id, text, type)` for AI favorites

Toggle behavior:
- Save creates a favorite if it does not already exist.
- Unsave removes the existing favorite row by `id`.
- The mobile app reads the current favorite state to keep detail/AI/save buttons in sync.

Recommended indexes:
- `favorites.user_id`
- `favorites.plant_id`

### `ai_responses`
Stores AI questions and answers for optional caching and analytics.

| Field | Type | Constraints |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | foreign key → `auth.users.id`, nullable |
| question | text | not null |
| answer | text | not null |
| created_at | timestamptz | default now() |

Recommended uniqueness:
- `(user_id, question)` to avoid duplicate cached answers per user

### `user_activity`
Tracks lightweight user behavior for personalization and recommendations.

| Field | Type | Constraints |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | foreign key → `auth.users.id`, not null |
| activity_type | text | check in (`search`, `ai_query`, `plant_view`) |
| reference_id | uuid | nullable, typically a plant id |
| query | text | nullable, used for search or AI text |
| created_at | timestamptz | default now() |

Usage:
- Search activity helps surface recommendations.
- Plant view activity can feed the recommendations engine.
- AI query activity can support analytics and future personalization.

## Relationships
- One user (`auth.users`) → many favorites
- One user (`auth.users`) → many AI response cache rows
- One user (`auth.users`) → many activity rows
- One plant (`plants`) → many favorites

## Design Decisions
- Supabase Auth is the source of truth for identity.
- Plant identification can cache identified plants into `plants` when the backend resolves a match.
- Favorites are modeled as explicit rows so the mobile app can toggle save/unsave cleanly.
- `user_activity` is intentionally lightweight so future recommendation logic can evolve without changing the client contract.

## Notes for Future Work
- If search pagination becomes server-driven, keep the response envelope unchanged and add pagination metadata only.
- If recommendation ranking changes, keep `/recommendations` as the canonical public contract and evolve the backend implementation behind it.
- If image storage is added later, keep the plant identify response shape stable so the mobile app does not need a breaking change.
