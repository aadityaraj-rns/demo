import "package:firedesk/res/colors/colors.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";

void showLatLongUpdateDialog(
  BuildContext context,
  VoidCallback onUpdate,
  VoidCallback onwillpop,
) {
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
                  "Location Update",
                  style: TextStyle(
                    fontSize: 20.sp,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 8.h),
                Text(
                  "by accepting this the current location with Latitude and Longitude will be updated as location of the asset",
                  style: TextStyle(
                    fontSize: 16.sp,
                    color: Colors.grey[600],
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 30.h),
                ElevatedButton.icon(
                  onPressed: () async {
                    onUpdate();
                    Navigator.pop(context);
                  },
                  icon: Icon(
                    Icons.location_on,
                    color: Colors.white,
                    size: 20.sp,
                  ),
                  label: Text(
                    "Update",
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
                    padding:
                        EdgeInsets.symmetric(vertical: 5.h, horizontal: 30.w),
                  ),
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
