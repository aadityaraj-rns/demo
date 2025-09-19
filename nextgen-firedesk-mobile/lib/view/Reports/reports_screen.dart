import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(
            Icons.arrow_back,
            color: Colors.white,
          ),
        ),
        backgroundColor: basicColor,
        title: Text(
          "Reports",
          style: appBarTextSTyle,
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search',
                border: UnderlineInputBorder(
                  borderSide: BorderSide(color: basicColor, width: 1),
                ),
                enabledBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.grey, width: 1.5),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: basicColor, width: 2),
                ),
                suffixIcon: Icon(Icons.search, color: basicColor),
              ),
              onChanged: (value) {},
            ),
          ),
          const Expanded(child: ReportImageContainerList())
        ],
      ),
    );
  }
}

Widget reportImageContainer() {
  return Container(
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(8.0),
      image: const DecorationImage(
        image: AssetImage("assets/images/report.jpg"),
        fit: BoxFit.fill,
      ),
    ),
    width: 200.w,
    height: 280.h,
  );
}

class ReportImageContainerList extends StatelessWidget {
  const ReportImageContainerList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 10,
      itemBuilder: (context, index) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 10.h, horizontal: 20.w),
          child: reportImageContainer(),
        );
      },
    );
  }
}
