# PlantSaathi - Suggested GitHub Issues

Below are initial issues to create for tracking future work. Each is formatted for direct copy-paste into GitHub issues.

---

## Phase 3: Backend Integration & API

### Issue: Setup Supabase Database Schema

**Title:** `[backend] Setup Supabase database schema for plants and users`

**Label:** `backend`, `database`, `phase-3`

**Body:**
```
## 📋 Description
Create and configure the Supabase database schema to support:
- User authentication and profiles
- Plant database with images
- User favorites and care history
- AI chat conversation logs

## ✅ Tasks
- [ ] Create users table with auth integration
- [ ] Create plants table with full details
- [ ] Create plant_images table for multiple images
- [ ] Create user_favorites for saving plants
- [ ] Create care_history for tracking plant care
- [ ] Create chat_messages for AI conversations
- [ ] Setup row-level security (RLS) policies
- [ ] Create indexes for performance

## 📊 Schema Details
See PHASE3_BACKEND.md for complete schema

## 🎯 Acceptance Criteria
- [ ] All tables created and tested
- [ ] RLS policies configured
- [ ] Performance tested (queries < 100ms)
```

---

### Issue: Implement Plant Search API

**Title:** `[backend] Implement plant search API with full-text search`

**Label:** `backend`, `api`, `phase-3`

**Body:**
```
## 📋 Description
Create REST API endpoint for plant search with:
- Full-text search across common and scientific names
- Filtering by plant type
- Pagination support
- Sorted results by relevance

## ✅ Tasks
- [ ] Setup Express route: GET /api/plants/search
- [ ] Implement Supabase full-text search
- [ ] Add query validation and sanitization
- [ ] Implement pagination (limit, offset)
- [ ] Add response caching with 1-hour TTL
- [ ] Add rate limiting (100 req/min)
- [ ] Write integration tests
- [ ] Document endpoint

## 🎯 API Endpoint
\`\`\`
GET /api/plants/search?q=tulsi&type=herb&limit=20&offset=0
\`\`\`

## 📊 Response
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "commonName": "Tulsi",
      "scientificName": "Ocimum sanctum",
      "family": "Lamiaceae",
      "imageUrl": "..."
    }
  ],
  "total": 245,
  "limit": 20,
  "offset": 0
}
\`\`\`

## ⏱️ Estimated Time
4-6 hours
```

---

### Issue: AI Chat Service Integration

**Title:** `[backend] Integrate AI service for plant care chat`

**Label:** `backend`, `ai`, `phase-3`

**Body:**
```
## 📋 Description
Integrate LLM (Claude/GPT) for real-time plant care advice through:
- Chat API endpoint
- Context-aware responses using plant data
- Streaming responses for real-time experience
- Conversation history storage

## ✅ Tasks
- [ ] Setup Claude/OpenAI API client
- [ ] Create POST /api/ai/chat endpoint
- [ ] Implement prompt engineering with plant context
- [ ] Add streaming response support
- [ ] Store conversation history in Supabase
- [ ] Implement rate limiting (50 req/user/day)
- [ ] Add error handling and fallbacks
- [ ] Write tests

## 🎯 Endpoint
\`\`\`
POST /api/ai/chat
Body: { "message": "How often to water tulsi?", "plantId": "optional" }
\`\`\`

## 📊 Response
Streaming JSON chunks with type: "text", "done", or "error"

## ⏱️ Estimated Time
6-8 hours

## 🔗 Resources
- Claude API: https://api.anthropic.com
- Streaming: Server-Sent Events (SSE)
```

---

## Phase 4: Testing & Quality

### Issue: Achieve 70% Test Coverage

**Title:** `[testing] Achieve 70% code coverage across mobile app`

**Label:** `testing`, `quality`, `phase-4`

**Body:**
```
## 📋 Description
Increase unit and widget test coverage to 70% minimum, focusing on:
- Services (auth, plant, AI) - 90% target
- Models and utilities - 80% target
- Widgets - 60% target

## ✅ Coverage Targets
- [ ] AuthService: 90%+ coverage
- [ ] PlantService: 85%+ coverage
- [ ] AIService: 80%+ coverage
- [ ] Plant model: 90%+ coverage
- [ ] Common widgets: 70%+ coverage

## 📊 Current Status
- Current: 20% coverage
- Target: 70% coverage
- Sprint goal: +15% per week

## 🎯 Test Plan
- Week 1: Services (auth, plant)
- Week 2: Services (ai, ui)
- Week 3: Models and utilities
- Week 4: Widgets and integration

## ⏱️ Estimated Time
20-30 hours total

## 📚 Resources
- Flutter Testing: https://flutter.dev/docs/testing
- Coverage: \`flutter test --coverage\`
```

---

### Issue: Performance Optimization

**Title:** `[performance] Optimize app startup time and memory usage`

**Label:** `performance`, `quality`, `phase-4`

