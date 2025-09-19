import 'package:firedesk/data/app_exceptions.dart';
import 'package:firedesk/data/reponse/status.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/components/general_exception_widget.dart';
import 'package:firedesk/res/components/internet_exception.dart';
import 'package:firedesk/res/components/request_timeout.dart';
import 'package:firedesk/res/components/server_exception_widget.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/view/servicess/components/big_service_shimmer_card.dart';
import 'package:firedesk/view_models/providers/all_service_screen_provider.dart';
import 'package:firedesk/widgets/date_formatter.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:gap/gap.dart';
import 'package:lottie/lottie.dart';
import 'package:provider/provider.dart';

class DueServices extends StatelessWidget {
  final String plantId;
  const DueServices({super.key, required this.plantId});

  @override
  Widget build(BuildContext context) {
    return Consumer<AllServiceScreenProvider>(
        builder: (context, allServiceScreenProvider, _) {
      return Scaffold(
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
                "Services",
                style: appBarTextSTyle,
              ),
              centerTitle: true,
              actions: const [],
            ),
          ),
        ),
        body: getContents(context, allServiceScreenProvider),
      );
    });
  }

  Widget getContents(
      BuildContext context, AllServiceScreenProvider allServiceScreenProvider) {
    switch (allServiceScreenProvider.dataStatus) {
      case Status.LOADING:
        return ListView.builder(
          itemCount: 10,
          itemBuilder: (context, index) {
            return bigServiceCardShimmer(context);
          },
        );
      case Status.ERROR:
        if (allServiceScreenProvider.dataError == InternetException) {
          return InterNetExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchDueServices(context, plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              allServiceScreenProvider.fetchDueServices(context, plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchDueServices(context, plantId);
            },
          );
        } else {
          return GeneralExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchDueServices(context, plantId);
            },
          );
        }
      case Status.COMPLETED:
        print(
            "due services length in ui is ${allServiceScreenProvider.dueServicesList.length}");
        return allServiceScreenProvider.dueServicesList.isEmpty
            ? Padding(
                padding: EdgeInsets.symmetric(horizontal: 20.w),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Lottie.asset(
                        "assets/jsons/empty_tickets.json",
                      ),
                      SizedBox(height: 50.h),
                      Text(
                        "currently there are no incompleted services in this status",
                        style: normalTextSTyle1,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              )
            : ListView.builder(
                itemCount: allServiceScreenProvider.dueServicesList.length,
                itemBuilder: (context, index) {
                  final service =
                      allServiceScreenProvider.dueServicesList[index];
                  debugPrint(
                      "length of incomplete services is ${allServiceScreenProvider.dueServicesList.length}");
                  return serviceCard(
                    context: context,
                    serviceId: service.id ?? "",
                    serviceDate: service.date.toString(),
                    serviceType: service.serviceType.toString(),
                    assetId: service.assetsId![0].assetId.toString(),
                    singleAssetService:
                        service.individualService! ? true : false,
                    productName:
                        service.assetsId![0].productId!.productName ?? "",
                    productType: service.assetsId![0].type ?? "",
                    location: service.assetsId![0].location ?? "",
                    building: service.assetsId![0].building ?? "",
                    groupId: service.groupServiceId?.groupId ?? "",
                    groupName: service.groupServiceId?.groupName ?? "",
                  );
                },
              );
      default:
        return const CircularProgressIndicator();
    }
  }

  // Widget returnServiceCard({
  //   required BuildContext context,
  //   required String serviceId,
  //   required String serviceDate,
  //   required String serviceType,
  //   required String assetNo,
  //   required String singleOrMultipleAssetService,
  //   required String plantName,
  // }) {
  //   return Padding(
  //     padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 3.h),
  //     child: Container(
  //       decoration: BoxDecoration(
  //         color: basicColor.withOpacity(0.06),
  //         borderRadius: BorderRadius.circular(10),
  //       ),
  //       child: Column(
  //         children: [
  //           serviceCard(
  //             context,
  //             serviceId,
  //             plantName,
  //             serviceDate,
  //             serviceType,
  //             singleOrMultipleAssetService,
  //             assetNo,
  //           ),
  //           Gap(4.h),
  //         ],
  //       ),
  //     ),
  //   );
  // }

  Widget serviceCard({
    required BuildContext context,
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
          debugPrint(
              "serviceType when I click is $serviceType and id is $serviceId");
        }
        Navigator.pushNamed(
          context,
          AppRoutes.servicedetails,
          arguments: {
            "serviceId": serviceId,
            // "serviceType": serviceType,
            // "showSubmitButton": true,
            // "alreadyScanned": false,
            // "serviceFormId": '',
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
                        assetId,
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
                        "$productName, $productType",
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
}
