import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

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
    final primary = theme.colorScheme.primary;
    final errorColor = theme.colorScheme.error;
    final accent = errorColor.withOpacity(0.12);

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
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 18,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: accent,
              borderRadius: BorderRadius.circular(18),
            ),
            child: Icon(
              getErrorIcon(),
              color: errorColor,
              size: 30,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.black87,
              height: 1.4,
            ),
          ),
          if (onRetry != null && !isLoading) ...[
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  HapticFeedback.lightImpact();
                  onRetry!();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: Text(
                  getRetryText(),
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          ],
          if (isLoading) ...[
            const SizedBox(height: 16),
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4CAF50)),
              ),
            ),
          ],
          if (errorType == ErrorType.network || errorType == ErrorType.timeout) ...[
            const SizedBox(height: 12),
            Text(
              'Tip: Check your connection and ensure you have a stable internet connection.',
              style: theme.textTheme.bodySmall?.copyWith(
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );
  }
}
