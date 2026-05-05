import 'package:flutter/material.dart';

/// Spacing tokens (dp scale: 4/8/12/16/24)
class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
}

/// Corner radius tokens (Material 3 compliant)
class AppRadius {
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double full = 999;
}

/// Typography sizes (sp - scale-independent pixels)
class AppTypography {
  // Sizes
  static const double headlineSmall = 24;
  static const double titleLarge = 20;
  static const double titleMedium = 18;
  static const double titleSmall = 16;
  static const double bodyLarge = 16;
  static const double bodyMedium = 14;
  static const double bodySmall = 12;
  static const double labelMedium = 14;
  static const double labelSmall = 12;

  // Font weights
  static const FontWeight regular = FontWeight.w400;
  static const FontWeight medium = FontWeight.w500;
  static const FontWeight semibold = FontWeight.w600;
  static const FontWeight bold = FontWeight.w700;

  // Line height multiplier for readability
  static const double lineHeight = 1.5;
}

/// Elevation/shadow constants
class AppElevation {
  static const double none = 0;
  static const double level1 = 1;
  static const double level2 = 2;
  static const double level3 = 4;
}

/// Duration tokens for animations
class AppDuration {
  static const Duration shortest = Duration(milliseconds: 50);
  static const Duration short = Duration(milliseconds: 100);
  static const Duration medium = Duration(milliseconds: 200);
  static const Duration standard = Duration(milliseconds: 300);
  static const Duration long = Duration(milliseconds: 500);
}

/// Min touch target size (Material Design spec)
class AppTouchTarget {
  static const double minSize = 48;
}
