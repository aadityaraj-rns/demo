import 'package:cached_network_image/cached_network_image.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/view/image_view_screen.dart';
import 'package:firedesk/widgets/widget_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:gap/gap.dart';

class AssetMaintainanceHistory2 extends StatefulWidget {
  const AssetMaintainanceHistory2({super.key});
  @override
  State<AssetMaintainanceHistory2> createState() =>
      _AssetMaintainanceHistory2State();
}

class _AssetMaintainanceHistory2State extends State<AssetMaintainanceHistory2> {
  int _current = 0;
  final List<String> imgList = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBRSo4AR3zCQWU6TtrLkNtkkuqaWEr1VJr3r87smVtyAwcyj9qDmJpQ9gfOQI5PDWFgoYM&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3m7hXWXDgM8xpHnQtoGojwG8cWFKsb2yG1Q&s',
    'https://www.shutterstock.com/image-vector/graphic-flat-design-drawing-red-260nw-2288982215.jpg',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            actions: const [],
            expandedHeight: 300.h,
            leading: IconButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                icon: const Icon(
                  Icons.arrow_back,
                  color: Colors.white,
                )),
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                "Service Details",
                style: appBarTextSTyle,
              ),
              centerTitle: false,
              collapseMode: CollapseMode.parallax,
              expandedTitleScale: 1.2,
              background: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ImageViewScreen(
                        imageName: "fire2.jpg",
                        imagePath: null,
                      ),
                    ),
                  );
                },
                child: CarouselSlider(
                  options: CarouselOptions(
                    height: 400.h,
                    enableInfiniteScroll: false,
                    viewportFraction: 2,
                    autoPlay: false,
                    enlargeCenterPage: true,
                    onPageChanged: (index, reason) {
                      setState(() {
                        _current = index;
                      });
                    },
                  ),
                  items: imgList.map((imgUrl) {
                    return Builder(
                      builder: (BuildContext context) {
                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ImageViewScreen(
                                  imageName: null,
                                  imagePath: imgList[_current],
                                ),
                              ),
                            );
                          },
                          child: Hero(
                            tag: "image-tag",
                            child: SizedBox(
                              width: MediaQuery.of(context).size.width,
                              child: Stack(
                                children: [
                                  CachedNetworkImage(
                                    height: 400.h,
                                    imageUrl: imgUrl,
                                    fit: BoxFit.fill,
                                    width: double.infinity,
                                  ),
                                  Align(
                                    alignment: Alignment.bottomRight,
                                    child: Padding(
                                      padding: EdgeInsets.only(
                                          right: 20.w, bottom: 10.h),
                                      child: Text(
                                        "${_current + 1}/${imgList.length}",
                                        style: const TextStyle(
                                            color: Colors.white, fontSize: 22),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    );
                  }).toList(),
                ),
              ),
            ),
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(20.0),
                bottomRight: Radius.circular(20.0),
              ),
            ),
            backgroundColor: basicColor,
            pinned: true,
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                return _ticketInfo();
              },
              childCount: 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _ticketInfo() {
    return SingleChildScrollView(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Material(
            elevation: 20,
            borderRadius: BorderRadius.only(
                topLeft: Radius.circular(40.r),
                topRight: Radius.circular(40.r)),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(40.r),
                    topRight: Radius.circular(40.r)),
              ),
              child: SingleChildScrollView(
                child: Column(children: [
                  getVerSpace(10.h),
                  const Text(
                    "Service Information",
                    style: TextStyle(
                      color: Colors.blue,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.0.w),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Gap(15.h),
                        Text(
                          'AssetId :100',
                          style: normalTextSTyle1,
                        ),
                        Gap(5.h),
                        Text(
                          'Service No : 10',
                          style: normalTextSTyle2,
                        ),
                        SizedBox(height: 10.0.h),
                        Text("Ticket Title",
                            style: notificationHeadingTextSTyle),
                        Gap(3.h),
                        Text("Title", style: normalTextSTyle2),
                        SizedBox(height: 10.0.h),
                        Text("Ticket Status",
                            style: notificationHeadingTextSTyle),
                        Gap(3.h),
                        Text("Status ", style: normalTextSTyle2),
                        SizedBox(height: 10.0.h),
                        Text("Description",
                            style: notificationHeadingTextSTyle),
                        Gap(10.h),
                        Text(
                          "Ticket Description Ticket Description Ticket Descrition Ticket Description Ticket Description Ticket Descrition Ticket Description Ticket Description Ticket Descrition Ticket Description Ticket Description Ticket Descrition",
                          style: normalTextSTyle2,
                        ),
                        Gap(30.h),
                      ],
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.0.w),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Gap(15.h),
                        Text(
                          'AssetId :100',
                          style: normalTextSTyle1,
                        ),
                        Gap(5.h),
                        Text(
                          'Service No : 10',
                          style: normalTextSTyle2,
                        ),
                        SizedBox(height: 10.0.h),
                        Text("Ticket Title",
                            style: notificationHeadingTextSTyle),
                        Gap(3.h),
                        Text("Title", style: normalTextSTyle2),
                        SizedBox(height: 10.0.h),
                        Text("Ticket Status",
                            style: notificationHeadingTextSTyle),
                        Gap(3.h),
                        Text("Status ", style: normalTextSTyle2),
                        SizedBox(height: 10.0.h),
                        Text("Description",
                            style: notificationHeadingTextSTyle),
                        Gap(10.h),
                        Text(
                          "Ticket Description Ticket Description Ticket Descrition Ticket Description Ticket Description Ticket Descrition Ticket Description Ticket Description Ticket Descrition Ticket Description Ticket Description Ticket Descrition",
                          style: normalTextSTyle2,
                        ),
                        Gap(30.h),
                      ],
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.0.w),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Gap(15.h),
                        SizedBox(height: 10.0.h),
                        Text("Ticket Title",
                            style: notificationHeadingTextSTyle),
                        Gap(3.h),
                        Text("Title", style: normalTextSTyle2),
                        SizedBox(height: 10.0.h),
                        Text("Ticket Status",
                            style: notificationHeadingTextSTyle),
                        Gap(3.h),
                        Text("Status ", style: normalTextSTyle2),
                        SizedBox(height: 10.0.h),
                        Text("Description",
                            style: notificationHeadingTextSTyle),
                        Gap(10.h),
                        Text(
                          "Ticket Description Ticket Description Ticket Descrition Ticket Description Ticket Description Ticket Descrition Ticket Description Ticket Description Ticket Descrition Ticket Description Ticket Description Ticket Descrition",
                          style: normalTextSTyle2,
                        ),
                        Gap(30.h),
                      ],
                    ),
                  ),
                ]),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget ticketInformationContainer() {
    return Material(
      elevation: 4,
      // shadowColor: Color.gre,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20.r),
        ),
        child: Column(
          children: [
            Text(
              'AssetId :100',
              style: normalTextSTyle1,
            ),
            Gap(5.h),
            Text(
              'Service No : 10',
              style: normalTextSTyle2,
            ),
          ],
        ),
      ),
    );
  }
}
