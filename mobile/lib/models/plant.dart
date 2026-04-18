class PlantSummary {
  final String id;
  final String commonName;
  final String scientificName;
  final String? imageUrl;

  const PlantSummary({
    required this.id,
    required this.commonName,
    required this.scientificName,
    this.imageUrl,
  });

  factory PlantSummary.fromJson(Map<String, dynamic> json) {
    return PlantSummary(
      id: json['id']?.toString() ?? '',
      commonName: json['common_name']?.toString() ?? '',
      scientificName: json['scientific_name']?.toString() ?? '',
      imageUrl: json['image_url']?.toString(),
    );
  }
}

class Plant extends PlantSummary {
  final String? uses;
  final String? benefits;
  final String? whereItGrows;
  final String? howToGrow;

  const Plant({
    required super.id,
    required super.commonName,
    required super.scientificName,
    super.imageUrl,
    this.uses,
    this.benefits,
    this.whereItGrows,
    this.howToGrow,
  });

  factory Plant.fromJson(Map<String, dynamic> json) {
    return Plant(
      id: json['id']?.toString() ?? '',
      commonName: json['common_name']?.toString() ?? '',
      scientificName: json['scientific_name']?.toString() ?? '',
      imageUrl: json['image_url']?.toString(),
      uses: json['uses']?.toString(),
      benefits: json['benefits']?.toString(),
      whereItGrows: json['where_it_grows']?.toString(),
      howToGrow: json['how_to_grow']?.toString(),
    );
  }
}
