
import 'package:dio/dio.dart';
import 'session_manager.dart';
import 'logger.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: _baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
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
        Logger.instance.apiError(e.message, e.requestOptions.path);
        return handler.next(e);
      },
    ));
  }

  static const String _baseUrl = 'https://api.plantsaathi.com/v1'; // Update as needed
  late final Dio _dio;
  final _sessionManager = SessionManager.instance;

  Future<String?> _getToken() async {
    return _sessionManager.readToken();
  }

  Dio get client => _dio;

  // Example GET
  Future<Response> get(String path, {Map<String, dynamic>? query}) async {
    return await _dio.get(path, queryParameters: query);
  }

  // Example POST
  Future<Response> post(String path, {dynamic data}) async {
    return await _dio.post(path, data: data);
  }

  Future<Response> delete(String path, {dynamic data}) async {
    return await _dio.delete(path, data: data);
  }
}
