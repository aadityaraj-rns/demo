import 'dart:async';

import 'package:firedesk/res/colors/colors.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class SnackBarUtils {
  static final List<Completer<void>> _activeToasts = [];

  static void toastMessage(String message) {
    const int toastDurationInSeconds = 7;
    const int flutterToastDuration = 3;
    final int repeatCount =
        (toastDurationInSeconds / flutterToastDuration).ceil();

    for (int i = 0; i < repeatCount; i++) {
      final completer = Completer<void>();
      _activeToasts.add(completer);

      Future.delayed(Duration(seconds: i * flutterToastDuration), () {
        if (!completer.isCompleted) {
          Fluttertoast.showToast(
            msg: message,
            backgroundColor: AppColor.blackColor,
            textColor: AppColor.whiteColor,
            gravity: ToastGravity.BOTTOM,
            toastLength: Toast.LENGTH_LONG,
          );
          completer.complete();
        }
      });
    }
  }

  static void cancelToasts() {
    for (final completer in _activeToasts) {
      if (!completer.isCompleted) {
        completer.complete();
      }
    }

    _activeToasts.clear();
    Fluttertoast.cancel();
  }

  static toastMessageCenter(String message) {
    Fluttertoast.showToast(
      msg: message,
      backgroundColor: AppColor.blackColor,
      gravity: ToastGravity.CENTER,
      toastLength: Toast.LENGTH_LONG,
      textColor: AppColor.whiteColor,
    );
  }

  static void snackBar(BuildContext context, String title, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 4),
            Text(message),
          ],
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }
}
