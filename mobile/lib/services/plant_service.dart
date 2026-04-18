import 'dart:io';

import 'package:dio/dio.dart';

import '../core/api_service.dart';
import '../models/plant.dart';

class PlantService {
  PlantService({ApiService? apiService}) : _api = apiService ?? ApiService();

  final ApiService _api;

  Future<List<PlantSummary>> searchPlants(String query) async {
    final response = await _api.get('/plants/search', query: {'q': query});
    final data = _unwrapMap(response.data);
    final payload = _unwrapMap(data['data'] ?? data);
    final plants = (payload['plants'] as List? ?? const [])
        .whereType<Map>()
        .map((item) => PlantSummary.fromJson(Map<String, dynamic>.from(item)))
        .toList();
    return plants;
  }

  Future<Plant> getPlant(String id) async {
    final response = await _api.get('/plants/$id');
    final data = _unwrapMap(response.data);
    final payload = _unwrapMap(data['data'] ?? data);
    return Plant.fromJson(payload);
  }

  Future<Plant> identifyPlant(File imageFile) async {
    final formData = FormData.fromMap({
      'image': await MultipartFile.fromFile(
        imageFile.path,
        filename: imageFile.path.split(Platform.pathSeparator).last,
      ),
    });
    final response = await _api.post('/plants/identify', data: formData);
    final data = _unwrapMap(response.data);
    final success = data['success'] == true;
    final payload = _unwrapMap(data['data'] ?? data);

    if (!success) {
      throw Exception(data['message']?.toString() ?? 'Identification failed');
    }

    return Plant.fromJson(payload);
  }

  Map<String, dynamic> _unwrapMap(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return Map<String, dynamic>.from(value);
    return <String, dynamic>{};
  }
}
