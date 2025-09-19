import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:lottie/lottie.dart';

class ApprovalPendingScreen extends StatefulWidget {
  final int index;
  const ApprovalPendingScreen({super.key, required this.index});

  @override
  State<ApprovalPendingScreen> createState() => _ApprovalPendingScreenState();
}

class _ApprovalPendingScreenState extends State<ApprovalPendingScreen> {
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        Navigator.popUntil(
          context,
          ModalRoute.withName(AppRoutes.bottombar),
        );
        return false;
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: basicColor,
          centerTitle: true,
          title: Text(
            widget.index == 0 ? "Service Submitted" : "Ticket Submitted",
            style: appBarTextSTyle,
          ),
          automaticallyImplyLeading: false,
        ),
        body: Center(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 10.w),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Transform.scale(
                  scale: 2,
                  child: Lottie.asset("assets/jsons/approval_pending2.json",
                      height: 200.h, width: 150.w),
                ),
                SizedBox(
                  height: 30.h,
                ),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20.w),
                  child: Text(
                    "You have successfully submitted the ${widget.index == 0 ? "Service" : "Ticket"},please wait the manager will make the approval",
                    style: normalTextSTyle1,
                    textAlign: TextAlign.center,
                  ),
                ),
                SizedBox(
                  height: 60.h,
                ),
                buildOkayButton(context),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget buildOkayButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.popUntil(
          context,
          ModalRoute.withName(AppRoutes.bottombar),
        );
      },
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 30.w),
        height: 50.h,
        width: double.infinity,
        decoration: BoxDecoration(
          color: basicColor,
          borderRadius: BorderRadius.circular(25.r),
        ),
        child: Center(
          child: Text(
            "Okay",
            style: TextStyle(
              color: Colors.white,
              fontSize: 18.sp,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}
