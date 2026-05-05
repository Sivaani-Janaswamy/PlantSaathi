import 'package:flutter/material.dart';

import '../../core/design_tokens.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';

import '../../models/favorite.dart';
import '../../models/plant.dart';
import '../../services/favorites_service.dart';
import '../../services/plant_service.dart';
import '../../widgets/empty_state_card.dart';
import '../../widgets/error_state_card.dart';
import '../../widgets/skeleton_loader.dart';

class PlantDetailScreen extends StatefulWidget {
  final String plantId;

  const PlantDetailScreen({
    Key? key,
    required this.plantId,
  }) : super(key: key);

  @override
  State<PlantDetailScreen> createState() => _PlantDetailScreenState();
}

class _PlantDetailScreenState extends State<PlantDetailScreen> {
  final PlantService _plantService = PlantService();
  final FavoritesService _favoritesService = FavoritesService();
  late final Future<_PlantDetailData> _future;
  FavoriteItem? _currentFavorite;
  bool _actionBusy = false;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_PlantDetailData> _load() async {
    final plantFuture = _plantService.getPlant(widget.plantId);
    final favoritesFuture = _favoritesService.getFavorites();
    final plant = await plantFuture;
    try {
      final favorites = await favoritesFuture;
      FavoriteItem? matched;
      for (final item in favorites) {
        final matchesPlant = item.type == FavoriteType.plant &&
            (item.plantId == widget.plantId || item.plant?.id == widget.plantId);
        if (matchesPlant) {
          matched = item;
          break;
        }
      }
      _currentFavorite = matched;
    } catch (_) {
      _currentFavorite = null;
    }
    return _PlantDetailData(plant: plant);
  }

  Future<void> _toggleFavorite(Plant plant) async {
    if (_actionBusy) return;

    setState(() {
      _actionBusy = true;
    });

    try {
      if (_currentFavorite != null) {
        await _favoritesService.removeFavorite(_currentFavorite!.id);
        if (!mounted) return;
        setState(() {
          _currentFavorite = null;
        });
        _showSnackBar('Removed from favorites');
      } else {
        final favorite = await _favoritesService.addPlantFavorite(plant.id);
        if (!mounted) return;
        setState(() {
          _currentFavorite = favorite;
        });
        _showSnackBar('Saved to favorites');
      }
    } catch (_) {
      if (!mounted) return;
      _showSnackBar('Could not update favorites right now.');
    } finally {
      if (mounted) {
        setState(() {
          _actionBusy = false;
        });
      }
    }
  }

  Future<void> _copyPlant(Plant plant) async {
    await Clipboard.setData(ClipboardData(text: _shareText(plant)));
    if (!mounted) return;
    _showSnackBar('Plant details copied');
  }

  Future<void> _sharePlant(Plant plant) async {
    await Share.share(_shareText(plant));
  }

  String _shareText(Plant plant) {
    final buffer = StringBuffer()
      ..writeln('${plant.commonName} (${plant.scientificName})')
      ..writeln()
      ..writeln('Uses: ${_valueOrFallback(plant.uses)}')
      ..writeln('Benefits: ${_valueOrFallback(plant.benefits)}')
      ..writeln('Where it grows: ${_valueOrFallback(plant.whereItGrows)}')
      ..writeln('How to grow: ${_valueOrFallback(plant.howToGrow)}');
    return buffer.toString();
  }

  String _valueOrFallback(String? value) {
    final text = value?.trim() ?? '';
    return text.isEmpty ? 'Not available' : text;
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Plant details'),
        backgroundColor: Colors.white,
        foregroundColor: primary,
        elevation: 0,
      ),
      body: FutureBuilder<_PlantDetailData>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return ListView(
              padding: const EdgeInsets.all(AppSpacing.xl),
              children: const [
                SkeletonHeader(),
                SizedBox(height: 18),
                SkeletonAnswerCard(),
                SizedBox(height: 14),
                SkeletonAnswerCard(),
              ],
            );
          }

          if (snapshot.hasError) {
            return ListView(
              padding: const EdgeInsets.all(AppSpacing.xl),
              children: const [
                ErrorStateCard(message: 'Could not load plant details right now.'),
              ],
            );
          }

          final plant = snapshot.data?.plant;
          if (plant == null) {
            return ListView(
              padding: const EdgeInsets.all(AppSpacing.xl),
              children: const [
                EmptyStateCard(
                  title: 'Plant not found',
                  message: 'The plant you selected is no longer available.',
                  icon: Icons.local_florist_rounded,
                ),
              ],
            );
          }

          return ListView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Color.fromARGB((0.18 * 255).round(), primary.red, primary.green, primary.blue),
                      Colors.white,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(26),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 62,
                      height: 62,
                      decoration: BoxDecoration(
                        color: Color.fromARGB((0.12 * 255).round(), primary.red, primary.green, primary.blue),
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                      child: Icon(Icons.eco_rounded, color: primary, size: 30),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      plant.commonName,
                      style: theme.textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      plant.scientificName,
                      style: theme.textTheme.titleMedium?.copyWith(
                        color: Colors.black54,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: [
                        _ActionChipButton(
                          icon: Icons.share_rounded,
                          label: 'Share',
                          onPressed: () => _sharePlant(plant),
                        ),
                        _ActionChipButton(
                          icon: Icons.copy_rounded,
                          label: 'Copy',
                          onPressed: () => _copyPlant(plant),
                        ),
                        _ActionChipButton(
                          icon: _currentFavorite != null ? Icons.bookmark_rounded : Icons.bookmark_add_outlined,
                          label: _currentFavorite != null ? 'Saved' : 'Save',
                          onPressed: _actionBusy ? null : () => _toggleFavorite(plant),
                          filled: _currentFavorite != null,
                          loading: _actionBusy,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              _DetailCard(title: 'Uses', value: plant.uses),
              _DetailCard(title: 'Benefits', value: plant.benefits),
              _DetailCard(title: 'Where it grows', value: plant.whereItGrows),
              _DetailCard(title: 'How to grow', value: plant.howToGrow),
            ],
          );
        },
      ),
    );
  }
}

class _PlantDetailData {
  final Plant plant;

  const _PlantDetailData({
    required this.plant,
  });
}

class _DetailCard extends StatelessWidget {
  final String title;
  final String? value;

  const _DetailCard({
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 16,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: theme.textTheme.titleMedium?.copyWith(
              color: primary,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            (value == null || value!.trim().isEmpty) ? 'Not available' : value!,
            style: theme.textTheme.bodyMedium?.copyWith(
              height: 1.5,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionChipButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  final bool filled;
  final bool loading;

  const _ActionChipButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    this.filled = false,
    this.loading = false,
  });

  @override
  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;

    return FilledButton.tonalIcon(
      onPressed: loading ? null : onPressed,
      icon: loading
          ? const SizedBox(
              height: 16,
              width: 16,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Icon(icon, size: 18),
      label: Text(label),
      style: FilledButton.styleFrom(
        backgroundColor: filled ? primary : null,
        foregroundColor: filled ? Colors.white : null,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
      ),
    );
  }
}
