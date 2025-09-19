import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/view_models/providers/user_provider.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:permission_handler/permission_handler.dart";
import "package:provider/provider.dart";

void showNotificationPermissionRequestDialog(
    BuildContext context, String headingText, String messageText) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return Consumer<AuthenticationProvider>(
          builder: (context, authProvider, _) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12.0),
              color: Colors.white,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  headingText,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 16),
                Text(
                  messageText,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                  textAlign: TextAlign.left,
                ),
                const SizedBox(height: 24),
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: basicColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      padding:
                          EdgeInsets.symmetric(vertical: 6.0, horizontal: 30.w),
                    ),
                    onPressed: () {
                      openAppSettings();
                      Navigator.pop(context);
                    },
                    child: const Text(
                      'Open',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      });
    },
  );
}
