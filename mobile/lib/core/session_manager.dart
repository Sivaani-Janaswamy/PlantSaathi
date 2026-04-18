import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class SessionManager {
  SessionManager._();

  static final SessionManager instance = SessionManager._();

  static const String _tokenKey = 'jwt_token';
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<String?> readToken() {
    try {
      final session = Supabase.instance.client.auth.currentSession;
      if (session != null && session.accessToken.isNotEmpty) {
        return Future.value(session.accessToken);
      }
    } catch (_) {
      // Supabase may not be initialized yet in local/dev fallback scenarios.
    }

    return _storage.read(key: _tokenKey);
  }

  Future<bool> hasValidSession() async {
    final token = await readToken();
    return token != null && token.isNotEmpty;
  }

  Future<void> saveToken(String token) {
    return _storage.write(key: _tokenKey, value: token);
  }

  Future<void> clearSession() {
    return _storage.delete(key: _tokenKey);
  }

  Future<void> syncFromSupabase() async {
    try {
      final session = Supabase.instance.client.auth.currentSession;
      if (session != null && session.accessToken.isNotEmpty) {
        await saveToken(session.accessToken);
      }
    } catch (_) {
      // Ignore when Supabase is unavailable; the caller can continue with storage.
    }
  }
}
