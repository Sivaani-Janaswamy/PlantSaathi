import 'package:flutter/material.dart';
import 'design_tokens.dart';

// Light theme colors
const Color _plantPrimary = Color(0xFF4CAF50);
const Color _plantSecondary = Color(0xFFE0B95B);
const Color _plantError = Color(0xFFE57373);
const Color _plantSurface = Color(0xFFF5F7F4);
const Color _plantText = Color(0xFF222831);
const Color _plantTextSecondary = Color(0xFF666666);

// Dark theme colors
const Color _darkSurface = Color(0xFF1A1A1A);
const Color _darkBackground = Color(0xFF0F0F0F);
const Color _darkText = Color(0xFFFAFAFA);

/// Light theme - Material 3 compliant
final ThemeData appTheme = ThemeData(
  useMaterial3: true,
  brightness: Brightness.light,
  colorScheme: ColorScheme.fromSeed(
    seedColor: _plantPrimary,
    brightness: Brightness.light,
    surface: Colors.white,
    background: _plantSurface,
    primary: _plantPrimary,
    secondary: _plantSecondary,
    error: _plantError,
  ),
  scaffoldBackgroundColor: _plantSurface,

  // AppBar - clean and simple
  appBarTheme: AppBarTheme(
    backgroundColor: Colors.white,
    surfaceTintColor: Colors.transparent,
    elevation: AppElevation.none,
    iconTheme: const IconThemeData(color: _plantPrimary, size: 24),
    titleTextStyle: TextStyle(
      color: _plantPrimary,
      fontWeight: AppTypography.bold,
      fontSize: AppTypography.titleMedium,
    ),
    centerTitle: true,
  ),

  // Cards - Material 3 spec (12dp radius, 1dp elevation)
  cardTheme: CardThemeData(
    color: Colors.white,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
    ),
    elevation: AppElevation.level1,
    margin: const EdgeInsets.symmetric(
      vertical: AppSpacing.sm,
      horizontal: AppSpacing.lg,
    ),
  ),

  // Input fields - Material 3 compliant
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
      borderSide: const BorderSide(width: 1),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
      borderSide: const BorderSide(width: 1, color: Color(0xFFCCCCCC)),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
      borderSide: const BorderSide(width: 2, color: _plantPrimary),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
      borderSide: const BorderSide(width: 1, color: _plantError),
    ),
    filled: true,
    fillColor: Colors.white,
    contentPadding: const EdgeInsets.symmetric(
      horizontal: AppSpacing.lg,
      vertical: AppSpacing.md,
    ),
    isDense: true,
    hintStyle: TextStyle(
      color: _plantTextSecondary,
      fontSize: AppTypography.bodyMedium,
    ),
  ),

  // Typography - clear hierarchy
  textTheme: TextTheme(
    headlineSmall: TextStyle(
      fontSize: AppTypography.headlineSmall,
      fontWeight: AppTypography.bold,
      color: _plantText,
      height: AppTypography.lineHeight,
    ),
    titleLarge: TextStyle(
      fontSize: AppTypography.titleLarge,
      fontWeight: AppTypography.bold,
      color: _plantText,
      height: AppTypography.lineHeight,
    ),
    titleMedium: TextStyle(
      fontSize: AppTypography.titleMedium,
      fontWeight: AppTypography.semibold,
      color: _plantText,
      height: AppTypography.lineHeight,
    ),
    titleSmall: TextStyle(
      fontSize: AppTypography.titleSmall,
      fontWeight: AppTypography.semibold,
      color: _plantText,
      height: AppTypography.lineHeight,
    ),
    bodyLarge: TextStyle(
      fontSize: AppTypography.bodyLarge,
      fontWeight: AppTypography.regular,
      color: _plantText,
      height: AppTypography.lineHeight,
    ),
    bodyMedium: TextStyle(
      fontSize: AppTypography.bodyMedium,
      fontWeight: AppTypography.regular,
      color: _plantText,
      height: AppTypography.lineHeight,
    ),
    bodySmall: TextStyle(
      fontSize: AppTypography.bodySmall,
      fontWeight: AppTypography.regular,
      color: _plantTextSecondary,
      height: AppTypography.lineHeight,
    ),
    labelMedium: TextStyle(
      fontSize: AppTypography.labelMedium,
      fontWeight: AppTypography.medium,
      color: _plantText,
      height: AppTypography.lineHeight,
    ),
    labelSmall: TextStyle(
      fontSize: AppTypography.labelSmall,
      fontWeight: AppTypography.medium,
      color: _plantTextSecondary,
      height: AppTypography.lineHeight,
    ),
  ),

  // Buttons - Material 3 standard
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: _plantPrimary,
      foregroundColor: Colors.white,
      elevation: AppElevation.none,
      padding: EdgeInsets.symmetric(
        vertical: AppSpacing.md,
        horizontal: AppSpacing.lg,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      minimumSize: const Size.fromHeight(AppTouchTarget.minSize),
      textStyle: TextStyle(
        fontSize: AppTypography.bodyLarge,
        fontWeight: AppTypography.semibold,
      ),
    ),
  ),

  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: _plantPrimary,
      side: const BorderSide(color: _plantPrimary, width: 1),
      padding: EdgeInsets.symmetric(
        vertical: AppSpacing.md,
        horizontal: AppSpacing.lg,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      minimumSize: const Size.fromHeight(AppTouchTarget.minSize),
      textStyle: TextStyle(
        fontSize: AppTypography.bodyLarge,
        fontWeight: AppTypography.semibold,
      ),
    ),
  ),

  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: _plantPrimary,
      padding: EdgeInsets.symmetric(
        vertical: AppSpacing.md,
        horizontal: AppSpacing.lg,
      ),
      minimumSize: const Size.fromHeight(AppTouchTarget.minSize),
      textStyle: TextStyle(
        fontSize: AppTypography.bodyLarge,
        fontWeight: AppTypography.semibold,
      ),
    ),
  ),

  // Other components
  dividerTheme: DividerThemeData(
    space: AppSpacing.lg,
    thickness: 1,
    color: Colors.grey.shade200,
  ),

  snackBarTheme: SnackBarThemeData(
    backgroundColor: _plantPrimary,
    contentTextStyle: TextStyle(
      color: Colors.white,
      fontSize: AppTypography.bodyMedium,
      fontWeight: AppTypography.medium,
    ),
    elevation: AppElevation.level3,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
    ),
    behavior: SnackBarBehavior.floating,
  ),

  // Interaction
  splashFactory: InkRipple.splashFactory,
);

