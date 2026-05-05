# PlantSaathi 🌿

**AI-Powered Plant Identification and Care Assistant**

![Version](https://img.shields.io/badge/version-2.0.0--alpha-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Flutter](https://img.shields.io/badge/flutter-3.19+-blue)
![Dart](https://img.shields.io/badge/dart-3.3+-blue)

PlantSaathi is a comprehensive plant identification and care mobile application built with Flutter and powered by AI. Users can identify plants from photos, receive personalized care recommendations, chat with an AI assistant, and maintain a collection of their favorite plants.

## 🎯 Features

### Core Functionality
- **🔍 Plant Identification** - Identify plants from photos using AI vision
- **🌱 Care Recommendations** - Personalized watering, sunlight, and temperature guidance
- **💬 AI Chat Assistant** - Real-time answers to plant-related questions
- **❤️ Favorites Management** - Save and organize your plants
- **📚 Plant Database** - Browse 1000+ plants with detailed information
- **🌙 Dark Mode** - Full Material 3 dark theme support
- **♿ Accessibility** - WCAG 2.1 AA compliant

### Design & Architecture
- **Material 3 Design** - Modern, clean UI with no unnecessary effects
- **Service-Oriented** - Scalable, testable architecture
- **Type-Safe** - Full null-safety and strong typing
- **Responsive** - Works on phones 360dp-600dp width
- **Offline-Ready** - Local caching and graceful degradation

## 🚀 Quick Start

### Prerequisites
- Flutter 3.19+ ([Install](https://flutter.dev/docs/get-started/install))
- Dart 3.3+ (included with Flutter)
- Node.js 18+ (for backend development)
- Supabase account ([Create](https://supabase.com))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/plant-saathi.git
cd plant-saathi

# 2. Install mobile dependencies
cd mobile
flutter pub get

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run the app
flutter run
```

### For Backend Development

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Set up environment
cp .env.example .env
# Add your Supabase and API keys

# 3. Start development server
npm run dev
```

## 📁 Project Structure

```
plant-saathi/
├── mobile/                           # Flutter app
│   ├── lib/
│   │   ├── core/                    # Core utilities & configuration
│   │   │   ├── theme.dart           # Material 3 theme system
│   │   │   ├── design_tokens.dart   # Design constants
│   │   │   ├── routes.dart          # Navigation routes
│   │   │   └── api_service.dart     # API client
│   │   ├── features/                # Feature screens
│   │   │   ├── auth/                # Login, signup
│   │   │   ├── home/                # Home screen
│   │   │   ├── search/              # Plant search
│   │   │   ├── plant_detail/        # Plant details
│   │   │   ├── ai/                  # AI chat
│   │   │   ├── favorites/           # Favorites list
│   │   │   ├── identify/            # Photo identification
│   │   │   └── profile/             # User profile
│   │   ├── services/                # Business logic
│   │   │   ├── auth_service.dart
│   │   │   ├── plant_service.dart
│   │   │   └── ai_service.dart
│   │   ├── widgets/                 # Reusable components
│   │   ├── models/                  # Data models
│   │   └── main.dart                # App entry point
│   ├── test/                        # Unit & widget tests
│   ├── pubspec.yaml                 # Dependencies
│   └── README.md                    # Mobile app docs
├── backend/                         # Node.js backend
│   ├── src/
│   │   ├── routes/                  # API endpoints
│   │   ├── services/                # Business logic
│   │   ├── integrations/            # External APIs
│   │   ├── middleware/              # Express middleware
│   │   └── index.js                 # Server entry
│   ├── package.json
│   └── README.md                    # Backend docs
├── docs/                            # Documentation
│   ├── DESIGN_SYSTEM.md
│   ├── API_SPEC.md
│   └── ARCHITECTURE.md
├── .github/
│   ├── workflows/                   # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/              # Issue templates
│   └── pull_request_template.md
├── PHASE2_DESIGN_SYSTEM.md          # Design system details
├── PHASE2_COMPLETION.md             # Phase 2 status
└── README.md                        # This file
```

## 🏗️ Architecture

### Client Architecture (Flutter)
```
┌─────────────────────────────────────┐
│      UI Layer (Screens)             │
│  (login, search, plant_detail...)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Service Layer                    │
│  (auth, plant, ai services)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   API Client (Supabase + Custom)    │
│    (REST calls, auth tokens)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     External Services               │
│  (Backend API, Vision AI, etc)      │
└─────────────────────────────────────┘
```

### Backend Architecture
- **Express.js** - HTTP server and routing
- **Supabase** - Auth, database, file storage
- **External APIs** - Plant Vision AI, LLM integration
- **Middleware** - Error handling, rate limiting, logging

## 🎨 Design System

PlantSaathi uses **Material Design 3** for a modern, professional appearance.

### Spacing Scale
- `xs`: 4dp
- `sm`: 8dp
- `md`: 12dp
- `lg`: 16dp
- `xl`: 24dp

### Border Radius
- `sm`: 8dp (icons, small elements)
- `md`: 12dp (cards, inputs, buttons)
- `lg`: 16dp (dialogs, large containers)
- `full`: 999dp (pills, avatars)

### Typography
- **4 Font Weights Only**: Regular (w400), Medium (w500), Semibold (w600), Bold (w700)
- **Semantic Sizes**: titleLarge, titleMedium, titleSmall, bodyLarge, bodyMedium, bodySmall, labelLarge, labelSmall

### Color Palette
- **Primary**: `#4CAF50` (Plant green)
- **Secondary**: `#E0B95B` (Warm gold)
- **Error**: `#E57373` (Material red)
- **Surface**: Auto-generated from seed color

See [PHASE2_DESIGN_SYSTEM.md](./PHASE2_DESIGN_SYSTEM.md) for complete design guidelines.

## 🧪 Testing

### Run Tests
```bash
cd mobile
flutter test                    # All tests
flutter test --coverage        # With coverage report
flutter test -v                # Verbose output
```

### Test Categories
- **Unit Tests**: Services, models, utilities
- **Widget Tests**: Individual components
- **Integration Tests**: End-to-end user flows

### Coverage Goals
- Target: 70%+ coverage
- Critical paths (auth, search): 90%+

## 📦 Building for Production

### Android
```bash
cd mobile
flutter build apk --release
flutter build appbundle --release    # For Play Store
```

### iOS
```bash
cd mobile
flutter build ios --release
# Follow Xcode instructions for archiving
```

### Backend
```bash
cd backend
npm run build
npm start
```

## 🔐 Security

- **SSL/TLS** - All API communications encrypted
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Protect against abuse
- **Input Validation** - Sanitize all user inputs
- **No Secrets in Code** - Use environment variables
- **OWASP Compliance** - Follows security best practices

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contributing Steps
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Dart**: Follow [Effective Dart](https://dart.dev/guides/language/effective-dart)
- **Flutter**: Use [Flutter best practices](https://flutter.dev/docs/testing/best-practices)
- **JavaScript**: Airbnb style (enforced by ESLint)

### Commit Messages
Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code restructuring
- `test:` Test additions/changes
- `chore:` Build, deps, tooling

## 📚 Documentation

- [Mobile App README](./mobile/README.md) - Flutter-specific docs
- [Backend README](./backend/README.md) - Node.js backend docs
- [API Specification](./docs/API_SPEC.md) - REST API endpoints
- [Architecture Guide](./docs/ARCHITECTURE.md) - System design
- [Phase 2 Design System](./PHASE2_DESIGN_SYSTEM.md) - Material 3 details

## 🐛 Reporting Issues

Found a bug? Please open an issue using our templates:
- [Bug Report](https://github.com/yourusername/plant-saathi/issues/new?template=BUG_REPORT.md)
- [Feature Request](https://github.com/yourusername/plant-saathi/issues/new?template=FEATURE_REQUEST.md)

### Bug Report Checklist
- ✅ Searched existing issues first
- ✅ Provided clear reproduction steps
- ✅ Included device/OS information
- ✅ Attached screenshots/logs if possible

## 📊 Project Status

| Component | Status | Version |
|-----------|--------|---------|
| **Core Features** | ✅ In Progress | 2.0.0-alpha |
| **Material 3 Design** | ✅ Complete | 2.0.0 |
| **Dark Mode** | ✅ Complete | 2.0.0 |
| **Testing** | 🔄 In Progress | - |
| **Backend API** | 🔄 In Progress | 1.0.0 |
| **iOS Build** | ⏳ Planned | 2.0.0 |
| **Android Release** | ⏳ Planned | 2.0.0 |

## 🗺️ Roadmap

### Phase 2: Design System (Current)
- ✅ Material 3 implementation
- ✅ Dark mode support
- 🔄 Quality assurance

### Phase 3: Backend Integration
- AI model integration
- Supabase setup
- API optimization

### Phase 4: Testing & Quality
- Unit/widget test coverage
- Performance optimization
- Security audit

### Phase 5: Release Preparation
- App store optimization
- Beta testing
- Marketing materials

## 📈 Performance

- **App Size**: < 50MB
- **Startup Time**: < 2s
- **Search Response**: < 500ms
- **Dark Mode**: 60fps animations
- **Memory**: < 100MB baseline

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Material Design team for design guidelines
- Flutter community for excellent documentation
- Supabase for backend services
- All our contributors

## 📞 Support

- 📧 Email: support@plantsaathi.dev
- 💬 Discord: [Join our community](https://discord.gg/plantsaathi)
- 🐦 Twitter: [@PlantSaathi](https://twitter.com/plantsaathi)
- 📝 Issues: [GitHub Issues](https://github.com/yourusername/plant-saathi/issues)

---

**Made with ❤️ for plant lovers everywhere**
