import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/widgets/widget_utils.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";

class TicketStatusUpdateDialog extends StatefulWidget{
  const TicketStatusUpdateDialog({super.key});
  @override
  State<TicketStatusUpdateDialog> createState() =>
      _TicketStatusUpdateDialogState();
}

class _TicketStatusUpdateDialogState extends State<TicketStatusUpdateDialog>{
  @override
  Widget build(BuildContext context) {
    return Dialog(
      insetPadding: EdgeInsets.symmetric(horizontal: 20.h),
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(35.h)),
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 30.h),
        height: 456.h,
        width: 374.h,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            getVerSpace(30.h),
            Expanded(
              child: Container(
                alignment: Alignment.center,
                // height: 171.h,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(35.h),
                    gradient: RadialGradient(
                        colors: [gradientFirst, gradientSecond, gradientFirst],
                        stops: const [0.0, 0.49, 1.0])),
                child: getSvgImage("update_done.svg",
                    width: 104.h, height: 104.h),
              ),
            ),
            getVerSpace(31.h),
            loginHeader("Updated Successfully",
                "You have successfully updated  \n Service Status!"),
            getVerSpace(40.h),
            getButton(context, basicColor, "Ok", Colors.white, () {}, 18.sp,
                weight: FontWeight.w700,
                buttonHeight: 60.h,
                borderRadius: BorderRadius.circular(22.h)),
            getVerSpace(30.h)
          ],
        ),
      ),
    );
  }
}
