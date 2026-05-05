# Phase 2: Professional Design System

**Focus:** Clean Material 3 implementation. Production-worthy. Zero fluff.

**Anti-patterns to AVOID:**
- ❌ Glassmorphism, blur effects
- ❌ Gratuitous animations (fade-in every item)
- ❌ Over-rounded corners (no 20+ radius unless Material 3 spec)
- ❌ Neon/vibrant colors
- ❌ Drop shadows everywhere
- ❌ Parallax, floating action buttons with halos
- ❌ Skeleton loaders (use actual shimmer if needed)

---

## Color Palette

**Primary:** `#4CAF50` (Green, plant-appropriate)
**Secondary:** `#E0B95B` (Gold accent)
**Error:** `#E57373` (Red, clear warnings)
**Surface:** `#F5F7F4` (Soft background)
**Text:** `#222831` (Dark gray, not pure black for eye comfort)

**Material 3 Derived:**
- `colorScheme.primary` → Actions, key UI
- `colorScheme.secondary` → Secondary actions, subtle highlights
- `colorScheme.surface` → Cards, containers
- `colorScheme.background` → Page background
- `colorScheme.outline` → Dividers, borders

---

## Typography

**Hierarchy (NO font family switches, use weight only):**

| Use Case | Size | Weight | Example |
|----------|------|--------|---------|
| Page title / AppBar | 22-24sp | bold (w700) | "Search Plants" |
| Section heading | 18sp | semibold (w600) | "Plant Details" |
| Card title | 16sp | semibold (w600) | Plant name in results |
| Body text (large) | 16sp | regular (w400) | Description text |
| Body text (normal) | 14sp | regular (w400) | Plant care info |
| Label / caption | 12sp | medium (w500) | Tab labels, hints |
| Error/helper text | 12sp | regular (w400) | Validation messages |

**Line Height:** Always `1.5x` font size for readability

---

## Spacing Scale

Use consistent spacing (dp = device pixels):

```
xs:  4dp   (minimal gaps)
sm:  8dp   (between items in list)
md: 12dp   (standard padding inside containers)
lg: 16dp   (between sections)
xl: 24dp   (large gaps, page margins)
```

**Examples:**
- Card padding: `lg` (16dp)
- List item spacing: `md` (12dp)
- Page margin: `xl` (24dp)
- Icon-to-text gap: `md` (12dp)

---

## Components & Patterns

### AppBar
- **Height:** 56dp (Material 3 standard)
- **Title:** Center-aligned, bold
- **Background:** Same as scaffold background (typically white)
- **Elevation:** 0 (flat design)
- **Actions:** Icon buttons only (no text)
- **Icon size:** 24dp

### Buttons

**Primary Action (Filled Button):**
- Full width on mobile
- Padding: vertical 12dp, horizontal 24dp
- Corner radius: 12dp (Material 3 spec)
- Elevation: 0 (no shadow)
- Label weight: w600

**Secondary Action (Outlined Button):**
- Border: 1dp, primary color outline
- No background fill
- Same padding/radius as primary

**Text Button:**
- No background, no border
- Primary color text
- Used for cancel, back, low-priority actions

### Cards

**Structure:**
```
Padding (lg) → Content
```

- **Elevation:** 1dp or none (flat Material 3)
- **Border radius:** 12dp
- **Padding:** 16dp (lg)
- **Shadow:** Minimal or none
- **Background:** White or surface color

### Lists

**Item spacing:** 8dp (sm) between items
**Item padding:** 12dp (md) horizontal, 8dp vertical
**Text baseline alignment:** Always aligned left

**Pattern:**
```
[Icon 24dp] [Gap: 12dp] [Text content] [Optional: trailing icon]
```

### Input Fields

- **Height:** 48-56dp
- **Border radius:** 12dp
- **Padding:** 12dp horizontal, 14dp vertical
- **Border:** 1dp, outline color
- **Focus state:** Border thickness 2dp, primary color

### Chips / Tags

- **Height:** 32-36dp
- **Padding:** 12dp horizontal, 8dp vertical
- **Border radius:** 8dp
- **Background:** Surface/tertiary color
- **Text:** 12sp, regular weight

---

## Animation Guidelines

**Use ONLY for:**
1. ✅ Loading states (subtle spinner, no pulsing)
2. ✅ Page transitions (200-300ms slide/fade)
3. ✅ Button feedback (50-100ms ripple on tap)
4. ✅ Error slide-in (150ms, from top)

**NEVER:**
- ❌ Animate every list item entrance
- ❌ Bounce/scale effects on tap
- ❌ Parallax scrolling
- ❌ Staggered animations

**Recommended curves:** `Curves.easeInOut`, `Curves.easeOut` (natural motion)

---

## Responsive Breakpoints

**Mobile-first design (primary target: 360-480dp width)**

