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

class lapsedServicesScreen extends StatelessWidget {
  final String plantId;
  const lapsedServicesScreen({super.key, required this.plantId});

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
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Lapsed", plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Lapsed", plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Lapsed", plantId);
            },
          );
        } else {
          return GeneralExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Lapsed", plantId);
            },
          );
        }
      case Status.COMPLETED:
        return allServiceScreenProvider.lapsedServices.isEmpty
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
                        "currently there are no Lapsed services in this status",
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
                itemCount: allServiceScreenProvider.lapsedServices.length,
                itemBuilder: (context, index) {
                  var serviceItem =
                      allServiceScreenProvider.lapsedServices[index];
                  return serviceCard(
                      context: context,
                      serviceId: serviceItem.id.toString(),
                      serviceDate: serviceItem.date.toString(),
                      serviceType: serviceItem.serviceType.toString(),
                      singleAssetService:
                          serviceItem.individualService == true ? true : false,
                      assetId: serviceItem.individualService == true
                          ? serviceItem.assetsId![0].assetId ?? ""
                          : "Gropup Id",
                      productName:
                          serviceItem.assetsId![0].productId!.productName ?? "",
                      productType: serviceItem.assetsId![0].type ?? "",
                      location: serviceItem.assetsId![0].location ?? "",
                      building: serviceItem.assetsId![0].building ?? "",
                      groupId: serviceItem.groupServiceId?.groupId ?? "",
                      groupName: serviceItem.groupServiceId?.groupName ?? "");
                },
              );
      default:
        return ListView.builder(
          itemCount: 10,
          itemBuilder: (context, index) {
            return bigServiceCardShimmer(context);
          },
        );
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
                        singleAssetService
                            ? "$productName, $productType"
                            : groupName,
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
