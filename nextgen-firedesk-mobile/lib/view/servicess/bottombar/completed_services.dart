import 'package:firedesk/data/app_exceptions.dart';
import 'package:firedesk/data/reponse/status.dart';
import "package:firedesk/models/data_models/Service_Models/service_by_status_model.dart"
    as servicesbystatusmodel;
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/components/general_exception_widget.dart';
import 'package:firedesk/res/components/internet_exception.dart';
import 'package:firedesk/res/components/request_timeout.dart';
import 'package:firedesk/res/components/server_exception_widget.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/view/servicess/components/big_service_shimmer_card.dart';
import 'package:firedesk/view_models/providers/all_service_screen_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:lottie/lottie.dart';
import 'package:provider/provider.dart';

class CompletedServicesScreen extends StatefulWidget {
  final String plantId;
  const CompletedServicesScreen({super.key, required this.plantId});

  @override
  State<CompletedServicesScreen> createState() =>
      _CompletedServicesScreenState();
}

class _CompletedServicesScreenState extends State<CompletedServicesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<String> status = [
    "Waiting for approval",
    "Completed",
    "Rejected",
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(() {
      final allServicesScreenProvider =
          Provider.of<AllServiceScreenProvider>(context, listen: false);
      allServicesScreenProvider.fetchServicesListByStatus(
        context,
        status[_tabController.index],
        widget.plantId,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AllServiceScreenProvider>(
        builder: (context, allServiceScreenProvider, _) {
      return DefaultTabController(
        length: 3, // Number of tabs
        child: Scaffold(
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
            automaticallyImplyLeading: false,
            title: Text(
              "Services",
              style: appBarTextSTyle,
            ),
            // centerTitle: true,
            bottom: TabBar(
              controller: _tabController,
              unselectedLabelStyle: const TextStyle(color: Colors.white),
              labelStyle: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w500),
              indicatorColor: Colors.white,
              tabs: const [
                Tab(
                  text: "Pending",
                ),
                Tab(text: "Completed"),
                Tab(text: "Rejected"),
              ],
            ),
          ),
          body: TabBarView(
            controller: _tabController,
            children: [
              getApprovalPendingContents(context, allServiceScreenProvider),
              getCompletedContents(context, allServiceScreenProvider),
              getRejectedContents(context, allServiceScreenProvider),
            ],
          ),
        ),
      );
    });
  }

  Widget getApprovalPendingContents(
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
                  context, "Waiting for approval", widget.plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Waiting for approval", widget.plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Waiting for approval", widget.plantId);
            },
          );
        } else {
          return GeneralExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Waiting for approval", widget.plantId);
            },
          );
        }
      case Status.COMPLETED:
        List<servicesbystatusmodel.Service> services = [];
        services = allServiceScreenProvider.approvalPendingServices;

        return services.isEmpty
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
                        "currently there are no completed services in this status",
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
                itemCount: services.length,
                itemBuilder: (context, index) {
                  var serviceItem = services[index];

                  return serviceCard(
                    context: context,
                    serviceId: serviceItem.id ?? "",
                    serviceDate: serviceItem.date.toString(),
                    serviceType: serviceItem.serviceType.toString(),
                    assetId: serviceItem.assetsId![0].assetId.toString(),
                    singleAssetService:
                        serviceItem.individualService! ? true : false,
                    productName:
                        serviceItem.assetsId![0].productId!.productName ?? "",
                    productType: serviceItem.assetsId![0].type ?? "",
                    location: serviceItem.assetsId![0].location ?? "",
                    building: serviceItem.assetsId![0].building ?? "",
                    submittedFormId: (serviceItem.submittedFormId != null)
                        ? serviceItem.submittedFormId!.id ?? ""
                        : "",
                    statusType: "Pending",
                    groupId: serviceItem.groupServiceId?.groupId ?? "",
                    groupName: serviceItem.groupServiceId?.groupName ?? "",
                    managerRemark:
                        serviceItem.submittedFormId?.managerRemark ?? "",
                  );
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

  Widget getCompletedContents(
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
                  context, "Completed", widget.plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Completed", widget.plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Completed", widget.plantId);
            },
          );
        } else {
          return GeneralExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Completed", widget.plantId);
            },
          );
        }
      case Status.COMPLETED:
        List<servicesbystatusmodel.Service> services = [];
        services = allServiceScreenProvider.completedServices;

        return services.isEmpty
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
                        "currently there are no completed services in this status",
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
                itemCount: services.length,
                itemBuilder: (context, index) {
                  var serviceItem = services[index];
                  return serviceCard(
                    context: context,
                    serviceId: serviceItem.id ?? "",
                    serviceDate: serviceItem.date.toString(),
                    serviceType: serviceItem.serviceType.toString(),
                    assetId: serviceItem.assetsId![0].assetId.toString(),
                    singleAssetService:
                        serviceItem.individualService! ? true : false,
                    productName:
                        serviceItem.assetsId![0].productId!.productName ?? "",
                    productType: serviceItem.assetsId![0].type ?? "",
                    location: serviceItem.assetsId![0].location ?? "",
                    building: serviceItem.assetsId![0].building ?? "",
                    submittedFormId: (serviceItem.submittedFormId != null)
                        ? serviceItem.submittedFormId!.id ?? ""
                        : "",
                    statusType: "Completed",
                    groupId: serviceItem.groupServiceId?.groupId ?? "",
                    groupName: serviceItem.groupServiceId?.groupName ?? "",
                    managerRemark:
                        serviceItem.submittedFormId?.managerRemark ?? "",
                  );
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

  Widget getRejectedContents(
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
                  context, "Rejected", widget.plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Rejected", widget.plantId);
            },
          );
        } else if (allServiceScreenProvider.dataError == ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Rejected", widget.plantId);
            },
          );
        } else {
          return GeneralExceptionWidget(
            onPress: () {
              allServiceScreenProvider.fetchServicesListByStatus(
                  context, "Rejected", widget.plantId);
            },
          );
        }
      case Status.COMPLETED:
        List<servicesbystatusmodel.Service> services = [];
        services = allServiceScreenProvider.rejectedServices;

        return services.isEmpty
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
                        "currently there are no completed services in this status",
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
                itemCount: services.length,
                itemBuilder: (context, index) {
                  var serviceItem = services[index];
                  return GestureDetector(
                    onTap: () {
                      Navigator.pushNamed(
                        context,
                        AppRoutes.servicedetails,
                        arguments: {
                          "serviceId": serviceItem.id,
                          "cameFromRejectedService": true,
                          "serviceDate": serviceItem.date.toString(),
                        },
                      );
                    },
                    child: serviceCard(
                      context: context,
                      serviceId: serviceItem.id ?? "",
                      serviceDate: serviceItem.date.toString(),
                      serviceType: serviceItem.serviceType.toString(),
                      assetId: serviceItem.assetsId![0].assetId.toString(),
                      singleAssetService:
                          serviceItem.individualService! ? true : false,
                      productName:
                          serviceItem.assetsId![0].productId!.productName ?? "",
                      productType: serviceItem.assetsId![0].type ?? "",
                      location: serviceItem.assetsId![0].location ?? "",
                      building: serviceItem.assetsId![0].building ?? "",
                      submittedFormId: (serviceItem.submittedFormId != null)
                          ? serviceItem.submittedFormId!.id ?? ""
                          : "",
                      statusType: "Rejected",
                      groupId: serviceItem.groupServiceId?.groupId ?? "",
                      groupName: serviceItem.groupServiceId?.groupName ?? "",
                      managerRemark:
                          serviceItem.submittedFormId?.managerRemark ?? "",
                    ),
                  );
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
    required String submittedFormId,
    required String statusType,
    required String groupId,
    required String groupName,
    required String managerRemark,
  }) {
    return GestureDetector(
      onTap: () {
        print("calling navigation and submitted form id is $submittedFormId");
        statusType == "Rejected"
            ? Navigator.pushNamed(
                context,
                AppRoutes.servicedetails,
                arguments: {
                  "serviceId": serviceId,
                  "cameFromRejectedService": true,
                  "serviceDate": serviceDate,
                },
              )
            : Navigator.pushNamed(
                context,
                AppRoutes.serviceSubmittedDataScreen,
                arguments: {
                  "serviceId": submittedFormId,
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
              color: Colors.grey.withAlpha(18),
              blurRadius: 12,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
            SizedBox(height: statusType == "Rejected" ? 2.h : 16.h),
            statusType == "Rejected"
                ? Text(
                    managerRemark,
                    style: TextStyle(
                      color: Colors.red,
                      fontSize: 12.sp,
                      fontWeight: FontWeight.w400,
                    ),
                    maxLines: 1,
                  )
                : SizedBox.shrink(),
            SizedBox(height: statusType == "Rejected" ? 8.h : 0.h),

            /// SECOND ROW: Date + Service Type
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
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
                Align(
                  alignment: Alignment.centerRight,
                  child: GestureDetector(
                    onTap: () {
                      print("service id is $serviceId");
                      statusType == "Rejected"
                          ? Navigator.pushNamed(
                              context,
                              AppRoutes.servicedetails,
                              arguments: {
                                "serviceId": serviceId,
                                "cameFromRejectedService": true,
                                "serviceDate": serviceDate,
                              },
                            )
                          : Navigator.pushNamed(
                              context,
                              AppRoutes.serviceSubmittedDataScreen,
                              arguments: {
                                "serviceId": submittedFormId,
                              },
                            );
                    },
                    child: Container(
                      padding:
                          EdgeInsets.symmetric(vertical: 6.h, horizontal: 10.w),
                      decoration: BoxDecoration(
                        color: statusType == "Rejected"
                            ? basicColor.withAlpha(27)
                            : Colors.green.shade50,
                        borderRadius: BorderRadius.circular(6.r),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.info_outline,
                              color: statusType == "Rejected"
                                  ? basicColor.withAlpha(160)
                                  : Colors.green.shade700,
                              size: 16.sp),
                          SizedBox(width: 6.w),
                          Text(
                            "View Details",
                            style: TextStyle(
                              color: statusType == "Rejected"
                                  ? basicColor.withAlpha(160)
                                  : Colors.green.shade700,
                              fontWeight: FontWeight.w600,
                              fontSize: 12.sp,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 12.h),
          ],
        ),
      ),
    );
  }
}
