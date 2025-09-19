import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";


Widget bigServiceCardShimmer(BuildContext context) {
  return Card(
    color: Colors.white,
    elevation: 2,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    margin: EdgeInsets.symmetric(vertical: 5.h, horizontal: 8.w),
    child: Padding(
      padding: EdgeInsets.all(8.w),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 100.w,
                height: 100.h,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.blueGrey.withOpacity(0.1)),
                  color: Colors.grey[300],
                ),
              ),
              SizedBox(width: 16.w),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          width: 120.w,
                          height: 16.h,
                          color: Colors.grey[300],
                        ),
                        CircleAvatar(
                          backgroundColor: Colors.grey[300],
                          radius: 6,
                        ),
                      ],
                    ),
                    SizedBox(height: 4.h),
                    Row(
                      children: [
                        Icon(
                          Icons.home,
                          color: Colors.grey[300],
                          size: 15,
                        ),
                        SizedBox(width: 5.w),
                        Container(
                          width: 80.w,
                          height: 14.h,
                          color: Colors.grey[300],
                        ),
                      ],
                    ),
                    SizedBox(height: 4.h),
                    Container(
                      width: double.infinity,
                      height: 40.h,
                      color: Colors.grey[300],
                    ),
                    SizedBox(height: 8.h),
                    Row(
                      children: [
                        Icon(Icons.calendar_today,
                            color: Colors.grey[300], size: 16),
                        SizedBox(width: 4.w),
                        Container(
                          width: 120.w,
                          height: 14.h,
                          color: Colors.grey[300],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 8.h),
          Container(
            color: Colors.grey[50],
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  width: 60.w,
                  height: 24.h,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                SizedBox(
                  width: 10.w,
                ),
                Container(
                  width: 70.w,
                  height: 24.h,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}
