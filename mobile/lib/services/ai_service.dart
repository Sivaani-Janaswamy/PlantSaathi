import '../core/api_service.dart';
import '../models/ai_response.dart';

class AiService {
  AiService({ApiService? apiService}) : _api = apiService ?? ApiService();

  final ApiService _api;

  Future<AiAnswer> ask(String question) async {
    final response = await _api.post('/ai/ask', data: {'question': question});
    final data = _unwrapMap(response.data);
    final payload = _unwrapMap(data['data'] ?? data);
    return AiAnswer.fromJson(payload);
  }

  Map<String, dynamic> _unwrapMap(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return Map<String, dynamic>.from(value);
    return <String, dynamic>{};
  }
}
