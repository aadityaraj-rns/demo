import "package:firedesk/res/assets/image_path.dart";
import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/res/styles/text_style.dart";
import "package:firedesk/widgets/widget_utils.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:gap/gap.dart";
import "package:lottie/lottie.dart";

class AssetMaintainanceHistory extends StatefulWidget {
  const AssetMaintainanceHistory({super.key});

  @override
  State<AssetMaintainanceHistory> createState() =>
      _AssetMaintainanceHistoryState();
}

class _AssetMaintainanceHistoryState extends State<AssetMaintainanceHistory>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(45.h),
        child: Material(
          elevation: 2,
          child: AppBar(
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
              automaticallyImplyLeading: false,
              title: Text(
                "Asset Maintainance",
                style: appBarTextSTyle,
              ),
              centerTitle: true,
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.only(
                    // bottomLeft: Radius.circular(20.0),
                    // bottomRight: Radius.circular(20.0),
                    ),
              ),
              actions: const []),
        ),
      ),
      // body: SingleChildScrollView(
      //   child: Padding(
      //     padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 2.h),
      //     child: Column(
      //       mainAxisAlignment: MainAxisAlignment.start,
      //       crossAxisAlignment: CrossAxisAlignment.start,
      //       children: [
      //         Gap(5.h),
      //         AssetMaintainanceCard(),
      //         Gap(5.h),
      //         AssetMaintainanceCard(),
      //         Gap(5.h),
      //         AssetMaintainanceCard(),
      //         Gap(5.h),
      //         AssetMaintainanceCard(),
      //         Gap(5.h),
      //       ],
      //     ),
      //   ),
      // ),
      // body: ListView.builder(
      //   scrollDirection: Axis.vertical,
      //   itemCount: 10,
      //   itemBuilder: (context, index) {
      //     return AssetMaintainanceHistoryCard2();
      //   },
      // ),

      body: Column(
        children: [
          getVerSpace(10.h),
          Material(
            elevation: 1,
            child: TabBar(
              controller: _tabController,
              indicator: UnderlineTabIndicator(
                borderSide: BorderSide(color: basicColor, width: 2.0),
                insets: const EdgeInsets.symmetric(horizontal: 90.0),
              ),
              overlayColor:
                  WidgetStateProperty.all(basicColor.withOpacity(0.2)),
              indicatorColor: basicColor,
              labelColor: basicColor,
              tabs: [
                Tab(
                  height: 100.h,
                  text: "Services",
                  icon: ClipOval(
                    child: Material(
                      elevation: 3,
                      child: Lottie.asset(
                        "assets/jsons/services.json",
                        height: 70.h,
                        width: 90.w,
                        fit: BoxFit.fill,
                      ),
                    ),
                  ),
                ),
                Tab(
                  height: 100.h,
                  text: "Tickets",
                  icon: ClipOval(
                    child: Material(
                      elevation: 3,
                      child: Lottie.asset(
                        "assets/jsons/tickets.json",
                        backgroundLoading: true,
                        height: 70.h,
                        width: 90.w,
                        fit: BoxFit.fill,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                buildServicesTab(),
                buildTicketsTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildServicesTab() {
    return ListView.builder(
        itemCount: 10,
        itemBuilder: (context, index) {
          return serviceMaitainanceHistoryCard();
        });
  }

  Widget buildTicketsTab() {
    return ListView.builder(
        itemCount: 10,
        itemBuilder: (context, index) {
          return ticketMaintainanceHistoryCard();
        });
  }

  Widget serviceMaitainanceHistoryCard() {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, AppRoutes.assetMaintainanceHistory2);
      },
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 3.h),
        child: Material(
          elevation: 3,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              color: Colors.white,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Gap(2.h),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 2.w, vertical: 4.h),
                  child: Row(
                    children: [
                      Gap(6.w),
                      Expanded(
                        flex: 3,
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Image.asset(
                              "${AssetImagepath.assetImagePath}fire5.png",
                              height: 80.h,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ),
                      SizedBox(width: 10.0.w),
                      Container(
                        height: 70.h,
                        width: 4.w,
                        color: Colors.blue,
                      ),
                      SizedBox(width: 10.0.w),
                      Expanded(
                        flex: 9,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Service Title",
                              style: notificationHeadingTextSTyle,
                            ),
                            Gap(2.h),
                            Text(
                              "Service Description, Service Description, Service Description, Service Description, Service Description, Service Description, Service Description, Service Description ",
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: notificationSubHeadingTextSTyle,
                            ),
                            Gap(4.h),
                            Padding(
                              padding: EdgeInsets.only(right: 15.w),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    "Service Id : 100",
                                    style: blueTextSTyle1,
                                  ),
                                  GestureDetector(
                                    onTap: () {
                                      Navigator.pushNamed(context,
                                          AppRoutes.assetMaintainanceHistory2);
                                    },
                                    child: Text(
                                      "10-12-2023",
                                      style: blueTextSTyle2,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget ticketMaintainanceHistoryCard() {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, AppRoutes.assetMaintainanceHistory2);
      },
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 3.h),
        child: Material(
          elevation: 3,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              color: Colors.white,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Gap(2.h),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 2.w, vertical: 4.h),
                  child: Row(
                    children: [
                      Gap(6.w),
                      Expanded(
                        flex: 3,
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Image.asset(
                              "${AssetImagepath.assetImagePath}fire5.png",
                              height: 80.h,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ),
                      SizedBox(width: 10.0.w),
                      Container(
                        height: 70.h,
                        width: 4.w,
                        color: Colors.blue,
                      ),
                      SizedBox(width: 10.0.w),
                      Expanded(
                        flex: 9,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Ticket Title",
                              style: notificationHeadingTextSTyle,
                            ),
                            Gap(2.h),
                            Text(
                              "Ticket Description, Ticket Description, Ticket Description, Ticket Description, Ticket Description, Ticket Description, Ticket Description, Ticket Description ",
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: notificationSubHeadingTextSTyle,
                            ),
                            Gap(4.h),
                            Padding(
                              padding: EdgeInsets.only(right: 15.w),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    "Ticket Id : 100",
                                    style: blueTextSTyle1,
                                  ),
                                  GestureDetector(
                                    onTap: () {
                                      Navigator.pushNamed(context,
                                          AppRoutes.assetMaintainanceHistory2);
                                    },
                                    child: Text(
                                      "10-12-2023",
                                      style: blueTextSTyle2,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
