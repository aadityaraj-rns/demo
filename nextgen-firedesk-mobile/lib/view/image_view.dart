import 'package:firedesk/res/styles/text_style.dart';
import 'package:flutter/material.dart';

class ImageViewScreen2 extends StatelessWidget {
  final String imageUrl;
  final String? name;

  const ImageViewScreen2({
    super.key,
    required this.imageUrl,
    this.name,
  });

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.close,
            color: Colors.white,
          ),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ),
      body: Center(
        child: Hero(
          tag: imageUrl,
          child: Image.network(
            imageUrl,
            fit: BoxFit.contain,
          ),
        ),
      ),
      bottomNavigationBar: Text(
        name ?? "",
        style: normalWhiteTextStyle,
        textAlign: TextAlign.center,
      ),
    );
  }
}
