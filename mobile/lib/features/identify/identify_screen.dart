import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:share_plus/share_plus.dart';

import '../../models/plant.dart';
import '../../services/plant_service.dart';
import '../../widgets/app_section_header.dart';
import '../../widgets/empty_state_card.dart';
import '../../widgets/error_state_card.dart';
import '../../widgets/primary_action_button.dart';
import '../plant_detail/plant_detail_screen.dart';

class IdentifyScreen extends StatefulWidget {
  const IdentifyScreen({Key? key}) : super(key: key);

  @override
  State<IdentifyScreen> createState() => _IdentifyScreenState();
}

class _IdentifyScreenState extends State<IdentifyScreen> {
  final PlantService _plantService = PlantService();
  final ImagePicker _picker = ImagePicker();

  File? _selectedImage;
  Plant? _result;
  String? _error;
  bool _loading = false;

  Future<void> _pickImage() async {
    final file = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 85,
      maxWidth: 1600,
    );
    if (!mounted || file == null) {
      return;
    }

    setState(() {
      _selectedImage = File(file.path);
      _result = null;
      _error = null;
    });
  }

  Future<void> _identify() async {
    final image = _selectedImage;
    if (image == null) {
      setState(() {
        _error = 'Please choose a plant image first.';
      });
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
      _result = null;
    });

    try {
      final plant = await _plantService.identifyPlant(image);
      if (!mounted) return;
      setState(() {
        _result = plant;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Could not identify that plant right now.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  Future<void> _copySummary(Plant plant) async {
    await Clipboard.setData(ClipboardData(text: _summaryText(plant)));
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Plant summary copied')),
    );
  }

  Future<void> _shareSummary(Plant plant) async {
    await Share.share(_summaryText(plant));
  }

  String _summaryText(Plant plant) {
    return [
      '${plant.commonName} (${plant.scientificName})',
      'Uses: ${_valueOrFallback(plant.uses)}',
      'Benefits: ${_valueOrFallback(plant.benefits)}',
      'Where it grows: ${_valueOrFallback(plant.whereItGrows)}',
      'How to grow: ${_valueOrFallback(plant.howToGrow)}',
    ].join('\n');
  }

  String _valueOrFallback(String? value) {
    final text = value?.trim() ?? '';
    return text.isEmpty ? 'Not available' : text;
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;
    final selectedImage = _selectedImage;
    final result = _result;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Identify a plant'),
        backgroundColor: Colors.white,
        foregroundColor: primary,
        elevation: 0,
      ),
      body: Stack(
        children: [
          ListView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            children: [
              const AppSectionHeader(
                title: 'Identify from a photo',
                subtitle: 'Pick a clear image and PlantSaathi will try to recognize the plant for you.',
                icon: Icons.document_scanner_rounded,
              ),
              const SizedBox(height: 18),
              _ImagePickerCard(
                image: selectedImage,
                onPick: _pickImage,
                onClear: selectedImage == null
                    ? null
                    : () {
                        setState(() {
                          _selectedImage = null;
                          _result = null;
                          _error = null;
                        });
                      },
              ),
              const SizedBox(height: 14),
              PrimaryActionButton(
                label: selectedImage == null ? 'Choose from Gallery' : 'Identify Plant',
                onPressed: selectedImage == null ? _pickImage : _identify,
                isLoading: _loading,
              ),
              const SizedBox(height: 18),
              if (_error != null)
                ErrorStateCard(
                  message: _error!,
                  onRetry: selectedImage == null ? _pickImage : _identify,
                )
              else if (result == null && selectedImage == null)
                const EmptyStateCard(
                  title: 'Ready when you are',
                  message: 'Choose a plant photo to begin the identification flow.',
                  icon: Icons.photo_library_rounded,
                )
              else if (result == null)
                const EmptyStateCard(
                  title: 'Photo selected',
                  message: 'Tap Identify Plant to analyze the image and see the result.',
                  icon: Icons.auto_awesome_rounded,
                )
              else
                _ResultCard(
                  plant: result,
                  image: selectedImage,
                  onCopy: () => _copySummary(result),
                  onShare: () => _shareSummary(result),
                  onOpenDetails: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => PlantDetailScreen(plantId: result.id),
                      ),
                    );
                  },
                ),
            ],
          ),
          if (_loading)
            Positioned.fill(
              child: Container(
                color: Colors.black.withAlpha((0.18 * 255).round()),
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x18000000),
                          blurRadius: 24,
                          offset: Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CircularProgressIndicator(color: primary),
                        const SizedBox(height: 14),
                        Text(
                          'Identifying plant...',
                          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _ImagePickerCard extends StatelessWidget {
  final File? image;
  final VoidCallback onPick;
  final VoidCallback? onClear;

  const _ImagePickerCard({
    required this.image,
    required this.onPick,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;
    final currentImage = image;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Plant image',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
              color: primary,
            ),
          ),
          const SizedBox(height: 14),
          if (currentImage == null)
            Container(
              height: 220,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Color.fromARGB((0.06 * 255).round(), primary.red, primary.green, primary.blue),
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(
                  color: Color.fromARGB((0.12 * 255).round(), primary.red, primary.green, primary.blue),
                ),
              ),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.image_search_rounded, size: 48, color: primary),
                    const SizedBox(height: 10),
                    Text(
                      'No image selected',
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Use a clear photo with the plant centered in frame.',
                      style: theme.textTheme.bodyMedium?.copyWith(color: Colors.black54),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            )
          else
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: Image.file(
                currentImage,
                height: 240,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onPick,
                  icon: const Icon(Icons.photo_library_rounded, size: 18),
                  label: Text(currentImage == null ? 'Choose Photo' : 'Change Photo'),
                ),
              ),
              if (onClear != null) ...[
                const SizedBox(width: 10),
                IconButton.filledTonal(
                  onPressed: onClear,
                  icon: const Icon(Icons.clear_rounded),
                  tooltip: 'Clear photo',
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _ResultCard extends StatelessWidget {
  final Plant plant;
  final File? image;
  final VoidCallback onCopy;
  final VoidCallback onShare;
  final VoidCallback onOpenDetails;

  const _ResultCard({
    required this.plant,
    required this.image,
    required this.onCopy,
    required this.onShare,
    required this.onOpenDetails,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;
    final currentImage = image;

    return Container(
      padding: const EdgeInsets.all(18),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Identified plant',
            style: theme.textTheme.titleMedium?.copyWith(
              color: primary,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 12),
          if (currentImage != null)
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: Image.file(
                currentImage,
                height: 160,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          if (currentImage != null) const SizedBox(height: 14),
          Text(
            plant.commonName,
            style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 4),
          Text(
            plant.scientificName,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.black54,
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            _valueOrFallback(plant.uses),
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.black87,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              OutlinedButton.icon(
                onPressed: onCopy,
                icon: const Icon(Icons.copy_rounded, size: 18),
                label: const Text('Copy'),
              ),
              OutlinedButton.icon(
                onPressed: onShare,
                icon: const Icon(Icons.share_rounded, size: 18),
                label: const Text('Share'),
              ),
              FilledButton.icon(
                onPressed: onOpenDetails,
                icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                label: const Text('Open details'),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _valueOrFallback(String? value) {
    final text = value?.trim() ?? '';
    return text.isEmpty ? 'No extra notes available right now.' : text;
  }
}
