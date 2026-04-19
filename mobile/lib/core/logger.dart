/// Minimal, production-focused logger for API calls only.
/// DO NOT log UI events, sensitive data, or debug info.
class Logger {
  Logger._();
  static final Logger instance = Logger._();

  void apiRequest(String endpoint) {
    // ignore: avoid_print
    print('[API REQUEST] $endpoint');
  }

  void apiResponse(int status, String endpoint) {
    // ignore: avoid_print
    print('[API RESPONSE] $status $endpoint');
  }

  void apiError(String message, String endpoint) {
    // ignore: avoid_print
    print('[API ERROR] $message ($endpoint)');
  }

  void apiWarning(String message, String endpoint) {
    // ignore: avoid_print
    print('[API WARNING] $message ($endpoint)');
  }
}
