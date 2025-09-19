import 'package:firedesk/res/colors/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ServerExceptionWidget extends StatefulWidget {
  final VoidCallback onPress;
  final String? error;
  const ServerExceptionWidget({super.key, required this.onPress, this.error});

  @override
  State<ServerExceptionWidget> createState() => _ServerExceptionWidgetState();
}

class _ServerExceptionWidgetState extends State<ServerExceptionWidget> {
  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          SizedBox(
            height: height * .15,
          ),
          Icon(
            Icons.cloud_off,
            color: redColor,
            size: 50,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 30),
            child: Center(
              child: Text(
                (widget.error != null && widget.error!.isNotEmpty)
                    ? widget.error.toString()
                    : "we are getting some problem in server and our team is working on it",
                textAlign: TextAlign.center,
              ),
            ),
          ),
          SizedBox(
            height: height * .15,
          ),
          InkWell(
            onTap: widget.onPress,
            child: Container(
              height: 44.h,
              width: 160.w,
              decoration: BoxDecoration(
                color: basicColor,
                borderRadius: BorderRadius.circular(50),
              ),
              child: Center(
                  child: Text(
                'Retry',
                style: Theme.of(context)
                    .textTheme
                    .titleMedium!
                    .copyWith(color: Colors.white),
              )),
            ),
          )
        ],
      ),
    );
  }
}
