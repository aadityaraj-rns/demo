import 'package:firedesk/res/colors/colors.dart';
import 'package:flutter/material.dart';

class RequestTimeOutWidget extends StatefulWidget {
  final VoidCallback onPress;
  const RequestTimeOutWidget({super.key, required this.onPress});

  @override
  State<RequestTimeOutWidget> createState() => _RequestTimeOutWidgetState();
}

class _RequestTimeOutWidgetState extends State<RequestTimeOutWidget> {
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
          const Padding(
            padding: EdgeInsets.only(top: 30),
            child: Center(
              child: Text(
                "Request time out , please try again",
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
