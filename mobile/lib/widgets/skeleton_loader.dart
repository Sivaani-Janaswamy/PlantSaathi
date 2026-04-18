import 'package:flutter/material.dart';

class SkeletonBox extends StatefulWidget {
  final double? width;
  final double? height;
  final BorderRadiusGeometry borderRadius;

  const SkeletonBox({
    Key? key,
    this.width,
    this.height,
    this.borderRadius = const BorderRadius.all(Radius.circular(16)),
  }) : super(key: key);

  @override
  State<SkeletonBox> createState() => _SkeletonBoxState();
}

class _SkeletonBoxState extends State<SkeletonBox>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final value = 0.10 + (_controller.value * 0.08);
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            color: Colors.black.withAlpha((value * 255).round()),
            borderRadius: widget.borderRadius,
          ),
        );
      },
    );
  }
}

class SkeletonLine extends StatelessWidget {
  final double widthFactor;
  final double height;

  const SkeletonLine({
    Key? key,
    this.widthFactor = 1,
    this.height = 14,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FractionallySizedBox(
      widthFactor: widthFactor,
      child: SkeletonBox(
        height: height,
        borderRadius: BorderRadius.circular(999),
      ),
    );
  }
}

class SkeletonPlantCard extends StatelessWidget {
  const SkeletonPlantCard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 16,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          const SkeletonBox(width: 60, height: 60),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                SkeletonLine(widthFactor: 0.72),
                SizedBox(height: 8),
                SkeletonLine(widthFactor: 0.52, height: 12),
              ],
            ),
          ),
          const SizedBox(width: 12),
          const SkeletonBox(width: 28, height: 28, borderRadius: BorderRadius.all(Radius.circular(10))),
        ],
      ),
    );
  }
}

class SkeletonAnswerCard extends StatelessWidget {
  const SkeletonAnswerCard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 16,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SkeletonLine(widthFactor: 0.32),
          SizedBox(height: 14),
          SkeletonLine(),
          SizedBox(height: 10),
          SkeletonLine(widthFactor: 0.92),
          SizedBox(height: 10),
          SkeletonLine(widthFactor: 0.78),
        ],
      ),
    );
  }
}

class SkeletonHeader extends StatelessWidget {
  const SkeletonHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 22, 20, 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SkeletonBox(width: 48, height: 48),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SkeletonLine(widthFactor: 0.56, height: 18),
                SizedBox(height: 10),
                SkeletonLine(),
                SizedBox(height: 8),
                SkeletonLine(widthFactor: 0.88),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class SkeletonProfileCard extends StatelessWidget {
  const SkeletonProfileCard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SkeletonLine(widthFactor: 0.28),
          SizedBox(height: 8),
          SkeletonLine(widthFactor: 0.76),
          SizedBox(height: 12),
          SkeletonBox(width: double.infinity, height: 48),
        ],
      ),
    );
  }
}