| Screen Size | Min Width | Max Width | Action |
|------------|-----------|-----------|--------|
| Small phone | 360dp | 480dp | Single column, full width buttons |
| Large phone | 480dp | 600dp | Can use 2-column for some content |
| Tablet | 600dp+ | 1200dp | 2-3 column, more spacing |

---

## State Indicators

**Visual hierarchy for states:**

| State | Indicator | Example |
|-------|-----------|---------|
| Enabled | Normal color, interactive cursor | Button appears clickable |
| Disabled | 50% opacity, no cursor | Greyed out |
| Loading | Spinner (16dp), text hidden | "Loading..." → spinner only |
| Error | Error color (red), icon + message | "⚠ Network error" |
| Success | Success color (green), brief toast | "✓ Saved" |

---

## Dark Mode (Future Phase)

**When implemented:**
- Invert background (`#1A1A1A` instead of white)
- Keep text legible (minimum 4.5:1 contrast ratio)
- Reduce elevation shadows (use outline borders instead)
- Same spacing/typography rules apply

---

## Accessibility Standards

**WCAG 2.1 AA compliance:**
- **Color contrast:** Minimum 4.5:1 for text, 3:1 for graphics
- **Touch targets:** Minimum 48dp x 48dp (buttons, tap areas)
- **Text size:** Minimum 12sp for body text
- **Semantic labels:** All icons have `tooltip` or `semanticLabel`
- **Focus order:** Logical tab order through interactive elements

---

## Component Audit Checklist

Before deploying Phase 2, verify each component:

- [ ] **AppBar:** 56dp height, no elevation, icon 24dp
- [ ] **Buttons:** Proper corner radius (12dp), consistent padding
- [ ] **Cards:** 12dp radius, 16dp padding, minimal shadow
- [ ] **Lists:** 8dp item spacing, 12dp padding between icon/text
- [ ] **Inputs:** 48dp height, 12dp border radius, 1dp border
- [ ] **Text:** Proper weight hierarchy (w400/w600/w700 only)
- [ ] **Spacing:** Consistent use of 4/8/12/16/24 scale
- [ ] **Colors:** Only primary, secondary, surface, error, outline
- [ ] **Animations:** None on entrance, only on interaction/loading
- [ ] **Dark mode:** Text contrast verified in all light/dark states

---

## Implementation Strategy

**Phase 2A (Days 1-2): Theme & Tokens**
1. Update `theme.dart` with Material 3 tokens
2. Define `ColorTokens`, `SpacingTokens`, `TypographyTokens` classes
3. Apply to all standard Material components

**Phase 2B (Days 2-3): Component Audit**
1. Review all custom widgets
2. Replace Material 2 patterns with Material 3
3. Standardize corner radius, padding, elevation

**Phase 2C (Days 3-4): Screen Polish**
1. Apply spacing scale to all screens
2. Audit typography hierarchy
3. Verify accessibility contrast
4. Remove unnecessary shadows/effects

**Phase 2D (Days 4-5): Dark Mode**
1. Create `darkTheme` in `theme.dart`
2. Test on OLED/dark devices
3. Verify contrast in all states

---

## Files to Modify

**Core:**
- `lib/core/theme.dart` — Upgrade to Material 3 tokens

**Widgets (all custom widgets need review):**
- `lib/widgets/primary_action_button.dart`
- `lib/widgets/app_section_header.dart`
- `lib/widgets/empty_state_card.dart`
- `lib/widgets/error_state_card.dart`
- `lib/widgets/loading_widget.dart`
- `lib/widgets/skeleton_loader.dart`

**Screens (all need spacing/typography audit):**
- `lib/features/auth/login_screen.dart`
- `lib/features/auth/signup_screen.dart`
- `lib/features/search/search_screen.dart`
- `lib/features/plant_detail/plant_detail_screen.dart`
- `lib/features/identify/identify_screen.dart`
- `lib/features/ai/ai_screen.dart`
- `lib/features/favorites/favorites_screen.dart`
- `lib/features/recommendations/recommendations_screen.dart`
- `lib/features/profile/profile_screen.dart`

---

## Success Criteria

✅ When Phase 2 is done:
- [ ] Material 3 applied consistently (no Material 2 patterns)
- [ ] Spacing scale respected everywhere (4/8/12/16/24 only)
- [ ] Typography hierarchy clear and scannable
- [ ] No gratuitous animations or effects
- [ ] Dark mode working and accessible
- [ ] All buttons 48dp+ minimum
- [ ] Text contrast ≥ 4.5:1
- [ ] App looks "mature" and "professional"
- [ ] No analyzer warnings
- [ ] Responsive on 360-600dp screens

---

## References

- [Material Design 3 Spec](https://m3.material.io/)
- [Flutter Material 3](https://flutter.dev/docs/release/breaking-changes/material-3-migration)
- [WCAG 2.1 AA Standards](https://www.w3.org/WAI/WCAG21/quickref/)
