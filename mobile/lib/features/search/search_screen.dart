import 'package:flutter/material.dart';

import '../../models/plant.dart';
import '../../services/plant_service.dart';
import '../../widgets/app_section_header.dart';
import '../../widgets/empty_state_card.dart';
import '../../widgets/error_state_card.dart';
import '../../widgets/skeleton_loader.dart';
import '../identify/identify_screen.dart';
import '../plant_detail/plant_detail_screen.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final PlantService _plantService = PlantService();
  final TextEditingController _queryController = TextEditingController();
  bool _loading = false;
  bool _hasSearched = false;
  String? _error;
  List<PlantSummary> _results = const [];

  Future<void> _search() async {
    final query = _queryController.text.trim();
    if (query.isEmpty) {
      setState(() {
        _results = const [];
        _error = null;
        _hasSearched = false;
      });
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
      _hasSearched = true;
    });

    try {
      final results = await _plantService.searchPlants(query);
      if (!mounted) return;
      setState(() => _results = results);
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Could not load plants right now.');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
      children: [
        const AppSectionHeader(
          title: 'Search plants',
          subtitle: 'Look up plant names, compare botanical details, and explore cards with a calm layout.',
          icon: Icons.search_rounded,
        ),
        const SizedBox(height: 18),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0F000000),
                blurRadius: 18,
                offset: Offset(0, 8),
              ),
            ],
          ),
          child: TextField(
            controller: _queryController,
            textInputAction: TextInputAction.search,
            onChanged: (value) {
              if (value.trim().isEmpty) {
                setState(() {
                  _results = const [];
                  _error = null;
                  _hasSearched = false;
                });
              } else {
                setState(() {});
              }
            },
            onSubmitted: (_) => _search(),
            decoration: InputDecoration(
              hintText: 'Search by common or scientific name',
              prefixIcon: Icon(Icons.search_rounded, color: primary),
              suffixIcon: IconButton(
                onPressed: _search,
                icon: Icon(Icons.arrow_forward_rounded, color: primary),
              ),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            ),
          ),
        ),
        const SizedBox(height: 12),
        TextButton.icon(
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => const IdentifyScreen(),
              ),
            );
          },
          icon: const Icon(Icons.document_scanner_outlined),
          label: const Text('Identify from a photo'),
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
          ErrorStateCard(message: _error!, onRetry: _search)
        else if (!_hasSearched)
          const EmptyStateCard(
            title: 'Start with a plant name',
            message: 'Try Tulsi, Rose, or Neem to discover the search experience.',
            icon: Icons.local_florist_rounded,
          )
        else if (_results.isEmpty)
          const EmptyStateCard(
            title: 'No matches found',
            message: 'Try a different spelling or a related scientific name.',
            icon: Icons.search_off_rounded,
          )
        else
          ..._results.map(
            (plant) => Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: _PlantCard(plant: plant),
            ),
          ),
      ],
    );
  }
}

class _PlantCard extends StatelessWidget {
  final PlantSummary plant;

  const _PlantCard({required this.plant});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => PlantDetailScreen(plantId: plant.id),
            ),
          );
        },
        borderRadius: BorderRadius.circular(20),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0F000000),
                blurRadius: 16,
                offset: Offset(0, 8),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: Color.fromARGB((0.10 * 255).round(), primary.red, primary.green, primary.blue),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Icon(Icons.eco_rounded, color: primary),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plant.commonName,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        plant.scientificName,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: Colors.black54,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                Icon(Icons.chevron_right_rounded, color: primary),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
