
import 'package:dio/dio.dart';
import 'dart:io';
import 'session_manager.dart';
import 'logger.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: _baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        Logger.instance.apiRequest(options.path);
        final token = await _getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onResponse: (response, handler) {
        Logger.instance.apiResponse(response.statusCode ?? 0, response.requestOptions.path);
        return handler.next(response);
      },
      onError: (DioException e, handler) {
        Logger.instance.apiError(e.message ?? 'Unknown error', e.requestOptions.path ?? '');
        return handler.next(e);
      },
    ));
  }

  static const String _baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000',
  );
  late final Dio _dio;
  final _sessionManager = SessionManager.instance;

  static const int _maxRetries = 3;
  static const Duration _initialDelay = Duration(seconds: 1);
  static const double _backoffMultiplier = 2.0;

  Future<String?> _getToken() async {
    return _sessionManager.readToken();
  }

  Dio get client => _dio;

  /// Retry mechanism with exponential backoff
  Future<Response> _executeWithRetry<T>(
    Future<Response> Function() requestFunction,
    String path, {
    int maxRetries = _maxRetries,
    Duration initialDelay = _initialDelay,
    double backoffMultiplier = _backoffMultiplier,
  }) async {
    int retryCount = 0;
    Duration currentDelay = initialDelay;

    while (retryCount <= maxRetries) {
      try {
        final response = await requestFunction();
        
        // If successful, return the response
        if (response.statusCode != null && 
            response.statusCode! >= 200 && 
            response.statusCode! < 300) {
          return response;
        }
        
        // If it's a client error (4xx), don't retry
        if (response.statusCode != null && 
            response.statusCode! >= 400 && 
            response.statusCode! < 500) {
          return response;
        }
        
        // If it's a server error (5xx) and we haven't exceeded retries, retry
        if (retryCount < maxRetries) {
          retryCount++;
          Logger.instance.apiWarning(
            'Request failed with status ${response.statusCode}, retrying in ${currentDelay.inSeconds}s (attempt $retryCount/$maxRetries)',
            path,
          );
          await Future.delayed(currentDelay);
          currentDelay = Duration(
            milliseconds: (currentDelay.inMilliseconds * backoffMultiplier).round(),
          );
          continue;
        }
        
        return response;
      } catch (e) {
        // Log the error
        Logger.instance.apiError(
          'Request failed: ${e.toString()}',
          path,
        );

        // If it's a network error and we haven't exceeded retries, retry
        if (_shouldRetry(e) && retryCount < maxRetries) {
          retryCount++;
          Logger.instance.apiWarning(
            'Network error, retrying in ${currentDelay.inSeconds}s (attempt $retryCount/$maxRetries)',
            path,
          );
          await Future.delayed(currentDelay);
          currentDelay = Duration(
            milliseconds: (currentDelay.inMilliseconds * backoffMultiplier).round(),
          );
          continue;
        }
        
        // If we've exceeded retries or it's not a retryable error, rethrow
        rethrow;
      }
    }

    throw Exception('Max retries exceeded for request: $path');
  }

  /// Determine if an error should trigger a retry
  bool _shouldRetry(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
        case DioExceptionType.connectionError:
          return true;
        case DioExceptionType.badResponse:
          // Retry on 5xx server errors
          if (error.response?.statusCode != null &&
              error.response!.statusCode! >= 500) {
            return true;
          }
          return false;
        case DioExceptionType.cancel:
        case DioExceptionType.unknown:
        default:
          return false;
      }
    } else if (error is SocketException || error is HttpException) {
      return true;
    }
    return false;
  }

  // GET with retry
  Future<Response> get(String path, {Map<String, dynamic>? query}) async {
    return _executeWithRetry(
      () => _dio.get(path, queryParameters: query),
      path,
    );
  }

  // POST with retry
  Future<Response> post(String path, {dynamic data}) async {
    return _executeWithRetry(
      () => _dio.post(path, data: data),
      path,
    );
  }

  // PUT with retry
  Future<Response> put(String path, {dynamic data}) async {
    return _executeWithRetry(
      () => _dio.put(path, data: data),
      path,
    );
  }

  // DELETE with retry
  Future<Response> delete(String path, {dynamic data}) async {
    return _executeWithRetry(
      () => _dio.delete(path, data: data),
      path,
    );
  }

  // PATCH with retry
  Future<Response> patch(String path, {dynamic data}) async {
    return _executeWithRetry(
      () => _dio.patch(path, data: data),
      path,
    );
  }
}
