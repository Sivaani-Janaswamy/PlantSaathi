# Contributing to PlantSaathi

Thank you for your interest in contributing to PlantSaathi! We're excited to work with you. This document provides guidelines and instructions for contributing to the project.

## 🎯 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct to help us maintain a respectful environment.

### Expected Behavior
- Be respectful and inclusive
- Welcome diverse perspectives and experiences
- Focus on constructive criticism
- Help others and ask for help when needed

### Unacceptable Behavior
- Harassment, discrimination, or unwelcome behavior
- Abuse, threats, or hostile communication
- Posting inappropriate content
- Plagiarism or deliberate misinformation

## 🚀 Getting Started

### Prerequisites
- **Flutter** 3.19+ ([Install](https://flutter.dev/docs/get-started/install))
- **Dart** 3.3+ (included with Flutter)
- **Node.js** 18+ (for backend contributions)
- **Git** ([Install](https://git-scm.com/))
- A GitHub account

### Development Setup

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/plant-saathi.git
   cd plant-saathi
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/plant-saathi.git
   ```

4. **Create Development Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Set Up Mobile Development**
   ```bash
   cd mobile
   flutter pub get
   flutter pub get --upgrade    # For latest packages
   ```

6. **Set Up Backend Development** (if needed)
   ```bash
   cd ../backend
   npm install
   cp .env.example .env
   # Edit .env with credentials
   npm run dev
   ```

## 📋 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/issue-number
# or
git checkout -b docs/update-readme
```

**Branch Naming Convention:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code improvements
- `test/description` - Test additions

### 2. Make Your Changes

**For Flutter:**
- Follow [Effective Dart](https://dart.dev/guides/language/effective-dart)
- Use design tokens from `lib/core/design_tokens.dart`
- Keep files < 400 lines (split large files)
- Use meaningful variable names

**For Backend:**
- Follow Airbnb JavaScript style guide
- Use async/await for asynchronous code
- Add JSDoc comments for functions
- Keep routes in separate files

### 3. Code Quality

**Run Linters:**
```bash
# Flutter
cd mobile
flutter analyze                 # Check for issues
dart fix --apply               # Auto-fix issues
flutter format lib/            # Format code

# Backend
cd backend
npm run lint                   # ESLint check
npm run lint:fix              # Auto-fix issues
```

**Format Code:**
```bash
# Flutter - automatic on save (VS Code)
# Or manually:
cd mobile
flutter format lib/ test/

# Backend
cd backend
npx prettier --write src/
```

### 4. Write Tests

**Flutter:**
```bash
# Create test file: lib/features/myfeature/myfeature_test.dart
flutter test lib/features/myfeature/myfeature_test.dart

# Run all tests
flutter test --coverage
```

**Backend:**
```bash
# Create test file: src/__tests__/endpoint.test.js
npm test

# With coverage
npm run test:coverage
```

### 5. Commit Changes

**Conventional Commits:**
```bash
git commit -m "feat: add plant identification feature"
git commit -m "fix: resolve search timeout issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify plant service"
git commit -m "test: add unit tests for auth"
```

**Good Commit Message:**
- Start with type: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Use imperative mood: "add" not "added" or "adds"
- Keep first line < 50 characters
- Reference issues: "fixes #123"

**Bad Commits to Avoid:**
```
❌ "update"
❌ "fix bugs"
❌ "change stuff"
❌ "WIP"
✅ "feat: add dark mode support"
✅ "fix: resolve memory leak in search"
```

### 6. Push & Open Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# - Write clear title and description
# - Reference related issues
# - Add before/after screenshots (if UI changes)
```

## 📝 Pull Request Guidelines

### PR Title Format
```
[Type] Short description (under 60 chars)

Examples:
✅ [feat] Add dark mode support
✅ [fix] Resolve search timeout
✅ [docs] Update API spec
✅ [refactor] Simplify auth flow
```

### PR Description Template

```markdown
## Description
Brief explanation of changes.

## Related Issues
Fixes #123
Relates to #456

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No new warnings in `flutter analyze`

## Screenshots (if applicable)
Before | After
--- | ---
[Screenshot] | [Screenshot]

## Checklist
- [ ] Code follows style guidelines
- [ ] No analyzer warnings
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No unrelated changes
```

### What We Look For

✅ **Good PRs:**
- Clear, focused change
- Includes tests
- Updates documentation
- Clean commit history
- Follows style guides

❌ **Issues That Block Approval:**
- Large, unfocused changes
- Missing tests
- Analyzer warnings
- Outdated documentation
- Unsafe code patterns

## 🏆 Contribution Types

### Code Contributions
- **Bug Fixes** - Find and fix issues
- **Features** - Add new functionality
- **Performance** - Optimize code/UI
- **Refactoring** - Improve code quality

### Documentation
- README improvements
- API documentation
- Architecture guides
- Tutorials and examples

### Testing
- Unit tests
- Widget tests
- Integration tests
- Test improvements

### Community
- Help with issues
- Answer questions
- Share feedback
- Report bugs

## 🐛 Found a Bug?

### Before Reporting
- Check existing issues (open and closed)
- Try latest code (`git pull upstream master`)
- Reproduce with minimal example

### Report Template
```markdown
## Bug Description
Clear explanation of the bug.

## Reproduction Steps
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Environment
- Device: iPhone 14 Pro / Samsung S23
- OS: iOS 17.2 / Android 14
- Flutter Version: 3.19.0
- App Version: 2.0.0-alpha

## Logs
```
[Paste error logs or stack trace]
```

## Screenshots
[If applicable, attach screenshots]
```

## 🎓 Learning Resources

- **Flutter**: [Official Documentation](https://flutter.dev)
- **Dart**: [Language Guide](https://dart.dev/guides)
- **Material 3**: [Design System](https://m3.material.io/)
- **Node.js**: [Official Guide](https://nodejs.org/docs/)
- **Git**: [Pro Git Book](https://git-scm.com/book/)

## 📊 Project Structure

```
plant-saathi/
├── mobile/                    # Flutter app
│   ├── lib/
│   │   ├── core/             # Configuration
│   │   ├── features/         # Feature screens
│   │   ├── services/         # Business logic
│   │   ├── widgets/          # Reusable components
│   │   └── models/           # Data models
│   └── test/                 # Tests
├── backend/                  # Node.js server
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   └── tests/
└── docs/                     # Documentation
```

## ✨ Before You Submit

### Checklist
- [ ] Branch is up-to-date with `upstream/master`
- [ ] Followed code style guidelines
- [ ] No analyzer warnings (`flutter analyze`)
- [ ] Added/updated tests
- [ ] All tests pass (`flutter test`)
- [ ] Updated documentation
- [ ] No unrelated changes
- [ ] Commit messages are clear

### Before Commit
```bash
# Flutter
flutter analyze
flutter test --coverage
flutter format lib/

# Backend
npm run lint:fix
npm test
npx prettier --write src/
```

## 🔄 Review Process

1. **CI Checks** - Automated tests run
2. **Code Review** - Maintainers review code
3. **Feedback** - We may request changes
4. **Approval** - Approved by 1+ maintainers
5. **Merge** - Code is merged to main

### Review Timeline
- Response within 48 hours
- Updates expected within 7 days
- Stale PRs closed after 30 days

## 📚 Style Guides

### Flutter/Dart
```dart
// ✅ Good
class PlantService {
  final ApiClient _apiClient;
  
  const PlantService(this._apiClient);
  
  Future<List<Plant>> searchPlants(String query) async {
    final response = await _apiClient.get('/plants/search', {'q': query});
    return (response as List).map((p) => Plant.fromJson(p)).toList();
  }
}

// ❌ Bad
class plantService{
  var api;
  
  searchPlants(q){
    return api.get('/plants/search?q=' + q);
  }
}
```

### JavaScript/Backend
```javascript
// ✅ Good
const searchPlants = async (req, res) => {
  try {
    const { query } = req.query;
    const plants = await PlantService.search(query);
    res.json({ success: true, data: plants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Bad
function searchPlants(req, res) {
  PlantService.search(req.query.query)
    .then(plants => res.json(plants))
    .catch(e => res.json(e));
}
```

## ❓ Questions?

- 📖 Check our [Documentation](./docs/)
- 💬 Open a Discussion on GitHub
- 📧 Email: dev@plantsaathi.dev
- 🐦 Tweet: [@PlantSaathi](https://twitter.com/plantsaathi)

## 🙏 Thank You!

Your contributions make PlantSaathi better for everyone. We appreciate your effort and look forward to working with you!

---

**Last Updated:** 2026-05-05
**Maintained by:** PlantSaathi Team
