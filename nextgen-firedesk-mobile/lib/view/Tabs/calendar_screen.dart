import "package:firedesk/data/app_exceptions.dart";
import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/models/data_models/HomeScreenModels/month_data_model.dart";
import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/components/general_exception_widget.dart";
import "package:firedesk/res/components/internet_exception.dart";
import "package:firedesk/res/components/request_timeout.dart";
import "package:firedesk/res/components/server_exception_widget.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/res/styles/text_style.dart";
import "package:firedesk/view_models/providers/home_screen_provider.dart";
import "package:firedesk/widgets/date_formatter.dart";
import "package:firedesk/widgets/widget_utils.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:gap/gap.dart";
import 'package:intl/intl.dart';
import "package:lottie/lottie.dart";
import "package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart";
import "package:provider/provider.dart";
import "package:qr_code_scanner/qr_code_scanner.dart";
import "package:table_calendar/table_calendar.dart";

final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');

class CalendarScreen extends StatefulWidget {
  final String plantId;
  const CalendarScreen({super.key, required this.plantId});
  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen>
    with SingleTickerProviderStateMixin {
  Barcode? result;
  QRViewController? controller;
  late TabController _tabController;
  DateTime today = DateTime.now();

  // late Animation<Offset> _slideAnimation;
  // final bool _isSearching = false;

  void _onDaySelected(DateTime day, DateTime focusedday) {
    final homeScreenProvider = Provider.of<HomeScreenProvider>(
      context,
      listen: false,
    );
    List<ServiceData> assetsForSelectedDate =
        homeScreenProvider.selectedAssets[day] ?? [];
    List<Ticket> ticketsForSelectedDate =
        homeScreenProvider.selectedTickets[day] ?? [];

    if (!homeScreenProvider.showDayData) {
      homeScreenProvider.setShowDayData = true;
    }

    setState(() {
      today = day;
    });

    if (assetsForSelectedDate.isEmpty && ticketsForSelectedDate.isEmpty) {
      homeScreenProvider.setDayServices = [];
      homeScreenProvider.setDayTickets = [];
    } else {
      homeScreenProvider.getDateData(
          context,
          assetsForSelectedDate,
          ticketsForSelectedDate,
          customDateFormatter2(
            day.toString(),
          ),
          widget.plantId);
    }
  }

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    if (kDebugMode) {
      debugPrint("came to home screen with plant id :${widget.plantId}");
    }

    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      final provider = Provider.of<HomeScreenProvider>(context, listen: false);
      provider.setShowDayData = false;
      int currentMonth = today.month;
      int currentYear = today.year;
      provider.getMonthData(
        context,
        widget.plantId,
        currentMonth.toString(),
        currentYear.toString(),
        false,
      );
    });
  }

  List<int> _generateYears(int startYear, int endYear) {
    return List<int>.generate(
      endYear - startYear + 1,
      (index) => startYear + index,
    );
  }

  void _onWillPop() {
    debugPrint("entered");
    Navigator.pop(context);
  }

  @override
  void dispose() {
    controller?.dispose();
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<HomeScreenProvider>(
      builder: (context, homeScreenProvider, _) {
        return ModalProgressHUD(
          inAsyncCall: homeScreenProvider.isModalProgressHudLoading,
          progressIndicator: const CircularProgressIndicator(
            color: Colors.blue,
          ),
          child: PopScope(
            canPop: true,
            onPopInvoked: (didPop) {
              if (!didPop) {
                _onWillPop(); // Only manually call Navigator.pop if didPop is false
              }
            },
            child: Scaffold(
              backgroundColor: Colors.white,
              extendBodyBehindAppBar: false,
              appBar: PreferredSize(
                preferredSize: Size.fromHeight(60.h),
                child: Material(
                  elevation: 4,
                  child: AppBar(
                    leading: IconButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                    backgroundColor: basicColor,
                    automaticallyImplyLeading: false,
                    title: Text("Service Calendar", style: appBarTextSTyle),
                    centerTitle: true,
                    actions: const [],
                  ),
                ),
              ),
              body: Column(
                children: [
                  content(),
                  getVerSpace(10.h),
                  TabBar(
                    controller: _tabController,
                    indicator: UnderlineTabIndicator(
                      borderSide: BorderSide(color: basicColor, width: 1.0),
                      insets: const EdgeInsets.symmetric(horizontal: 0.0),
                    ),
                    overlayColor: WidgetStateProperty.all(
                      basicColor.withAlpha(40),
                    ),
                    indicatorColor: basicColor,
                    labelColor: basicColor,
                    tabs: [
                      Tab(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(width: 8.w),
                            const Icon(
                              Icons.support_agent,
                              color: Colors.black,
                            ),
                            SizedBox(width: 10.w),
                            const Text(
                              "Services",
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Tab(
                        // height: 100,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(width: 8.w),
                            const Icon(
                              Icons.book_online_outlined,
                              color: Colors.black,
                            ),
                            SizedBox(width: 10.w),
                            const Text(
                              "Tickets",
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  getContents(homeScreenProvider),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget getContents(HomeScreenProvider homeScreenProvider) {
    switch (homeScreenProvider.dataStatus) {
      case Status.LOADING:
        return Center(child: SizedBox(height: 0.h, width: 0.w));
      case Status.ERROR:
        print("error occured and type is ${homeScreenProvider.dataError}");
        if (homeScreenProvider.dataError == InternetException) {
          return InterNetExceptionWidget(
            onPress: () {
              int currentMonth = today.month;
              int currentYear = today.year;
              homeScreenProvider.getMonthData(
                context,
                widget.plantId,
                currentMonth.toString(),
                currentYear.toString(),
                false,
              );
            },
          );
        } else if (homeScreenProvider.dataError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              int currentMonth = today.month;
              int currentYear = today.year;
              homeScreenProvider.getMonthData(
                context,
                widget.plantId,
                currentMonth.toString(),
                currentYear.toString(),
                false,
              );
            },
          );
        } else if (homeScreenProvider.dataError == ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              int currentMonth = today.month;
              int currentYear = today.year;
              homeScreenProvider.getMonthData(
                context,
                widget.plantId,
                currentMonth.toString(),
                currentYear.toString(),
                false,
              );
            },
          );
        } else {
          return Center(
            child: GeneralExceptionWidget(
              onPress: () {
                int currentMonth = today.month;
                int currentYear = today.year;
                homeScreenProvider.getMonthData(
                  context,
                  widget.plantId,
                  currentMonth.toString(),
                  currentYear.toString(),
                  false,
                );
              },
            ),
          );
        }
      case Status.COMPLETED:
        return Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              Column(
                children: [
                  getVerSpace(20.h),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.w),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          flex: 7,
                          child: Text(
                            "Pending Services",
                            style: normalTextSTyle1,
                          ),
                        ),
                        Expanded(
                          flex: 3,
                          child: GestureDetector(
                            onTap: () {
                              if (kDebugMode) {
                                debugPrint(
                                  "came to navigating functionality and ppantId is ${widget.plantId}",
                                );
                              }
                              Navigator.pushNamed(
                                context,
                                AppRoutes.allservices,
                                arguments: {"plantId": widget.plantId},
                              );
                            },
                            child: Align(
                              alignment: Alignment.centerRight,
                              child: Text("View All", style: blueTextSTyle1),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  getVerSpace(15.h),
                  ((homeScreenProvider.showDayData &&
                              homeScreenProvider.dayServices.isEmpty) ||
                          (homeScreenProvider.services.isEmpty &&
                              !homeScreenProvider.showDayData))
                      ? Center(
                          child: Column(
                            children: [
                              Transform.scale(
                                scale: 2,
                                child: Lottie.asset(
                                  "assets/jsons/calendar_empty1.json",
                                  height: 200.h,
                                  width: 300.w,
                                ),
                              ),
                              Text(
                                (homeScreenProvider.showDayData &&
                                        homeScreenProvider.dayServices.isEmpty)
                                    ? "There is no services in the date you have selected"
                                    : (homeScreenProvider.services.isEmpty &&
                                            !homeScreenProvider.showDayData)
                                        ? "Thre is no services for this month"
                                        : "Currently there is no services ",
                                style: normalTextSTyle1,
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        )
                      : Expanded(
                          child: homeScreenProvider.showDayData
                              ? ListView.builder(
                                  itemCount:
                                      homeScreenProvider.dayServices.length,
                                  itemBuilder: (context, index) {
                                    var asset =
                                        homeScreenProvider.dayServices[index];
                                    return serviceCard(
                                        serviceId: asset.id.toString(),
                                        serviceDate: asset.date.toString(),
                                        serviceType:
                                            asset.serviceType.toString(),
                                       singleAssetService:
                                            asset.individualService == true
                                                ? true
                                                : false,
                                        assetId: asset.individualService == true
                                            ? asset.assetsId[0].assetId ?? ""
                                            : "Gropup Id",
                                        productName: asset.assetsId[0].productId
                                                .productName ??
                                            "",
                                        productType:
                                            asset.assetsId[0].type ?? "",
                                        location:
                                            asset.assetsId[0].location ?? "",
                                        building:
                                            asset.assetsId[0].building ?? "",
                                        groupId:
                                            asset.groupServiceId?.groupId ?? "",
                                        groupName:
                                            asset.groupServiceId?.groupName ??
                                                "");
                                  },
                                )
                              : ListView.builder(
                                  itemCount: homeScreenProvider.services.length,
                                  itemBuilder: (context, index) {
                                    print(
                                        "length in home screen is ${homeScreenProvider.services.length}");
                                    List<ServiceData> reversedServices = (today
                                                    .month !=
                                                DateTime.now().month ||
                                            today.year != DateTime.now().year)
                                        ? homeScreenProvider.services.reversed
                                            .toList()
                                        : homeScreenProvider.services;
                                    var asset = reversedServices[index];
                                    return serviceCard(
                                        serviceId: asset.id.toString(),
                                        // plantName:
                                        //     asset.plantId.plantName.toString(),
                                        serviceDate: asset.date.toString(),
                                        serviceType:
                                            asset.serviceType.toString(),
                                        singleAssetService:
                                            asset.individualService == true
                                                ? true
                                                : false,
                                        assetId: asset.individualService == true
                                            ? asset.assetsId[0].assetId ?? ""
                                            : "Gropup Id",
                                        productName: asset.assetsId[0].productId
                                                .productName ??
                                            "",
                                        productType:
                                            asset.assetsId[0].type ?? "",
                                        location:
                                            asset.assetsId[0].location ?? "",
                                        building:
                                            asset.assetsId[0].building ?? "",
                                        groupId:
                                            asset.groupServiceId?.groupId ?? "",
                                        groupName:
                                            asset.groupServiceId?.groupName ??
                                                "");
                                  },
                                ),
                        ),
                ],
              ),
              Column(
                children: [
                  getVerSpace(20.h),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.w),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          flex: 7,
                          child: Text(
                            "Open Tickets",
                            style: normalTextSTyle1,
                          ),
                        ),
                        Expanded(
                          flex: 3,
                          child: GestureDetector(
                            onTap: () {
                              Navigator.pushNamed(
                                context,
                                AppRoutes.alltickets,
                                arguments: {"plantId": widget.plantId},
                              );
                            },
                            child: Align(
                              alignment: Alignment.centerRight,
                              child: Text("View All", style: blueTextSTyle1),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  getVerSpace(15.h),
                  ((homeScreenProvider.showDayData &&
                              homeScreenProvider.dayTickets.isEmpty) ||
                          (homeScreenProvider.tickets.isEmpty &&
                              !homeScreenProvider.showDayData))
                      ? Center(
                          child: Column(
                            children: [
                              Transform.scale(
                                scale: 2,
                                child: Lottie.asset(
                                  "assets/jsons/calendar_empty1.json",
                                  height: 200.h,
                                  width: 300.w,
                                ),
                              ),
                              Text(
                                (homeScreenProvider.showDayData &&
                                        homeScreenProvider.dayTickets.isEmpty)
                                    ? "There is no tickets on the date you have selected"
                                    : (homeScreenProvider.tickets.isEmpty &&
                                            !homeScreenProvider.showDayData)
                                        ? "There is no tickets for this month"
                                        : "Currently There is no services",
                                style: normalTextSTyle1,
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        )
                      : Expanded(
                          child: ListView.builder(
                            itemCount: homeScreenProvider.showDayData
                                ? homeScreenProvider.dayTickets.length
                                : homeScreenProvider.tickets.length,
                            itemBuilder: (context, index) {
                              print(
                                  "tickets length in listview bnuilder ui is ${homeScreenProvider.dayTickets.length}");
                              return homeScreenProvider.showDayData
                                  ? returnTicketCard(
                                      "",
                                      homeScreenProvider.dayTickets[index]
                                              .taskDescription ??
                                          "",
                                      homeScreenProvider
                                              .dayTickets[index].ticketId ??
                                          "",
                                    )
                                  : returnTicketCard(
                                      "",
                                      homeScreenProvider
                                              .tickets[index].taskDescription ??
                                          "",
                                      homeScreenProvider
                                              .tickets[index].ticketId ??
                                          "",
                                    );
                            },
                          ),
                        ),
                ],
              ),
              // buildServicesTab(),
              // buildTicketsTab(),
            ],
          ),
        );
      default:
        return Center(child: CircularProgressIndicator(color: basicColor));
    }
  }

  Widget content() {
    int selectedYear = today.year;
    int selectedMonth = today.month;
    return Consumer<HomeScreenProvider>(
      builder: (context, homeScreenProvider, _) {
        return Column(
          children: [
            TableCalendar(
              daysOfWeekHeight: 20.h,
              rowHeight: 42.0.h,
              startingDayOfWeek: StartingDayOfWeek.monday,
              calendarBuilders: CalendarBuilders(
                headerTitleBuilder: (context, day) {
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      DropdownButton<int>(
                        value: selectedYear,
                        items: _generateYears(1900, 2100).map((year) {
                          return DropdownMenuItem<int>(
                            value: year,
                            child: Text(year.toString()),
                          );
                        }).toList(),
                        onChanged: (year) {
                          if (year != null) {
                            setState(() {
                              selectedYear = year;
                              today = DateTime(selectedYear, selectedMonth);
                            });
                          }
                        },
                      ),
                      DropdownButton<int>(
                        value: selectedMonth,
                        items: List.generate(12, (index) => index + 1).map((
                          month,
                        ) {
                          return DropdownMenuItem<int>(
                            value: month,
                            child: Text(
                              DateFormat.MMMM().format(DateTime(0, month)),
                            ),
                          );
                        }).toList(),
                        onChanged: (month) {
                          if (month != null) {
                            setState(() {
                              selectedMonth = month;
                              today = DateTime(selectedYear, selectedMonth);
                            });
                          }
                        },
                      ),
                    ],
                  );
                },
                dowBuilder: (context, day) {
                  final text = DateFormat.E().format(day);
                  return Center(
                    child: Text(
                      text,
                      style: TextStyle(
                        color: day.weekday == DateTime.sunday
                            ? Colors.red
                            : Colors.black,
                        fontSize: 14.sp, // Adjust font size
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  );
                },
                todayBuilder: (context, day, focusedDay) {
                  return Container(
                    margin: const EdgeInsets.all(6.0),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                    child: Center(
                      child: Text(
                        '${day.day}',
                        style: const TextStyle(color: Colors.black),
                      ),
                    ),
                  );
                },
                defaultBuilder: (context, day, focusedDay) {
                  if (day.weekday == DateTime.sunday) {
                    return Container(
                      margin: const EdgeInsets.all(6.0),
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: Center(
                        child: Text(
                          '${day.day}',
                          style: const TextStyle().copyWith(color: Colors.red),
                        ),
                      ),
                    );
                  }
                  return null;
                },
                markerBuilder: (context, day, events) {
                  if (homeScreenProvider.eventCounts[day] != null) {
                    return Positioned(
                      right: 1,
                      bottom: 1,
                      child: Container(
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.blue,
                        ),
                        width: 16.0,
                        height: 16.0,
                        child: Center(
                          child: Text(
                            homeScreenProvider.eventCounts[day].toString(),
                            style: const TextStyle().copyWith(
                              color: Colors.white,
                              fontSize: 12.0,
                            ),
                          ),
                        ),
                      ),
                    );
                  }
                  return null;
                },
              ),
              locale: "en_US",
              headerStyle: const HeaderStyle(
                formatButtonVisible: false,
                titleCentered: true,
              ),
              availableGestures: AvailableGestures.all,
              selectedDayPredicate: (day) => isSameDay(day, today),
              focusedDay: today,
              currentDay: null,
              firstDay: DateTime.utc(2024, 01, 01),
              lastDay: DateTime.utc(2030, 12, 30),
              onDaySelected: _onDaySelected,
              onPageChanged: (value) {
                homeScreenProvider.getMonthData(
                  context,
                  widget.plantId,
                  value.month.toString(),
                  value.year.toString(),
                  true,
                );
                setState(() {
                  today = value;
                });
              },
            ),
          ],
        );
      },
    );
  }

  Widget serviceCard({
    required String serviceId,
    required String serviceDate,
    required String serviceType,
    required bool singleAssetService,
    required String assetId,
    required String productName,
    required String productType,
    required String location,
    required String building,
    required String groupId,
    required String groupName,
  }) {
    return GestureDetector(
      onTap: () {
        if (kDebugMode) {
          debugPrint("Tapped serviceType: $serviceType | ID: $serviceId");
        }
        Navigator.pushNamed(
          context,
          AppRoutes.servicedetails,
          arguments: {
            "serviceId": serviceId,
            "cameFromRejectedService": false,
            "serviceDate": serviceDate,
          },
        );
      },
      child: Container(
        margin: EdgeInsets.only(bottom: 12.h),
        padding: EdgeInsets.all(14.w),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16.r),
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.08),
              blurRadius: 12,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// TOP ROW: Asset + Location
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                /// LEFT: Asset info
                Expanded(
                  flex: 6,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                       singleAssetService ? assetId : groupId,
                        style: notificationHeadingTextSTyle.copyWith(
                          fontWeight: FontWeight.w600,
                          fontSize: 14.sp,
                          color: Colors.black87,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      SizedBox(height: 4.h),
                      Text(
                      singleAssetService ? "$productName, $productType" : groupName,
                        style: TextStyle(
                          fontSize: 12.sp,
                          color: Colors.grey[600],
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),

                SizedBox(width: 12.w),

                /// RIGHT: Location info
                Expanded(
                  flex: 5,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.home_outlined,
                              color: Colors.indigo[300], size: 18),
                          SizedBox(width: 6.w),
                          Expanded(
                            child: Text(
                              building,
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 13.sp,
                                color: Colors.black87,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 6.h),
                      Row(
                        children: [
                          Icon(Icons.location_on_outlined,
                              color: Colors.indigo[300], size: 18),
                          SizedBox(width: 6.w),
                          Expanded(
                            child: Text(
                              location,
                              style: TextStyle(
                                fontSize: 12.sp,
                                color: Colors.grey[600],
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),

            SizedBox(height: 16.h),

            /// BOTTOM ROW: Date + Service Type
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.calendar_today_outlined,
                      size: 16.sp,
                      color: Colors.redAccent,
                    ),
                    SizedBox(width: 6.w),
                    Text(
                      "Due: ${customDateFormatter(serviceDate)}",
                      style: TextStyle(
                        color: Colors.redAccent,
                        fontWeight: FontWeight.w500,
                        fontSize: 13.sp,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding:
                      EdgeInsets.symmetric(horizontal: 10.w, vertical: 5.h),
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                    borderRadius: BorderRadius.circular(8.r),
                  ),
                  child: Text(
                    serviceType,
                    style: TextStyle(
                      fontSize: 12.sp,
                      color: Colors.blue.shade700,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget returnTicketCard(String assetId, String description, String ticketId) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 10.w, vertical: 3.h),
      padding: EdgeInsets.all(10.w),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.3),
            spreadRadius: 1,
            blurRadius: 2,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Gap(2.h),
          // Remove the Row containing the image and other elements
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 2.w, vertical: 4.h),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Ticket Id - $ticketId",
                      style: notificationHeadingTextSTyle,
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.pushNamed(
                          context,
                          AppRoutes.alltickets,
                          arguments: {"plantId": widget.plantId},
                        );
                      },
                      child: const Icon(
                        Icons.arrow_forward,
                        color: Colors.blue,
                      ),
                    ),
                  ],
                ),
                Gap(2.h),
                Text(
                  "Task description - $description",
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: notificationSubHeadingTextSTyle,
                ),
              ],
            ),
          ),
          Gap(3.h),
        ],
      ),
    );
  }
}

class Customshowdelegate extends SearchDelegate {
  List<String> serachtems = [
    'Assets 1',
    "Assets 2",
    "Assets 3",
    "Assets 4",
    "Assets 5",
    "Assets 6",
    "Assets 7",
    "Assets 8",
    "Assets 9",
    "Assets 10",
    "Assets 11",
    "Assets 12",
  ];

  @override
  List<Widget>? buildActions(BuildContext context) {
    return [
      IconButton(
        onPressed: () {
          query = '';
        },
        icon: const Icon(Icons.clear),
      ),
    ];
  }

  @override
  Widget? buildLeading(BuildContext context) {
    return IconButton(
      onPressed: () {
        close(context, null);
      },
      icon: const Icon(Icons.arrow_back),
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    List<String> matchquery = [];

    for (var fruit in serachtems) {
      if (fruit.toLowerCase().contains(query.toLowerCase())) {
        matchquery.add(fruit);
      }
    }

    return ListView.builder(
      itemCount: matchquery.length,
      itemBuilder: (context, index) {
        var result = matchquery[index];
        return ListTile(title: Text(result));
      },
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    List<String> matchquery = [];

    for (var fruit in serachtems) {
      if (fruit.toLowerCase().contains(query.toLowerCase())) {
        matchquery.add(fruit);
      }
    }

    return ListView.builder(
      itemCount: matchquery.length,
      itemBuilder: (context, index) {
        var result = matchquery[index];
        return ListTile(title: Text(result));
      },
    );
  }
}