/// Dark theme - Material 3 compliant
final ThemeData darkTheme = ThemeData(
  useMaterial3: true,
  brightness: Brightness.dark,
  colorScheme: ColorScheme.fromSeed(
    seedColor: _plantPrimary,
    brightness: Brightness.dark,
    surface: _darkSurface,
    primary: _plantPrimary,
    secondary: _plantSecondary,
    error: _plantError,
  ),
  scaffoldBackgroundColor: _darkBackground,

  // AppBar - dark variant
  appBarTheme: AppBarTheme(
    backgroundColor: _darkSurface,
    surfaceTintColor: Colors.transparent,
    elevation: AppElevation.none,
    iconTheme: const IconThemeData(color: _plantPrimary, size: 24),
    titleTextStyle: TextStyle(
      color: _darkText,
      fontWeight: AppTypography.bold,
      fontSize: AppTypography.titleMedium,
    ),
    centerTitle: true,
  ),

  // Cards - dark mode
  cardTheme: CardThemeData(
    color: _darkSurface,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
    ),
    elevation: AppElevation.level1,
    margin: const EdgeInsets.symmetric(
      vertical: AppSpacing.sm,
      horizontal: AppSpacing.lg,
    ),
  ),

  // Input fields - dark mode
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
      borderSide: const BorderSide(width: 1),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
      borderSide: BorderSide(width: 1, color: Colors.grey.shade700),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
      borderSide: const BorderSide(width: 2, color: _plantPrimary),
    ),
    filled: true,
    fillColor: _darkSurface,
    contentPadding: const EdgeInsets.symmetric(
      horizontal: AppSpacing.lg,
      vertical: AppSpacing.md,
    ),
    isDense: true,
    hintStyle: TextStyle(
      color: Colors.grey.shade500,
      fontSize: AppTypography.bodyMedium,
    ),
  ),

  // Typography - dark mode
  textTheme: TextTheme(
    headlineSmall: TextStyle(
      fontSize: AppTypography.headlineSmall,
      fontWeight: AppTypography.bold,
      color: _darkText,
      height: AppTypography.lineHeight,
    ),
    titleLarge: TextStyle(
      fontSize: AppTypography.titleLarge,
      fontWeight: AppTypography.bold,
      color: _darkText,
      height: AppTypography.lineHeight,
    ),
    titleMedium: TextStyle(
      fontSize: AppTypography.titleMedium,
      fontWeight: AppTypography.semibold,
      color: _darkText,
      height: AppTypography.lineHeight,
    ),
    titleSmall: TextStyle(
      fontSize: AppTypography.titleSmall,
      fontWeight: AppTypography.semibold,
      color: _darkText,
      height: AppTypography.lineHeight,
    ),
    bodyLarge: TextStyle(
      fontSize: AppTypography.bodyLarge,
      fontWeight: AppTypography.regular,
      color: _darkText,
      height: AppTypography.lineHeight,
    ),
    bodyMedium: TextStyle(
      fontSize: AppTypography.bodyMedium,
      fontWeight: AppTypography.regular,
      color: _darkText,
      height: AppTypography.lineHeight,
    ),
    bodySmall: TextStyle(
      fontSize: AppTypography.bodySmall,
      fontWeight: AppTypography.regular,
      color: Colors.grey.shade400,
      height: AppTypography.lineHeight,
    ),
    labelMedium: TextStyle(
      fontSize: AppTypography.labelMedium,
      fontWeight: AppTypography.medium,
      color: _darkText,
      height: AppTypography.lineHeight,
    ),
    labelSmall: TextStyle(
      fontSize: AppTypography.labelSmall,
      fontWeight: AppTypography.medium,
      color: Colors.grey.shade400,
      height: AppTypography.lineHeight,
    ),
  ),

  // Buttons - dark mode (same styling)
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: _plantPrimary,
      foregroundColor: Colors.white,
      elevation: AppElevation.none,
      padding: EdgeInsets.symmetric(
        vertical: AppSpacing.md,
        horizontal: AppSpacing.lg,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      minimumSize: const Size.fromHeight(AppTouchTarget.minSize),
      textStyle: TextStyle(
        fontSize: AppTypography.bodyLarge,
        fontWeight: AppTypography.semibold,
      ),
    ),
  ),

  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: _plantPrimary,
      side: const BorderSide(color: _plantPrimary, width: 1),
      padding: EdgeInsets.symmetric(
        vertical: AppSpacing.md,
        horizontal: AppSpacing.lg,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      minimumSize: const Size.fromHeight(AppTouchTarget.minSize),
      textStyle: TextStyle(
        fontSize: AppTypography.bodyLarge,
        fontWeight: AppTypography.semibold,
      ),
    ),
  ),

  // Other components - dark
  dividerTheme: DividerThemeData(
    space: AppSpacing.lg,
    thickness: 1,
    color: Colors.grey.shade800,
  ),

  snackBarTheme: SnackBarThemeData(
    backgroundColor: _plantPrimary,
    contentTextStyle: TextStyle(
      color: Colors.white,
      fontSize: AppTypography.bodyMedium,
      fontWeight: AppTypography.medium,
    ),
    elevation: AppElevation.level3,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
    ),
    behavior: SnackBarBehavior.floating,
  ),

  splashFactory: InkRipple.splashFactory,
);
