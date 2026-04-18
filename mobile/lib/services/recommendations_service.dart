import '../core/api_service.dart';
import '../models/plant.dart';

class RecommendationsService {
  RecommendationsService({ApiService? apiService}) : _api = apiService ?? ApiService();

  final ApiService _api;

  Future<List<PlantSummary>> getRecommendations() async {
    final response = await _api.get('/recommendations');
    final data = _unwrapMap(response.data);
    final payload = data['data'] is List ? data['data'] as List : const [];
    return payload
        .whereType<Map>()
        .map((item) => PlantSummary.fromJson(Map<String, dynamic>.from(item)))
        .toList();
  }

  Map<String, dynamic> _unwrapMap(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return Map<String, dynamic>.from(value);
    return <String, dynamic>{};
  }
}
