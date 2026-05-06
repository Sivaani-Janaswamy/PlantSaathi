import '../core/api_service.dart';
import '../models/ai_response.dart';

class AiService {
  AiService({ApiService? apiService}) : _api = apiService ?? ApiService();

  final ApiService _api;

  Future<AiAnswer> ask(String question, {String? plantId}) async {
    final data = {'message': question};
    if (plantId != null) data['plantId'] = plantId;

    final response = await _api.post('/ai/chat', data: data);
    final responseData = _unwrapMap(response.data);
    final payload = _unwrapMap(responseData['data'] ?? responseData);
    return AiAnswer.fromJson(payload);
  }

  Map<String, dynamic> _unwrapMap(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return Map<String, dynamic>.from(value);
    return <String, dynamic>{};
  }
}
