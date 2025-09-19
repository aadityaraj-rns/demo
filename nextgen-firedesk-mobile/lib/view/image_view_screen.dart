import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/styles/text_style.dart';
import "package:flutter/material.dart";
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ImageViewScreen extends StatefulWidget {
  final String? imageName;
  final String? imagePath;
  const ImageViewScreen({
    super.key,
    required this.imageName,
    required this.imagePath,
  });
  @override
  State<ImageViewScreen> createState() => _ImageViewScreenState();
}

class _ImageViewScreenState extends State<ImageViewScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: basicColor,
        title: Text(
          "Image View",
          style: appBarTextSTyle,
        ),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(Icons.arrow_back),
          color: Colors.white,
        ),
      ),
      body: widget.imageName != null
          ? Center(
              child: Hero(
                tag: 'image-tag',
                child: InteractiveViewer(
                  minScale: 0.4,
                  maxScale: 3,
                  child: Image.network(
                    "${widget.imagePath}",
                    height: 600.h,
                    width: 380.w,
                    fit: BoxFit.fill,
                  ),
                ),
              ),
            )
          : widget.imagePath != null
              ? Center(
                  child: Hero(
                    tag: 'image-tag',
                    child: InteractiveViewer(
                      minScale: 0.4,
                      maxScale: 3,
                      child: Image.network(
                        "${widget.imagePath}",
                        height: 400.h,
                        width: 370.w,
                        fit: BoxFit.fill,
                      ),
                    ),
                  ),
                )
              : Center(
                  child: Container(),
                ),
    );
  }
}