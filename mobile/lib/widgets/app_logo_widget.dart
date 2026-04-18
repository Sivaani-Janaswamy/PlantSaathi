import 'package:flutter/material.dart';

class AppLogoWidget extends StatelessWidget {
  final double size;
  final EdgeInsetsGeometry? margin;
  const AppLogoWidget({Key? key, this.size = 100, this.margin}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin ?? const EdgeInsets.only(bottom: 16),
      child: Image.asset(
        'assets/main_icon.png',
        width: size,
        height: size,
        fit: BoxFit.cover,
      ),
    );
  }
}
