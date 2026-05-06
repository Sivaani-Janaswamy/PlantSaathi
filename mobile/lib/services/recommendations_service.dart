import '../core/api_service.dart';
import '../models/plant.dart';

class RecommendationsService {
  RecommendationsService({ApiService? apiService}) : _api = apiService ?? ApiService();

  final ApiService _api;

  Future<List<PlantSummary>> getRecommendations({String type = 'herb'}) async {
    final response = await _api.get('/plants/recommendations', query: {'type': type});
    final data = _unwrapMap(response.data);
    final payload = _unwrapMap(data['data'] ?? data);
    final plants = (payload['plants'] as List? ?? const [])
        .whereType<Map>()
        .map((item) => PlantSummary.fromJson(Map<String, dynamic>.from(item)))
        .toList();
    return plants;
  }

  Map<String, dynamic> _unwrapMap(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return Map<String, dynamic>.from(value);
    return <String, dynamic>{};
  }
}
