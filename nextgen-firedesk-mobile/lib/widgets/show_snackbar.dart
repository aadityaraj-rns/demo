import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/styles/text_styles.dart";
import "package:firedesk/view_models/providers/scaffold_messenger_provider.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:provider/provider.dart";

void showCustomSnackBar(BuildContext context, String text) {
  final overlay = Overlay.of(context);

  final animationController = AnimationController(
    vsync: Navigator.of(context),
    duration: const Duration(milliseconds: 500),
  );
  final fadeAnimation = CurvedAnimation(
    parent: animationController,
    curve: Curves.easeInOut,
  );

  final overlayEntry = OverlayEntry(
    builder: (context) {
      return Positioned(
        bottom: 20.0,
        left: 20.0,
        right: 20.0,
        child: FadeTransition(
          opacity: fadeAnimation,
          child: Container(
            constraints: BoxConstraints(
              minHeight: 30.h,
              minWidth: 200.0,
              maxWidth: MediaQuery.of(context).size.width * 0.9,
            ),
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
            decoration: BoxDecoration(
              color: basicColor, // SnackBar background color
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: Text(
              text,
              style: mWhiteTextStyle,
              textAlign: TextAlign.center,
            ),
          ),
        ),
      );
    },
  );

  overlay.insert(overlayEntry);

  // Animate the fade-in
  animationController.forward();

  // Auto close after 350 milliseconds
  Future.delayed(const Duration(milliseconds: 3000), () {
    animationController.reverse().then((_) {
      overlayEntry.remove(); // Remove the overlay
      animationController.dispose(); // Dispose of the controller
    });
  });
}

void showCustomSnackBarWithCloseIcon(BuildContext context, String text) {
  final scaffoldMessengerProvider =
      Provider.of<ScaffoldMessengerProvider>(context, listen: false);

  final snackBar = SnackBar(
    content: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            text,
            style: const TextStyle(color: Colors.white),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () {
            scaffoldMessengerProvider.scaffoldMessengerKey.currentState
                ?.hideCurrentSnackBar();
          },
        ),
      ],
    ),
    backgroundColor: basicColor,
    behavior: SnackBarBehavior.floating,
    duration: const Duration(days: 365), // Set to a long duration
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(10),
    ),
  );

  // Show the SnackBar using the global key
  scaffoldMessengerProvider.scaffoldMessengerKey.currentState
      ?.showSnackBar(snackBar);
}
