import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/utils/snack_bar_utils.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:geolocator/geolocator.dart";

void showCameraDisabledDialog(BuildContext context) {
  showDialog(
    context: context,
    builder: (context) {
      return Dialog(
        insetPadding: EdgeInsets.symmetric(horizontal: 20.h),
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(35.h),
        ),
        child: Container(
          margin: EdgeInsets.symmetric(horizontal: 30.h),
          height: 456.h,
          width: 374.h,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(height: 30.h),
              Expanded(
                child: Container(
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(35.h),
                    color: basicColor.withOpacity(0.1),
                  ),
                  child: Image.asset(
                    "assets/images/camera_disabled.png",
                    width: 200.w,
                    height: 200.h,
                  ),
                ),
              ),
              SizedBox(height: 20.h),
              Text(
                "Camera Permission Disabled",
                style: TextStyle(
                  fontSize: 20.sp,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 8.h),
              Text(
                "Please enable camera permission to access this feature.",
                style: TextStyle(
                  fontSize: 16.sp,
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 30.h),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.grey),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(22.h),
                        ),
                      ),
                      child: Text(
                        "Cancel",
                        style: TextStyle(
                          fontSize: 16.sp,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 16.h),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        Navigator.of(context).pop();
                        await Geolocator.openAppSettings();
                      },
                      icon: Icon(
                        Icons.settings,
                        color: Colors.white,
                        size: 20.sp,
                      ),
                      label: Text(
                        "Open Settings",
                        style: TextStyle(
                          fontSize: 16.sp,
                          color: Colors.white,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF96D00),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(22.h),
                        ),
                        padding: EdgeInsets.symmetric(vertical: 5.h),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 30.h),
            ],
          ),
        ),
      );
    },
  );

  // Display a toast message after the dialog is shown
  Future.delayed(Duration.zero, () {
    SnackBarUtils.toastMessage(
      "Camera permission is permanently denied. Please enable it from settings.",
    );
  });
}