**Body:**
```
## 📋 Description
Reduce startup time from 2s to <1s and memory footprint from 100MB to <80MB through:
- Lazy loading
- Image optimization
- Code splitting
- Memory leak fixes

## 📊 Current Metrics
- Startup: 2.0s
- Memory: 100-120MB
- Frame rate: 58fps (target: 60fps)

## 🎯 Target Metrics
- Startup: <1s
- Memory: <80MB baseline
- Frame rate: 60fps consistent

## ✅ Optimization Tasks
- [ ] Profile with DevTools
- [ ] Implement lazy loading for screens
- [ ] Optimize images (compress, cache)
- [ ] Fix any memory leaks
- [ ] Split large screens/features
- [ ] Profile again and measure

## 🛠️ Tools
- Flutter DevTools: \`flutter pub global activate devtools\`
- Memory Profiler: DevTools Memory tab
- Startup Profiler: timeline view

## ⏱️ Estimated Time
8-10 hours
```

---

## Phase 5: Release Preparation

### Issue: Setup CI/CD Pipeline

**Title:** `[devops] Setup GitHub Actions CI/CD pipeline`

**Label:** `devops`, `ci-cd`, `phase-5`

**Body:**
```
## 📋 Description
Create automated CI/CD pipeline using GitHub Actions to:
- Lint and analyze code on every commit
- Run tests automatically
- Build release APKs and IPAs
- Deploy to TestFlight and Play Store

## ✅ Tasks
- [ ] Create Flutter analyze workflow
- [ ] Create test workflow
- [ ] Create Android build workflow
- [ ] Create iOS build workflow
- [ ] Setup secrets for signing keys
- [ ] Setup notifications
- [ ] Document pipeline

## 📊 Workflow Files
- .github/workflows/lint.yml
- .github/workflows/test.yml
- .github/workflows/build-android.yml
- .github/workflows/build-ios.yml

## 🎯 Pipeline Stages
1. Lint (5 min)
2. Test (10 min)
3. Build Android (15 min)
4. Build iOS (20 min)
5. Report results

## ⏱️ Estimated Time
10-15 hours

## 📚 References
- GitHub Actions: https://docs.github.com/actions
- Flutter CI: https://flutter.dev/docs/deployment/cd
```

---

### Issue: App Store Optimization

**Title:** `[release] Prepare app store listings and screenshots`

**Label:** `release`, `marketing`, `phase-5`

**Body:**
```
## 📋 Description
Prepare material for app store launches (Google Play, Apple App Store):
- App icons and screenshots
- Store descriptions
- Keywords and categories
- Privacy policy and terms

## ✅ Tasks
- [ ] Create app icon (multiple sizes)
- [ ] Create 5 promotional screenshots
- [ ] Write compelling app description
- [ ] Choose categories and tags
- [ ] Write privacy policy
- [ ] Write terms of service
- [ ] Setup analytics
- [ ] Test complete flow

## 📊 Store Requirements
**Google Play:**
- Icon: 512x512 PNG
- Screenshots: 1080x1920 (min 2, max 8)
- Description: < 4000 chars

**Apple App Store:**
- Icon: 1024x1024 PNG
- Screenshots: 1170x2532 or 1284x2778
- Description: < 170 chars (short)

## 🎨 Asset Locations
- Icons: assets/app_icon/
- Screenshots: assets/store_screenshots/

## ⏱️ Estimated Time
8-12 hours

## 📚 References
- Google Play: https://play.google.com/console
- Apple App Store: https://appstoreconnect.apple.com
```

---

## Ongoing Issues (Continuous)

### Issue: Fix Performance Regressions

**Title:** `[monitoring] Monitor and fix performance regressions`

**Label:** `performance`, `ongoing`

**Body:**
```
## 📋 Description
Track and fix performance issues as they arise:
- Monitor metrics continuously
- Investigate spikes
- Fix before release

## 📊 Monitored Metrics
- Startup time: Target < 1s
- Memory: Target < 80MB
- Frame rate: Target 60fps
- API latency: Target < 500ms

## ✅ Process
1. Monitor metrics weekly
2. Flag regressions (>10% variance)
3. Create issue if significant
4. Fix in next sprint
5. Verify improvement

## 🔗 Tools
- Crashlytics for crashes
- Firebase Performance for metrics
- DevTools for profiling
```

---

### Issue: Security Audits

**Title:** `[security] Perform regular security audits`

**Label:** `security`, `ongoing`

**Body:**
```
## 📋 Description
Regular security review to ensure:
- No secrets in code
- OWASP compliance
- Updated dependencies
- No known vulnerabilities

## ✅ Monthly Checklist
- [ ] Run `npm audit` and `flutter pub outdated`
- [ ] Review for hardcoded secrets
- [ ] Check API rate limiting
- [ ] Verify SSL/TLS usage
- [ ] Review auth implementation
- [ ] Check data validation
- [ ] Review error messages
- [ ] Update security docs

## 🔍 Tools
- npm audit
- flutter pub outdated
- OWASP Top 10 checklist
- Snyk for dependencies

## 📚 Resources
- OWASP: https://owasp.org
- CWE: https://cwe.mitre.org
```

---

## How to Create These Issues

1. Go to GitHub Issues
2. Click "New Issue"
3. Choose appropriate template
4. Copy body from above
5. Click "Submit new issue"

## Prioritization

**High Priority (Start immediately):**
1. Supabase setup
2. Plant search API
3. CI/CD pipeline
4. Test coverage

**Medium Priority (Next sprint):**
5. AI chat service
6. Performance optimization
7. App store optimization

**Low Priority (Future):**
8. Security audits (ongoing)
9. Performance monitoring (ongoing)

---

**Last Updated:** 2026-05-05
**Next Review:** 2026-06-05
