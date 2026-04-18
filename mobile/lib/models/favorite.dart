import 'plant.dart';

enum FavoriteType { plant, ai }

class FavoriteItem {
  final String id;
  final FavoriteType type;
  final String? plantId;
  final Plant? plant;
  final String? text;

  const FavoriteItem({
    required this.id,
    required this.type,
    this.plantId,
    this.plant,
    this.text,
  });

  factory FavoriteItem.fromJson(Map<String, dynamic> json) {
    final typeValue = json['type']?.toString() ?? 'plant';
    return FavoriteItem(
      id: json['id']?.toString() ?? '',
      type: typeValue == 'ai' ? FavoriteType.ai : FavoriteType.plant,
      plantId: json['plant_id']?.toString(),
      plant: json['plant'] is Map<String, dynamic>
          ? Plant.fromJson(json['plant'] as Map<String, dynamic>)
          : null,
      text: json['text']?.toString(),
    );
  }
}
