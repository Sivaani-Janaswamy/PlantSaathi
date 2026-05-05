import 'package:flutter/material.dart';

import '../../core/design_tokens.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';

import '../../models/ai_response.dart';
import '../../models/favorite.dart';
import '../../services/ai_service.dart';
import '../../services/favorites_service.dart';
import '../../widgets/app_section_header.dart';
import '../../widgets/empty_state_card.dart';
import '../../widgets/error_state_card.dart';
import '../../widgets/primary_action_button.dart';
import '../../widgets/skeleton_loader.dart';

class AiScreen extends StatefulWidget {
  const AiScreen({Key? key}) : super(key: key);

  @override
  State<AiScreen> createState() => _AiScreenState();
}

class _AiScreenState extends State<AiScreen> {
  final AiService _aiService = AiService();
  final FavoritesService _favoritesService = FavoritesService();
  final TextEditingController _questionController = TextEditingController();
  bool _loading = false;
  bool _savingFavorite = false;
  String? _error;
  AiAnswer? _answer;
  FavoriteItem? _savedFavorite;

  Future<void> _ask() async {
    final question = _questionController.text.trim();
    if (question.isEmpty) {
      setState(() {
        _answer = null;
        _error = null;
        _savedFavorite = null;
      });
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
      _savedFavorite = null;
    });

    try {
      final answer = await _aiService.ask(question);
      if (!mounted) return;
      setState(() => _answer = answer);
      if (!answer.isFallback) {
        await _syncSavedFavorite(answer.answer);
      }
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'AI is busy right now. Please try again.');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _syncSavedFavorite(String answerText) async {
    try {
      final favorites = await _favoritesService.getFavorites();
      if (!mounted) return;
      FavoriteItem? matched;
      for (final item in favorites) {
        final matches = item.type == FavoriteType.ai && item.text == answerText;
        if (matches) {
          matched = item;
          break;
        }
      }
      setState(() {
        _savedFavorite = matched;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _savedFavorite = null;
      });
    }
  }

  Future<void> _toggleSave() async {
    final answer = _answer;
    if (answer == null || answer.isFallback || _savingFavorite) {
      return;
    }

    setState(() {
      _savingFavorite = true;
    });

    try {
      if (_savedFavorite != null) {
        await _favoritesService.removeFavorite(_savedFavorite!.id);
        if (!mounted) return;
        setState(() {
          _savedFavorite = null;
        });
        _showSnackBar('Removed from favorites');
      } else {
        final favorite = await _favoritesService.addAiFavorite(answer.answer);
        if (!mounted) return;
        setState(() {
          _savedFavorite = favorite;
        });
        _showSnackBar('Saved to favorites');
      }
    } catch (_) {
      if (!mounted) return;
      _showSnackBar('Could not update favorites right now.');
    } finally {
      if (mounted) {
        setState(() {
          _savingFavorite = false;
        });
      }
    }
  }

  Future<void> _copyAnswer() async {
    final answer = _answer;
    if (answer == null) return;
    await Clipboard.setData(ClipboardData(text: answer.answer));
    if (!mounted) return;
    _showSnackBar('Answer copied');
  }

  Future<void> _shareAnswer() async {
    final answer = _answer;
    if (answer == null) return;
    await Share.share(
      'PlantSaathi AI answer:\n\n${answer.answer}\n\nQuestion: ${answer.question}',
    );
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  void dispose() {
    _questionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.xl),
      children: [
        const AppSectionHeader(
          title: 'AI plant assistant',
          subtitle: 'Ask care questions in a polished, conversational layout.',
          icon: Icons.chat_bubble_rounded,
        ),
        const SizedBox(height: 18),
        TextField(
          controller: _questionController,
          maxLines: 4,
          onChanged: (value) {
            if (value.trim().isEmpty && mounted) {
              setState(() {
                _answer = null;
                _error = null;
                _savedFavorite = null;
              });
            }
          },
          decoration: const InputDecoration(
            hintText: 'Ask about watering, sunlight, soil, or disease care...',
            alignLabelWithHint: true,
          ),
        ),
        const SizedBox(height: 14),
        PrimaryActionButton(
          label: 'Ask AI',
          onPressed: _ask,
          isLoading: _loading,
        ),
        const SizedBox(height: 18),
        if (_loading)
          const SkeletonAnswerCard()
        else if (_error != null)
          ErrorStateCard(message: _error!, onRetry: _ask)
        else if (_answer == null)
          const EmptyStateCard(
            title: 'Need a quick plant tip?',
            message: 'Try a question like "How often should I water a rose plant?"',
            icon: Icons.psychology_rounded,
          )
        else if (_answer!.isFallback)
          _FallbackAnswerCard(
            question: _answer!.question,
            onRetry: _ask,
          )
        else
          _AnswerCard(
            answer: _answer!,
            onCopy: _copyAnswer,
            onShare: _shareAnswer,
            onSave: _toggleSave,
            saved: _savedFavorite != null,
            saving: _savingFavorite,
          ),
      ],
    );
  }
}

class _FallbackAnswerCard extends StatelessWidget {
  final String question;
  final VoidCallback onRetry;

  const _FallbackAnswerCard({
    required this.question,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;

    return Container(
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
            'AI is a little busy',
            style: theme.textTheme.titleMedium?.copyWith(
              color: primary,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'The backend returned a fallback response for your question. You can retry in a moment or rephrase it for a faster answer.',
            style: theme.textTheme.bodyMedium?.copyWith(
              height: 1.5,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Question: $question',
            style: theme.textTheme.bodySmall?.copyWith(
              color: Colors.black54,
            ),
          ),
          const SizedBox(height: 14),
          TextButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded),
            label: const Text('Try again'),
          ),
        ],
      ),
    );
  }
}

class _AnswerCard extends StatelessWidget {
  final AiAnswer answer;
  final VoidCallback onCopy;
  final VoidCallback onShare;
  final VoidCallback onSave;
  final bool saved;
  final bool saving;

  const _AnswerCard({
    required this.answer,
    required this.onCopy,
    required this.onShare,
    required this.onSave,
    required this.saved,
    required this.saving,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;

    return Container(
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
            'Answer',
            style: theme.textTheme.titleMedium?.copyWith(
              color: primary,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            answer.answer,
            style: theme.textTheme.bodyLarge?.copyWith(
              height: 1.5,
              color: Colors.black87,
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
                onPressed: saving ? null : onSave,
                icon: saving
                    ? const SizedBox(
                        height: 16,
                        width: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Icon(saved ? Icons.bookmark_rounded : Icons.bookmark_add_outlined, size: 18),
                label: Text(saved ? 'Saved' : 'Save'),
                style: FilledButton.styleFrom(
                  backgroundColor: saved ? primary : null,
                  foregroundColor: saved ? Colors.white : null,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
