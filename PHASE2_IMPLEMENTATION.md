# Phase 2: Implementation Plan (Professional Design)

**Objective:** Clean Material 3 UI, production-ready, zero unnecessary effects

**Timeline:** 4-5 days | **Focus:** Substance over flash

---

## 2A: Theme & Design Tokens (Day 1)

### Task 2A.1: Upgrade theme.dart to Material 3

**File:** `mobile/lib/core/theme.dart`

**Changes:**
- ✅ Already using `useMaterial3: true` (good base)
- Update `inputDecorationTheme` to Material 3 specs (12dp radius, not 16)
- Remove unnecessary elevation/shadow customizations
- Define semantic colors via `ColorScheme` (don't override manually)

**Before:**
```dart
inputDecorationTheme: InputDecorationTheme(
  border: OutlineInputBorder(
    borderRadius: BorderRadius.circular(16),  // Too rounded
  ),
  elevation: 0,
),
```

**After:**
```dart
inputDecorationTheme: InputDecorationTheme(
  border: OutlineInputBorder(
    borderRadius: BorderRadius.circular(12),  // Material 3
    borderSide: const BorderSide(width: 1),
  ),
  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
  isDense: true,
),
```

### Task 2A.2: Create theme constants file

**File:** `mobile/lib/core/design_tokens.dart` (NEW)

**Content:**
```dart
class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
}

class AppRadius {
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double full = 999;
}

class AppTypography {
  // Sizes (sp - scale-independent pixels)
  static const double titleLarge = 24;
  static const double titleMedium = 20;
  static const double titleSmall = 16;
  static const double bodyLarge = 16;
  static const double bodyMedium = 14;
  static const double bodySmall = 12;
  static const double labelLarge = 14;
  static const double labelSmall = 12;
  
  // Weights
  static const FontWeight regular = FontWeight.w400;
  static const FontWeight medium = FontWeight.w500;
  static const FontWeight semibold = FontWeight.w600;
  static const FontWeight bold = FontWeight.w700;
}
```

**Import in theme.dart:**
```dart
import 'design_tokens.dart';
```

---

## 2B: Widget Audit & Updates (Days 1-2)

### Task 2B.1: primary_action_button.dart

**Current issues:**
- Corner radius: 18dp (should be 12dp Material 3)
- Padding: 16dp vertical (✓ good)
- Elevation: 0 (✓ good)

**Changes:**
```dart
shape: RoundedRectangleBorder(
  borderRadius: BorderRadius.circular(AppRadius.md),  // 12dp
),
padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),  // 12dp
```

### Task 2B.2: Card styling audit

**Check all cards for:**
- ✅ Radius: 12dp (not 20dp)
- ✅ Padding: 16dp (lg)
- ✅ Elevation: 1dp (not 0.5)
- ✅ Margin: symmetric 8dp/16dp (ok)

**Files to check:**
- `widgets/empty_state_card.dart`
- `widgets/error_state_card.dart`
- All screens using Card widget

### Task 2B.3: Input field styling

**Update all TextFormField/TextField:**
```dart
InputDecoration(
  border: OutlineInputBorder(
    borderRadius: BorderRadius.circular(AppRadius.md),  // 12dp
    borderSide: const BorderSide(width: 1),
  ),
  contentPadding: const EdgeInsets.symmetric(
    horizontal: AppSpacing.lg,
    vertical: AppSpacing.md,
  ),
)
```

---

## 2C: Spacing & Typography Audit (Days 2-3)

### Task 2C.1: Login/Signup screens

**Audit:**
- [ ] Spacing between form fields: should be `AppSpacing.lg` (16dp)
- [ ] Button width: full width
- [ ] Padding: `xl` (24dp) on all sides
- [ ] Text style: use `theme.textTheme.bodyMedium` (14sp)

### Task 2C.2: Search results screen

**Audit:**
- [ ] List item spacing: `AppSpacing.sm` (8dp) between items
- [ ] Card padding: `AppSpacing.lg` (16dp)
- [ ] Title weight: w600 (semibold)
- [ ] Body weight: w400 (regular)

### Task 2C.3: Plant detail screen

**Audit:**
- [ ] Section titles: 18sp, w600
- [ ] Plant name: 20sp, w700
- [ ] Description: 14sp, w400, line height 1.5
- [ ] All paddings: consistent `lg`/`xl`

### Task 2C.4: AI chat screen

**Audit:**
- [ ] Message bubble padding: `AppSpacing.md` (12dp)
- [ ] Gap between bubbles: `AppSpacing.sm` (8dp)
- [ ] Input field: 48-56dp height minimum
- [ ] Send button: icon 24dp

### Task 2C.5: Favorites & Recommendations

**Audit:**
- [ ] Empty state: centered, 14sp text
- [ ] List items: consistent with search results
- [ ] Delete/save buttons: icon buttons, 48dp minimum

---

## 2D: Dark Mode Implementation (Days 3-4)

### Task 2D.1: Create darkTheme in theme.dart

**Add after existing theme:**
```dart
final ThemeData darkTheme = ThemeData(
  useMaterial3: true,
  brightness: Brightness.dark,
  colorScheme: ColorScheme.fromSeed(
    seedColor: _plantPrimary,
    brightness: Brightness.dark,
    surface: const Color(0xFF1A1A1A),
    background: const Color(0xFF0F0F0F),
    primary: _plantPrimary,
    secondary: const Color(0xFFE0B95B),
    error: const Color(0xFFE57373),
  ),
  // ... rest of theme config
);
```

### Task 2D.2: Update main.dart

**Add dark theme to MaterialApp:**
```dart
MaterialApp(
  theme: appTheme,
  darkTheme: darkTheme,
  themeMode: ThemeMode.system,  // Follow device setting
  // ...
)
```

### Task 2D.3: Test dark mode

- [ ] Run on device/emulator in dark mode
- [ ] Check text contrast (≥4.5:1)
- [ ] Verify all colors are readable
- [ ] Check AppBar, cards, buttons, inputs

---

## 2E: Final Polish & QA (Days 4-5)

### Task 2E.1: Flutter analyze

```bash
flutter analyze
```

Fix all warnings:
- [ ] Unused imports
- [ ] Missing semantics
- [ ] Lint violations

### Task 2E.2: Responsive testing

Test on:
- [ ] Small phone (360dp)
- [ ] Medium phone (480dp)
- [ ] Large phone (600dp)

Verify:
- [ ] No text overflow
- [ ] Buttons 48dp+ tap targets
- [ ] Spacing proportional

### Task 2E.3: Accessibility audit

- [ ] All buttons have labels
- [ ] Icons have semantic labels
- [ ] Text contrast ≥4.5:1 (light & dark)
- [ ] Focus order logical
- [ ] No color-only indicators

### Task 2E.4: Screenshot comparison

Before/After screenshots for:
- Login screen
- Search results
- Plant detail
- AI chat
- Favorites

---

## 2F: Optional Enhancements (if time)

### Task 2F.1: Pull-to-refresh

Add `RefreshIndicator` to:
- Search results
- Favorites
- Recommendations

### Task 2F.2: Haptic feedback

Add vibration on:
- Button taps (light)
- Favorite save/unsave (medium)
- Swipe gestures (light)

### Task 2F.3: Transitions

Enhance page transitions:
- Search → Plant detail: Slide + Fade (300ms)
- Error notifications: Slide from top (150ms)

---

## Success Criteria Checklist

**Design:**
- [ ] No Material 2 patterns remaining
- [ ] All radii: 8dp, 12dp, 16dp, or 999dp only
- [ ] All spacing: 4, 8, 12, 16, 24dp only
- [ ] Typography: 4 weights max (w400, w500, w600, w700)
- [ ] No glass effects, blurs, or gratuitous shadows

**Functionality:**
- [ ] Dark mode working
- [ ] All buttons 48dp+ minimum
- [ ] Text contrast ≥4.5:1 (light & dark)
- [ ] No analyzer warnings
- [ ] Responsive on 360-600dp

**Polish:**
- [ ] Consistent spacing throughout
- [ ] Clear visual hierarchy
- [ ] Professional appearance
- [ ] Looks like a "real" app

---

## Estimated Time Breakdown

- **2A (Tokens):** 2-3 hours
- **2B (Widgets):** 3-4 hours
- **2C (Screens):** 4-5 hours
- **2D (Dark mode):** 2-3 hours
- **2E (QA):** 2-3 hours
- **2F (Optional):** 2-3 hours

**Total:** 15-21 hours (fit into 4-5 days at 4-5 hrs/day)

---

## Files to Update (Priority Order)

**Tier 1 (Core):**
1. `lib/core/theme.dart` — Complete redesign
2. `lib/core/design_tokens.dart` — NEW
3. `lib/widgets/primary_action_button.dart` — Update radius
4. All Card uses — Standardize radius/padding

**Tier 2 (Screens):**
5. `lib/features/auth/login_screen.dart`
6. `lib/features/auth/signup_screen.dart`
7. `lib/features/search/search_screen.dart`
8. `lib/features/plant_detail/plant_detail_screen.dart`

**Tier 3 (Remaining):**
9. All other feature screens
10. All remaining widgets

---

## Git Strategy

**Create branches:**
- `feature/material3-theme` (theme changes)
- `feature/spacing-audit` (spacing scale)
- `feature/dark-mode` (dark theme)
- `refactor/typography` (text styles)

Merge to master after each tier is tested.

---

## Notes

- **Constraint:** No Material 2 patterns after this phase
- **Target:** App should look "mature" and "professional"
- **Testing:** Always test on actual devices (emulator can be deceiving)
- **Accessibility:** WCAG 2.1 AA compliance required
