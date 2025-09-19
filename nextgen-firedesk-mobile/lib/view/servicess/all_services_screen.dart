import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/view/servicess/bottombar/completed_services.dart";
import "package:firedesk/view/servicess/bottombar/due_services.dart";
import "package:firedesk/view/servicess/bottombar/lapsed_services.dart";
import "package:firedesk/view_models/providers/all_service_screen_provider.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:provider/provider.dart";
import "package:salomon_bottom_bar/salomon_bottom_bar.dart";

class AllServicesScreen extends StatefulWidget {
  final String plantId;
  const AllServicesScreen({super.key, required this.plantId});
  @override
  State<AllServicesScreen> createState() => _AllServicesScreenState();
}

class _AllServicesScreenState extends State<AllServicesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    if (kDebugMode) {
      debugPrint(
          "got plant id in all services screen and plant id is ${widget.plantId}");
    }
    _tabController = TabController(length: 5, vsync: this);
    // WidgetsBinding.instance.addPostFrameCallback(
    //   (timeStamp) {
    //     final servicesProvider =
    //         Provider.of<ServicesListProvider>(context, listen: false);
    //     servicesProvider.fetchIncompleteServices(widget.plantId);
    //     servicesProvider.fetchUpcomingServices(widget.plantId);
    //     servicesProvider.fetchServicesListByStatus("Completed", widget.plantId);
    //     servicesProvider.fetchServicesListByStatus("Rejected", widget.plantId);
    // servicesProvider.fetchServicesListByStatus(
    //   "Waiting for approval",
    //   widget.plantId,
    // );
    //   },
    // );
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      final allServiceProvider =
          Provider.of<AllServiceScreenProvider>(context, listen: false);
      allServiceProvider.currentIndex = 0;
      allServiceProvider.fetchDueServices(context, widget.plantId);
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      // IncompletedServicesScreen(
      //   plantId: widget.plantId,
      // ),
      DueServices(
        plantId: widget.plantId,
      ),
      // ApprovalPendingServiceScreen(
      //   plantId: widget.plantId,
      // ),
      CompletedServicesScreen(
        plantId: widget.plantId,
      ),
      // RejectedServicesScreen(
      //   plantId: widget.plantId,
      // ),
      lapsedServicesScreen(
        plantId: widget.plantId,
      )
    ];

    return Consumer<AllServiceScreenProvider>(
        builder: (context, allServicesScreenProvider, _) {
      return Scaffold(
        backgroundColor: Colors.white,
        // appBar: PreferredSize(
        //   preferredSize: Size.fromHeight(45.h),
        //   child: Material(
        //     elevation: 2,
        //     child: AppBar(
        //       leading: IconButton(
        //         onPressed: (){
        //           Navigator.pop(context);
        //         },
        //         icon: const Icon(
        //           Icons.arrow_back,
        //           color: Colors.white,
        //         ),
        //       ),
        //       backgroundColor: basicColor,
        //       automaticallyImplyLeading: false,
        //       title: Text(
        //         "Services",
        //         style: appBarTextSTyle,
        //       ),
        //       centerTitle: true,
        //       actions: const [],
        //     ),
        //   ),
        // ),
        body: screens[allServicesScreenProvider.currentIndex],
        bottomNavigationBar: Material(
          elevation: 10,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20.r),
            topRight: Radius.circular(30.r),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20.r),
              topRight: Radius.circular(30.r),
            ),
            child: Container(
              color: const Color(0xffF7F9FF),
              child: SalomonBottomBar(
                currentIndex: allServicesScreenProvider.currentIndex,
                backgroundColor: Colors.transparent,
                onTap: (i) {
                  allServicesScreenProvider.currentIndex = i;
                  if (i == 1) {
                    allServicesScreenProvider.fetchDueServices(
                        context, widget.plantId);
                  } else if (i == 2) {
                    allServicesScreenProvider.fetchServicesListByStatus(
                      context,
                      "Waiting for approval",
                      widget.plantId,
                    );
                  } else if (i == 3) {
                    allServicesScreenProvider.fetchServicesListByStatus(
                      context,
                      "Lapsed",
                      widget.plantId,
                    );
                  }
                  // else if (i ==2) {
                  //   allServicesScreenProvider.fetchServicesListByStatus(
                  //     context,
                  //     "Completed",
                  //     widget.plantId,
                  //   );
                  // }
                  //  else if (i == 4) {
                  //   allServicesScreenProvider.fetchServicesListByStatus(
                  //     context,
                  //     "Rejected",
                  //     widget.plantId,
                  //   );
                  // }
                },
                items: [
                  // SalomonBottomBarItem(
                  //   unselectedColor: darkGreyColor,
                  //   icon: const Icon(Icons.incomplete_circle),
                  //   title: const Text("Incompleted"),
                  //   selectedColor: basicColor,
                  // ),
                  SalomonBottomBarItem(
                    unselectedColor: darkGreyColor,
                    icon: const Icon(Icons.upcoming),
                    title: const Text("Due Services"),
                    selectedColor: basicColor,
                  ),
                  // SalomonBottomBarItem(
                  //   unselectedColor: darkGreyColor,
                  //   icon: const Icon(Icons.approval_rounded),
                  //   title: const Text(
                  //     "Approval Pending",
                  //     style: TextStyle(fontSize: 12),
                  //   ),
                  //   selectedColor: basicColor,
                  // ),
                  SalomonBottomBarItem(
                    unselectedColor: darkGreyColor,
                    icon: const Icon(Icons.check_circle),
                    title: const Text("Completed"),
                    selectedColor: basicColor,
                  ),
                  SalomonBottomBarItem(
                    unselectedColor: darkGreyColor,
                    icon: const Icon(Icons.cancel),
                    title: const Text("Lapsed"),
                    selectedColor: basicColor,
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    });
  }

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
}
