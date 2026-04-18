import 'package:supabase_flutter/supabase_flutter.dart';

import '../core/session_manager.dart';
import '../core/supabase_config.dart';

class AuthSignUpResult {
  final String? accessToken;
  final bool requiresEmailConfirmation;
  final String message;

  const AuthSignUpResult({
    required this.accessToken,
    required this.requiresEmailConfirmation,
    required this.message,
  });
}

class AuthService {
  AuthService({SessionManager? sessionManager})
      : _sessionManager = sessionManager ?? SessionManager.instance;

  final SessionManager _sessionManager;
  SupabaseClient get _clientChecked {
    if (!SupabaseConfig.isConfigured) {
      throw StateError(
        'Supabase is not configured. Provide SUPABASE_URL and SUPABASE_ANON_KEY.',
      );
    }
    return Supabase.instance.client;
  }

  Future<String> signIn({
    required String email,
    required String password,
  }) async {
    final response = await _clientChecked.auth.signInWithPassword(
      email: email,
      password: password,
    );
    final session = response.session;
    if (session == null || session.accessToken.isEmpty) {
      throw StateError('Login succeeded but no session was returned.');
    }

    await _sessionManager.saveToken(session.accessToken);
    return session.accessToken;
  }

  Future<AuthSignUpResult> signUp({
    required String email,
    required String password,
  }) async {
    final response = await _clientChecked.auth.signUp(
      email: email,
      password: password,
    );
    final session = response.session;

    if (session != null && session.accessToken.isNotEmpty) {
      await _sessionManager.saveToken(session.accessToken);
      return AuthSignUpResult(
        accessToken: session.accessToken,
        requiresEmailConfirmation: false,
        message: 'Account created successfully.',
      );
    }

    await _sessionManager.clearSession();
    return const AuthSignUpResult(
      accessToken: null,
      requiresEmailConfirmation: true,
      message: 'Check your email to confirm your account.',
    );
  }

  Future<void> signOut() async {
    if (SupabaseConfig.isConfigured) {
      await _clientChecked.auth.signOut(scope: SignOutScope.local);
    }
    await _sessionManager.clearSession();
  }

  Future<bool> hasActiveSession() {
    return _sessionManager.hasValidSession();
  }

  Future<void> syncSession() {
    return _sessionManager.syncFromSupabase();
  }
}
