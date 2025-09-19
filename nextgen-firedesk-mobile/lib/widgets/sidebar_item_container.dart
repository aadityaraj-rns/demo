import "package:firedesk/res/colors/colors.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";

Widget sideBarItemContainer(String text, IconData icon,
    {VoidCallback? callback}) {
  return GestureDetector(
    onTap: () {
      if (callback != null) {
        callback();
      }
    },
    child: Container(
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Colors.grey,
            width: 0.5,
          ),
        ),
      ),
      padding: EdgeInsets.symmetric(horizontal: 0.w, vertical: 7.h),
      margin: EdgeInsets.symmetric(horizontal: 8.w, vertical: 1.h),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 18.r,
                backgroundColor: darkGreyColor.withOpacity(0.8),
                child: Icon(
                  icon,
                  size: 20.dg,
                  color: Colors.white,
                ),
              ),
              SizedBox(width: 20.0.w),
              Text(
                text,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w300,
                  fontFamily: "Poppins",
                  color: darkGreyColor,
                ),
              ),
            ],
          ),
          // Icon(
          //   Icons.arrow_forward_ios,
          //   size: 20,
          //   color: basicColor.withOpacity(0.6),
          // )
        ],
      ),
    ),
  );
}
