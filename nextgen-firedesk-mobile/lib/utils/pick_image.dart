import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';

Future<XFile?> pickImage(ImageSource source) async {
  final imagePicked = await ImagePicker().pickImage(source: source);
  if (imagePicked == null) {
    if (kDebugMode) {
      debugPrint("Image picking canceled");
    }
    return null;
  } else {
    if (kDebugMode) {
      debugPrint("Image picked successfully and assigned");
    }
    return imagePicked;
  }
}
