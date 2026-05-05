import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../core/design_tokens.dart';

enum ErrorType {
  network,
  timeout,
  authentication,
  validation,
  serverError,
  unknown,
  rateLimit,
  configuration
}

class ErrorStateCard extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;
  final ErrorType? errorType;
  final bool isLoading;

  const ErrorStateCard({
    Key? key,
    required this.message,
    this.onRetry,
    this.errorType,
    this.isLoading = false,
  }) : super(key: key);

  factory ErrorStateCard.network({
    Key? key,
    required VoidCallback onRetry,
    bool isLoading = false,
  }) {
    return ErrorStateCard(
      key: key,
      message: 'Network connection failed. Please check your internet connection and try again.',
      onRetry: onRetry,
      errorType: ErrorType.network,
      isLoading: isLoading,
    );
  }

  factory ErrorStateCard.timeout({
    Key? key,
    required VoidCallback onRetry,
    bool isLoading = false,
  }) {
    return ErrorStateCard(
      key: key,
      message: 'Request timed out. The service is taking longer than expected. Please try again.',
      onRetry: onRetry,
      errorType: ErrorType.timeout,
      isLoading: isLoading,
    );
  }

  factory ErrorStateCard.authentication({
    Key? key,
    required VoidCallback onRetry,
    bool isLoading = false,
  }) {
    return ErrorStateCard(
      key: key,
      message: 'Authentication failed. Please sign in again to continue.',
      onRetry: onRetry,
      errorType: ErrorType.authentication,
      isLoading: isLoading,
    );
  }

  factory ErrorStateCard.validation({
    Key? key,
    String? customMessage,
    bool isLoading = false,
  }) {
    return ErrorStateCard(
      key: key,
      message: customMessage ?? 'Invalid input. Please check your information and try again.',
      errorType: ErrorType.validation,
      isLoading: isLoading,
    );
  }

  factory ErrorStateCard.serverError({
    Key? key,
    required VoidCallback onRetry,
    bool isLoading = false,
  }) {
    return ErrorStateCard(
      key: key,
      message: 'Server is temporarily unavailable. Our team has been notified. Please try again later.',
      onRetry: onRetry,
      errorType: ErrorType.serverError,
      isLoading: isLoading,
    );
  }

  factory ErrorStateCard.rateLimit({
    Key? key,
    bool isLoading = false,
  }) {
    return ErrorStateCard(
      key: key,
      message: 'Too many requests. Please wait a moment and try again.',
      errorType: ErrorType.rateLimit,
      isLoading: isLoading,
    );
  }

  factory ErrorStateCard.configuration({
    Key? key,
    bool isLoading = false,
  }) {
    return ErrorStateCard(
      key: key,
      message: 'Service configuration error. Please contact support if this persists.',
      errorType: ErrorType.configuration,
      isLoading: isLoading,
    );
  }

  factory ErrorStateCard.unknown({
    Key? key,
    required VoidCallback onRetry,
    bool isLoading = false,
  }) {
    return ErrorStateCard(
      key: key,
      message: 'An unexpected error occurred. Please try again.',
      onRetry: onRetry,
      errorType: ErrorType.unknown,
      isLoading: isLoading,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final errorColor = theme.colorScheme.error;
    final accent = errorColor.withValues(alpha: 0.12);

    IconData getErrorIcon() {
      switch (errorType) {
        case ErrorType.network:
          return Icons.wifi_off;
        case ErrorType.timeout:
          return Icons.timer_off;
        case ErrorType.authentication:
          return Icons.lock;
        case ErrorType.validation:
          return Icons.error_outline;
        case ErrorType.serverError:
          return Icons.cloud_off;
        case ErrorType.rateLimit:
          return Icons.speed;
        case ErrorType.configuration:
          return Icons.settings;
        case ErrorType.unknown:
        default:
          return Icons.error_outline;
      }
    }

    String getRetryText() {
      switch (errorType) {
        case ErrorType.authentication:
          return 'Sign in again';
        case ErrorType.rateLimit:
          return 'Try again later';
        default:
          return 'Try again';
      }
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: accent,
              borderRadius: BorderRadius.circular(AppRadius.sm),
            ),
            child: Icon(
              getErrorIcon(),
              color: errorColor,
              size: 30,
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            message,
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyMedium?.copyWith(
              height: 1.4,
            ),
          ),
          if (onRetry != null && !isLoading) ...[
            const SizedBox(height: AppSpacing.lg),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  HapticFeedback.lightImpact();
                  onRetry!();
                },
                child: Text(
                  getRetryText(),
                  style: theme.textTheme.labelLarge,
                ),
              ),
            ),
          ],
          if (isLoading) ...[
            const SizedBox(height: AppSpacing.lg),
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
              ),
            ),
          ],
          if (errorType == ErrorType.network || errorType == ErrorType.timeout) ...[
            const SizedBox(height: AppSpacing.md),
            Text(
              'Tip: Check your connection and ensure you have a stable internet connection.',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );
  }
}
