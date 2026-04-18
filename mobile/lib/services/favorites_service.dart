import '../core/api_service.dart';
import '../models/favorite.dart';

class FavoritesService {
  FavoritesService({ApiService? apiService}) : _api = apiService ?? ApiService();

  final ApiService _api;

  Future<List<FavoriteItem>> getFavorites() async {
    final response = await _api.get('/favorites');
    final data = _unwrapMap(response.data);
    final payload = data['data'] is List ? data['data'] as List : const [];
    return payload
        .whereType<Map>()
        .map((item) => FavoriteItem.fromJson(Map<String, dynamic>.from(item)))
        .toList();
  }

  Future<FavoriteItem> addPlantFavorite(String plantId) async {
    final response = await _api.post('/favorites', data: {
      'type': 'plant',
      'plant_id': plantId,
    });
    return FavoriteItem.fromJson(_payloadMap(response.data));
  }

  Future<FavoriteItem> addAiFavorite(String text) async {
    final response = await _api.post('/favorites', data: {
      'type': 'ai',
      'text': text,
    });
    return FavoriteItem.fromJson(_payloadMap(response.data));
  }

  Future<FavoriteItem?> removeFavorite(String id) async {
    final response = await _api.delete('/favorites/$id');
    final data = _unwrapMap(response.data);
    final payload = _unwrapMap(data['data'] ?? data);
    if (payload.isEmpty) {
      return null;
    }
    return FavoriteItem.fromJson(payload);
  }

  Map<String, dynamic> _unwrapMap(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return Map<String, dynamic>.from(value);
    return <String, dynamic>{};
  }

  Map<String, dynamic> _payloadMap(dynamic value) {
    final data = _unwrapMap(value);
    return _unwrapMap(data['data'] ?? data);
  }
}
