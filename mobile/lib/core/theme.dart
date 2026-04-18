import 'package:flutter/material.dart';

const Color _plantPrimary = Color(0xFF4CAF50);
const Color _plantSurface = Color(0xFFF5F7F4);
const Color _plantText = Color(0xFF222831);

final ThemeData appTheme = ThemeData(
  useMaterial3: true,
  brightness: Brightness.light,
  primaryColor: _plantPrimary,
  colorScheme: ColorScheme.fromSeed(
    seedColor: _plantPrimary,
    brightness: Brightness.light,
    surface: Colors.white,
    background: _plantSurface,
    primary: _plantPrimary,
    secondary: const Color(0xFFE0B95B),
    error: const Color(0xFFE57373),
  ),
  scaffoldBackgroundColor: _plantSurface,
  cardTheme: CardThemeData(
    color: Colors.white,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(20),
    ),
    elevation: 0.5,
    margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: Colors.white,
    surfaceTintColor: Colors.transparent,
    elevation: 0,
    iconTheme: IconThemeData(color: _plantPrimary),
    titleTextStyle: TextStyle(
      color: _plantPrimary,
      fontWeight: FontWeight.bold,
      fontSize: 20,
    ),
  ),
  textTheme: const TextTheme(
    bodyLarge: TextStyle(color: _plantText),
    bodyMedium: TextStyle(color: Color(0xFF393E46)),
    titleLarge: TextStyle(color: _plantPrimary, fontWeight: FontWeight.bold),
  ),
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: BorderSide.none,
    ),
    filled: true,
    fillColor: Colors.white,
    contentPadding: const EdgeInsets.symmetric(vertical: 15, horizontal: 16),
  ),
  dividerTheme: const DividerThemeData(space: 24, thickness: 1),
  snackBarTheme: const SnackBarThemeData(
    backgroundColor: _plantPrimary,
    contentTextStyle: TextStyle(color: Colors.white),
  ),
  splashFactory: InkRipple.splashFactory,
);
