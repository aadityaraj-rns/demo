import "package:firedesk/res/colors/colors.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";

void showLocationVerificationDialog(
  BuildContext context,
  VoidCallback onContinue,
  VoidCallback onwillpop,
  String message, {
  bool isCancel = false,
  VoidCallback? onCancel,
}) {
  showDialog(
    context: context,
    builder: (context) {
      return WillPopScope(
        onWillPop: () async {
          onwillpop();
          return false;
        },
        child: Dialog(
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
                      "assets/images/location_update.png",
                      width: 200.w,
                      height: 200.h,
                    ),
                  ),
                ),
                SizedBox(height: 20.h),
                Text(
                  "Location Verification",
                  style: TextStyle(
                    fontSize: 20.sp,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 8.h),
                Text(
                  message,
                  style: TextStyle(
                    fontSize: 16.sp,
                    color: Colors.grey[600],
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 30.h),
                Row(
                  mainAxisAlignment: isCancel
                      ? MainAxisAlignment.spaceBetween
                      : MainAxisAlignment.center,
                  children: [
                    isCancel
                        ? Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () {
                                Navigator.of(context, rootNavigator: true)
                                    .pop();
                              },
                              label: Text(
                                "Cancel",
                                style: TextStyle(
                                  fontSize: 16.sp,
                                  color: Colors.black,
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                elevation: 0, // Optional: remove shadow
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(22.h),
                                  side: BorderSide(
                                    color: Colors
                                        .grey.shade300, // Light grey border
                                    width: 1.5,
                                  ),
                                ),
                                padding: EdgeInsets.symmetric(
                                    vertical: 5.h, horizontal: 30.w),
                              ),
                            ),
                          )
                        : SizedBox.shrink(),
                    SizedBox(
                      width: isCancel ? 10.w : 0.w,
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        print("continue button clicked");
                        Navigator.of(context, rootNavigator: true)
                            .pop(); // Close the dialog
                        // Future.delayed(Duration(milliseconds: 200), () {
                        onContinue(); // Call the callback after dialog is dismissed
                        // });
                      },
                      icon: Icon(
                        Icons.arrow_right,
                        color: Colors.white,
                        size: 20.sp,
                      ),
                      label: Text(
                        "Continue",
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
                        padding: EdgeInsets.symmetric(
                            vertical: 5.h, horizontal: 30.w),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 30.h),
              ],
            ),
          ),
        ),
      );
    },
  );
}
