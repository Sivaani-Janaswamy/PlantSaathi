import 'package:flutter/material.dart';

import '../../core/design_tokens.dart';

import '../../models/favorite.dart';
import '../../services/favorites_service.dart';
import '../../widgets/app_section_header.dart';
import '../../widgets/empty_state_card.dart';
import '../../widgets/error_state_card.dart';
import '../../widgets/skeleton_loader.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({Key? key}) : super(key: key);

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final FavoritesService _favoritesService = FavoritesService();
  final Set<String> _removingIds = <String>{};
  bool _loading = true;
  String? _error;
  List<FavoriteItem> _items = const [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final items = await _favoritesService.getFavorites();
      if (!mounted) return;
      setState(() => _items = items);
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Could not load favorites right now.');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<bool> _removeFavorite(FavoriteItem item) async {
    if (_removingIds.contains(item.id)) {
      return false;
    }

    setState(() {
      _removingIds.add(item.id);
    });

    try {
      await _favoritesService.removeFavorite(item.id);
      if (!mounted) return false;
      setState(() {
        _items = _items.where((entry) => entry.id != item.id).toList();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${_titleFor(item)} removed from favorites')),
      );
      return true;
    } catch (_) {
      if (!mounted) return false;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not update favorites right now.')),
      );
      return false;
    } finally {
      if (mounted) {
        setState(() {
          _removingIds.remove(item.id);
        });
      }
    }
  }

  String _titleFor(FavoriteItem item) {
    if (item.type == FavoriteType.ai) {
      return 'AI note';
    }
    return item.plant?.commonName ?? 'Plant';
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(AppSpacing.xl),
        children: [
          const AppSectionHeader(
            title: 'Saved favorites',
            subtitle: 'Keep the plant and AI answers you care about in a tidy collection.',
            icon: Icons.favorite_rounded,
          ),
          const SizedBox(height: 18),
          if (_loading)
            ...List.generate(
              3,
              (index) => const Padding(
                padding: EdgeInsets.only(bottom: 14),
                child: SkeletonPlantCard(),
              ),
            )
          else if (_error != null)
            ErrorStateCard(message: _error!, onRetry: _load)
          else if (_items.isEmpty)
            const EmptyStateCard(
              title: 'No favorites yet',
              message: 'Save a plant or an AI answer to build your personal collection.',
              icon: Icons.bookmark_add_rounded,
            )
          else
            ..._items.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Dismissible(
                  key: ValueKey(item.id),
                  direction: DismissDirection.endToStart,
                  confirmDismiss: (_) => _removeFavorite(item),
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    decoration: BoxDecoration(
                      color: Colors.red.shade400,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                    child: const Icon(Icons.delete_rounded, color: Colors.white),
                  ),
                  child: _FavoriteCard(
                    item: item,
                    removing: _removingIds.contains(item.id),
                    onRemove: () => _removeFavorite(item),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _FavoriteCard extends StatelessWidget {
  final FavoriteItem item;
  final bool removing;
  final VoidCallback onRemove;

  const _FavoriteCard({
    required this.item,
    required this.removing,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;
    final isAi = item.type == FavoriteType.ai;
    final title = isAi ? 'AI note' : item.plant?.commonName ?? 'Plant';
    final subtitle = isAi
        ? (item.text ?? 'Saved AI answer')
        : item.plant?.scientificName ?? item.plantId ?? 'Saved plant';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.md),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 16,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              color: Color.fromARGB((0.12 * 255).round(), primary.red, primary.green, primary.blue),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(
              isAi ? Icons.chat_bubble_rounded : Icons.eco_rounded,
              color: primary,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.bodyMedium?.copyWith(color: Colors.black54),
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          removing
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2.2),
                )
              : IconButton(
                  onPressed: onRemove,
                  icon: const Icon(Icons.favorite_rounded),
                  color: primary,
                  tooltip: 'Remove from favorites',
                ),
        ],
      ),
    );
  }
}
