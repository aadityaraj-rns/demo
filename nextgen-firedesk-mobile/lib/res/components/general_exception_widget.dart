import 'package:firedesk/res/colors/colors.dart';
import 'package:flutter/material.dart';

class GeneralExceptionWidget extends StatefulWidget {
  final String? error;
  final VoidCallback onPress;
  const GeneralExceptionWidget({super.key, required this.onPress, this.error});

  @override
  State<GeneralExceptionWidget> createState() => _GeneralExceptionWidgetState();
}

class _GeneralExceptionWidgetState extends State<GeneralExceptionWidget> {
  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          // SizedBox(
          //   height: height * .15,
          // ),
          Icon(
            Icons.cloud_off,
            color: redColor,
            size: 50,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 30),
            child: Center(
              child: Text(
                widget.error != null
                    ? "${widget.error}"
                    : " we are facing some issue and our team is currently working on it, we will fix it soon",
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
              height: 44,
              width: 160,
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
