import 'dart:math';
import 'package:firedesk/data/app_exceptions.dart';
import 'package:firedesk/data/reponse/status.dart';
import 'package:firedesk/models/data_models/Service_Models/group_service_details_model.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/components/general_exception_widget.dart';
import 'package:firedesk/res/components/internet_exception.dart';
import 'package:firedesk/res/components/request_timeout.dart';
import 'package:firedesk/res/components/server_exception_widget.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/view_models/providers/asset_list_provider.dart';
import 'package:firedesk/widgets/dialog/location_disable_dialog.dart';
import 'package:firedesk/widgets/dialog/location_verification_dialog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:geolocator/geolocator.dart';
import 'package:intl/intl.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

class AssetDetailScreen2 extends StatefulWidget {
  final String assetId;
  final bool cameFromScanner;
  const AssetDetailScreen2(
      {super.key, required this.assetId, required this.cameFromScanner});
  @override
  State<AssetDetailScreen2> createState() => _AssetDetailScreen2State();
}

class _AssetDetailScreen2State extends State<AssetDetailScreen2> {
  String formatDate(DateTime date) {
    final DateFormat formatter = DateFormat('dd MMM yyyy');
    return formatter.format(date);
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      final provider = Provider.of<AssetInfoProvider>(context, listen: false);
      provider.fetchAssetInfo(context, widget.assetId);
    });
  }

  bool isTodayOrPast(DateTime inspectionDate) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final dateToCheck =
        DateTime(inspectionDate.year, inspectionDate.month, inspectionDate.day);

    return dateToCheck.isBefore(today) || dateToCheck.isAtSameMomentAs(today);
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AssetInfoProvider>(
      builder: (context, assetInfoProvider, _) {
        return WillPopScope(
          onWillPop: () async {
            if (widget.cameFromScanner) {
              Navigator.popUntil(
                  context, ModalRoute.withName(AppRoutes.bottombar));
            } else {
              Navigator.pop(context);
            }
            return false;
          },
          child: ModalProgressHUD(
            inAsyncCall: assetInfoProvider.locationUpdateLoading,
            progressIndicator: const CircularProgressIndicator(
              color: Colors.blue,
            ),
            child: Scaffold(
              appBar: PreferredSize(
                preferredSize: Size.fromHeight(45.h),
                child: Material(
                  elevation: 2,
                  child: AppBar(
                    backgroundColor: basicColor,
                    leading: GestureDetector(
                      onTap: () {
                        if (widget.cameFromScanner) {
                          Navigator.popUntil(context,
                              ModalRoute.withName(AppRoutes.bottombar));
                        } else {
                          Navigator.pop(context);
                        }
                      },
                      child: const Icon(
                        Icons.arrow_back,
                        color: Colors.white,
                      ),
                    ),
                    title: Text(
                      "Asset Details",
                      style: appBarTextSTyle,
                    ),
                    centerTitle: true,
                  ),
                ),
              ),
              backgroundColor: Colors.white,
              body: contents(assetInfoProvider),
            ),
          ),
        );
      },
    );
  }

  Widget contents(AssetInfoProvider assetInfoProvider) {
    switch (assetInfoProvider.fetchAssetInfoStatus) {
      case Status.LOADING:
        return shimmerContentList();
      case Status.ERROR:
        if (assetInfoProvider.fetchAssetInfoError == InternetException) {
          return InterNetExceptionWidget(
            onPress: () {
              assetInfoProvider.fetchAssetInfo(context, widget.assetId);
            },
          );
        } else if (assetInfoProvider.fetchAssetInfoError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              assetInfoProvider.fetchAssetInfo(context, widget.assetId);
            },
          );
        } else if (assetInfoProvider.fetchAssetInfoError == ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              assetInfoProvider.fetchAssetInfo(context, widget.assetId);
            },
            error: assetInfoProvider.errorText,
          );
        } else if (assetInfoProvider.fetchAssetInfoError ==
            InvalidUrlException) {
          return GeneralExceptionWidget(
            error:
                "Asset not found or this asset does not belongs to plant assigned to you",
            onPress: () {
              assetInfoProvider.fetchAssetInfo(context, widget.assetId);
            },
          );
        } else {
          return GeneralExceptionWidget(
            onPress: () {
              assetInfoProvider.fetchAssetInfo(
                context,
                widget.assetId,
              );
            },
            error: assetInfoProvider.errorText,
          );
        }
      case Status.COMPLETED:
        bool isGroup =
            assetInfoProvider.assetInfo!.groupId != null ? true : false;
        GroupServiceDetails serviceDetails = assetInfoProvider.assetInfo!;
        return Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Padded section
                  isGroup
                      ? Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 10.w, vertical: 10.h),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text("Group Name",
                                      style: TextStyle(
                                          color: Colors.grey.withAlpha(250))),
                                  SizedBox(height: 5.h),
                                  Text(
                                    serviceDetails.groupName ?? "NA",
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 14.sp,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                  SizedBox(height: 15.h),
                                  Text("Group Description",
                                      style: TextStyle(
                                          color: Colors.grey.withAlpha(250))),
                                  SizedBox(height: 5.h),
                                  Text(
                                    serviceDetails.groupDescription ?? "NA",
                                    maxLines: 3,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 14.sp,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Divider(
                                color: Colors.grey.withAlpha(130),
                                thickness: 3),
                          ],
                        )
                      : SizedBox(),
                  Padding(
                    padding:
                        EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 190.w,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Organisation",
                                  style: TextStyle(
                                      color: Colors.grey.withAlpha(250))),
                              SizedBox(height: 5.h),
                              Text(
                                serviceDetails.orgUserId!.name ?? "NA",
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 14.sp,
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(
                          width: 190.w,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Plant",
                                  style: TextStyle(
                                      color: Colors.grey.withAlpha(250))),
                              SizedBox(height: 5.h),
                              Text(
                                serviceDetails.plantId!.plantName ?? "NA",
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 14.sp,
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  Divider(color: Colors.grey.withAlpha(130), thickness: 3),
                  // Divider(color: Colors.grey.withAlpha(130), thickness: 3),
                  Padding(
                    padding:
                        EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Inspection Dates",
                            style: TextStyle(
                                color: Colors.black,
                                fontWeight: FontWeight.w500)),
                        SizedBox(height: 5.h),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text("Next Inspection",
                                style: TextStyle(
                                    color: Colors.grey.withAlpha(250))),
                            serviceDetails.nextInspection == null
                                ? Text(
                                    "Not Assigned",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 14.sp,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  )
                                : isTodayOrPast(
                                        serviceDetails.nextInspection!.date!)
                                    ? GestureDetector(
                                        onTap: () async {
                                          print(
                                              "Next Inspection ID: ${serviceDetails.nextInspection!.id}");
                                          if (isGroup) {
                                            Navigator.pushNamed(context,
                                                AppRoutes.servicedetails,
                                                arguments: {
                                                  'serviceId': serviceDetails
                                                      .nextInspection!.id,
                                                  "cameFromRejectedService":
                                                      false,
                                                  "serviceDate": serviceDetails
                                                      .nextInspection!.date
                                                      .toString(),
                                                });
                                          } else {
                                            Position position =
                                                await _determinePosition(
                                                    context);
                                            double currentLat =
                                                position.latitude;
                                            double currentLong =
                                                position.longitude;
                                            verifyAndNavigate(
                                                currentLat,
                                                currentLong,
                                                serviceDetails
                                                    .nextInspection!.id
                                                    .toString(),
                                                widget.cameFromScanner,
                                                serviceDetails.assets![0].id ??
                                                    "");
                                          }
                                        },
                                        child: Container(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 16.w, vertical: 0),
                                          decoration: BoxDecoration(
                                            color: Colors.blue,
                                            borderRadius:
                                                BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            "Start",
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 14.sp,
                                              fontWeight: FontWeight.w400,
                                            ),
                                          ),
                                        ),
                                      )
                                    : Text(
                                        DateFormat('dd MMM yyyy').format(
                                            serviceDetails
                                                .nextInspection!.date!),
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 14.sp,
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                          ],
                        ),
                        SizedBox(
                          height: 5.h,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text("Next Testing",
                                style: TextStyle(
                                    color: Colors.grey.withAlpha(250))),
                            serviceDetails.nextTesting == null
                                ? Text(
                                    "Not Assigned",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 14.sp,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  )
                                : isTodayOrPast(
                                        serviceDetails.nextTesting!.date!)
                                    ? GestureDetector(
                                        onTap: () async {
                                          if (isGroup) {
                                            Navigator.pushNamed(context,
                                                AppRoutes.servicedetails,
                                                arguments: {
                                                  'serviceId': serviceDetails
                                                      .nextTesting!.id,
                                                  "cameFromRejectedService":
                                                      false,
                                                  "serviceDate": serviceDetails
                                                      .nextTesting!.date
                                                      .toString(),
                                                });
                                          } else {
                                            Position position =
                                                await _determinePosition(
                                                    context);
                                            double currentLat =
                                                position.latitude;
                                            double currentLong =
                                                position.longitude;
                                            verifyAndNavigate(
                                                currentLat,
                                                currentLong,
                                                serviceDetails.nextTesting!.id
                                                    .toString(),
                                                widget.cameFromScanner,
                                                serviceDetails.assets![0].id ??
                                                    "");
                                          }
                                        },
                                        child: Container(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 16.w, vertical: 0),
                                          decoration: BoxDecoration(
                                            color: Colors.blue,
                                            borderRadius:
                                                BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            "Start",
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 14.sp,
                                              fontWeight: FontWeight.w400,
                                            ),
                                          ),
                                        ),
                                      )
                                    : Text(
                                        DateFormat('dd MMM yyyy').format(
                                            serviceDetails.nextTesting!.date!),
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 14.sp,
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                          ],
                        ),
                        SizedBox(
                          height: 5.h,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text("Next Maintainance",
                                style: TextStyle(
                                    color: Colors.grey.withAlpha(250))),
                            serviceDetails.nextMaintenence == null
                                ? Text(
                                    "Not Assigned",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 14.sp,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  )
                                : isTodayOrPast(
                                        serviceDetails.nextMaintenence!.date!)
                                    ? GestureDetector(
                                        onTap: () async {
                                          if (isGroup) {
                                            Navigator.pushNamed(context,
                                                AppRoutes.servicedetails,
                                                arguments: {
                                                  'serviceId': serviceDetails
                                                      .nextMaintenence!.id,
                                                  "cameFromRejectedService":
                                                      false,
                                                  "serviceDate": serviceDetails
                                                      .nextMaintenence!.date
                                                      .toString(),
                                                });
                                          } else {
                                            Position position =
                                                await _determinePosition(
                                                    context);
                                            double currentLat =
                                                position.latitude;
                                            double currentLong =
                                                position.longitude;
                                            verifyAndNavigate(
                                                currentLat,
                                                currentLong,
                                                serviceDetails
                                                        .nextMaintenence!.id ??
                                                    "",
                                                widget.cameFromScanner,
                                                serviceDetails.assets![0].id ??
                                                    "");
                                          }
                                        },
                                        child: Container(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 16.w, vertical: 0),
                                          decoration: BoxDecoration(
                                            color: Colors.blue,
                                            borderRadius:
                                                BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            "Start",
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 14.sp,
                                              fontWeight: FontWeight.w400,
                                            ),
                                          ),
                                        ),
                                      )
                                    : Text(
                                        DateFormat('dd MMM yyyy').format(
                                            serviceDetails
                                                .nextMaintenence!.date!),
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 14.sp,
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Divider(color: Colors.grey.withAlpha(130), thickness: 3),

                  Column(
                    children: [
                      Padding(
                        padding: EdgeInsets.symmetric(
                            horizontal: 10.w, vertical: 10.h),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text("Lat-Long ",
                                style: TextStyle(
                                    color: Colors.grey.withAlpha(250))),
                            SizedBox(height: 5.h),
                            Row(children: [
                              SizedBox(
                                width: 190.w,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text("Lat",
                                        style: TextStyle(
                                            color: Colors.grey.withAlpha(250))),
                                    SizedBox(height: 5.h),
                                    Text(
                                      serviceDetails.assets![0].lat ?? "NA",
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        color: Colors.black,
                                        fontSize: 14.sp,
                                        fontWeight: FontWeight.w400,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              SizedBox(
                                width: 190.w,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text("Long",
                                        style: TextStyle(
                                            color: Colors.grey.withAlpha(250))),
                                    SizedBox(height: 5.h),
                                    Text(
                                      serviceDetails.assets![0].long ?? "NA",
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        color: Colors.black,
                                        fontSize: 14.sp,
                                        fontWeight: FontWeight.w400,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ]),
                          ],
                        ),
                      ),
                      Divider(color: Colors.grey.withAlpha(130), thickness: 3),
                    ],
                  ),
                  Padding(
                    padding:
                        EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isGroup ? "Assets" : "Asset Info",
                          style: TextStyle(
                              color: Colors.black, fontWeight: FontWeight.w500),
                        ),
                        SizedBox(height: 5.h),
                        SizedBox(
                          height: 140.h,
                          child: ListView.builder(
                            shrinkWrap: true,
                            scrollDirection: Axis.horizontal,
                            itemCount:
                                assetInfoProvider.assetInfo!.assets!.length,
                            padding: EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            itemBuilder: (context, index) {
                              final asset =
                                  assetInfoProvider.assetInfo!.assets![index];

                              return Container(
                                width:
                                    200.w, // Fixed width for consistent layout
                                margin: EdgeInsets.only(right: 12),
                                padding: EdgeInsets.symmetric(
                                    horizontal: 16.w, vertical: 8.h),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(6),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.grey.withOpacity(0.15),
                                      blurRadius: 2,
                                      offset: Offset(0, 1),
                                    ),
                                  ],
                                  border: Border.all(
                                      color: Colors.grey.withAlpha(22)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "Asset ID",
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    SizedBox(height: 2.h),
                                    Text(
                                      "${asset.assetId ?? "N/A"}",
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.black87,
                                      ),
                                    ),
                                    SizedBox(height: 4.h),
                                    Row(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Icon(
                                          Icons.location_on,
                                          color: Colors.blueAccent,
                                          size: 18,
                                        ),
                                        SizedBox(width: 6),
                                        Expanded(
                                          child: Text(
                                            "${asset.building}",
                                            // "",
                                            style: TextStyle(
                                              fontSize: 13.sp,
                                              fontWeight: FontWeight.w400,
                                              color: Colors.black87,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                            maxLines: 2,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            (!isGroup &&
                    serviceDetails.assets![0].lat == null &&
                    serviceDetails.assets![0].long == null)
                ? GestureDetector(
                    onTap: () {
                      assetInfoProvider
                          .determinePositionAndUpdateLocation(context);
                    },
                    child: Container(
                      margin: EdgeInsets.symmetric(
                          horizontal: 20.w, vertical: 20.h),
                      height: 50.h,
                      width: 370.w,
                      decoration: BoxDecoration(
                        color: basicColor,
                        borderRadius: BorderRadius.circular(22.h),
                      ),
                      child: Center(
                        child: Text(
                          "Update Lat-Long",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18.sp,
                            fontFamily: "Poppins",
                          ),
                        ),
                      ),
                    ),
                  )
                : SizedBox(
                    height: 0.h,
                    width: 0.w,
                  ),
          ],
        );
    }
  }

  Widget shimmerContentList() {
    return SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 15.w),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              height: 10.h,
            ),
            shimmerAssetInformationCard(),
            SizedBox(
              height: 10.h,
            ),
            shimmerProductInformationCard(),
            const SizedBox(
              height: 10,
            ),
            shimmerPlantInformationCard(),
            const SizedBox(
              height: 10,
            ),
          ],
        ),
      ),
    );
  }

  Future<Position> _determinePosition(BuildContext context) async {
    bool serviceEnabled;
    LocationPermission permission;

    // Check if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
      }, () async {
        Navigator.of(context).pop();
        await Geolocator.openLocationSettings();
      });
      return Future.error('Location services are disabled.');
    }

    // Check the current permission status
    permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      // Request location permission
      permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied) {
        // Navigator.of(context).pop();
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
      }, () async {
        Navigator.of(context).pop();
        await Geolocator.openAppSettings();
      });
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    // Permissions are granted, fetch the location
    return await Geolocator.getCurrentPosition();
  }

  void verifyAndNavigate(double currentLat, double currentLong,
      String serviceFormId, bool cameFromScanner, String assetId) {
    print(
        "came to verify navigate function and the value here is $currentLat and $currentLong");
    final assetInfoProvider = context.read<AssetInfoProvider>();
    Asset? asset = assetInfoProvider.assetInfo!.assets![0];

    if (asset.lat != null &&
        asset.long != null &&
        asset.lat!.isNotEmpty &&
        asset.long!.isNotEmpty &&
        asset.long != "null" &&
        asset.lat != "null") {
      print("came to if block");
      double distance = _calculateDistance(
        currentLat,
        currentLong,
        double.parse(asset.lat.toString()),
        double.parse(asset.long.toString()),
      );

      const double thresholdDistance = 5;

      if (distance <= thresholdDistance) {
        // SnackBarUtils.toastMessage(
        //     "we got to know that you are doing work in the same location where we installed the asset");

        showLocationVerificationDialog(context, () {
          if (cameFromScanner) {
            Navigator.pushNamed(context, AppRoutes.inspectionFormScreen,
                arguments: {
                  "cameFromRejectedService": false,
                  "geoCheck": "Inside",
                  "serviceFormId": serviceFormId,
                  "cameFromAssetDetails": true,
                });
          } else {
            Navigator.pushNamed(
              context,
              AppRoutes.qrCodeScreen,
              arguments: {
                "cameFromRejectedService": false,
                "cameFromAssetDetailsScreen": true,
                "geoCheck": "Inside",
                "comingFromServiceDetail": false,
                "serviceFormId": serviceFormId,
                "assetId": assetId,
              },
            );
          }
        }, () {
          Navigator.pop(context);
        }, "You are within the boundary asset location verified successfully");
      } else {
        showLocationVerificationDialog(context, () {
          if (cameFromScanner) {
            Navigator.pushNamed(context, AppRoutes.inspectionFormScreen,
                arguments: {
                  "cameFromRejectedService": false,
                  "geoCheck": "Outside",
                  "serviceFormId": serviceFormId,
                  "cameFromAssetDetails": true,
                });
          } else {
            Navigator.pushNamed(
              context,
              AppRoutes.qrCodeScreen,
              arguments: {
                "cameFromRejectedService": false,
                "cameFromAssetDetailsScreen": true,
                "geoCheck": "Outside",
                "comingFromServiceDetail": false,
                "serviceFormId": serviceFormId,
                "assetId": assetId,
              },
            );
          }
        }, () {
          Navigator.pop(context);
        }, "You are away from asset location by more than 5 meters,Do you still want to continue",
            isCancel: true, onCancel: () {});
      }
    } else {
      showLocationVerificationDialog(context, () {}, () {
        Navigator.pop(context);
      }, "Lat-Long has not been added to this asset please add before starting the service");
    }
  }

  double _calculateDistance(
      double lat1, double lon1, double lat2, double lon2) {
    const double radiusEarth = 6371000; // Radius of Earth in meters
    double dLat = _toRadians(lat2 - lat1);
    double dLon = _toRadians(lon2 - lon1);

    double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(_toRadians(lat1)) *
            cos(_toRadians(lat2)) *
            sin(dLon / 2) *
            sin(dLon / 2);

    double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return radiusEarth * c;
  }

// Function to convert degrees to radians
  double _toRadians(double degree) {
    return degree * pi / 180;
  }

  /// Helper: Checks if a date is today or in the past
  bool checkIfPastOrToday(DateTime? date) {
    if (date == null) return false;
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final compareDate = DateTime(date.year, date.month, date.day);

    return compareDate.isBefore(today) || compareDate.isAtSameMomentAs(today);
  }

  // /// Helper: Formats date to a readable string
  // String formatDate(DateTime date) {
  //   return "${date.day.toString().padLeft(2, '0')}-${date.month.toString().padLeft(2, '0')}-${date.year}";
  // }

  Widget buildProductInfoRow(IconData icon, String title, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 6.h),
      child: Row(
        children: [
          Icon(icon, size: 20.sp, color: Colors.grey[600]),
          SizedBox(width: 8.w),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 14.sp,
                fontWeight: FontWeight.w600,
                color: Colors.grey[800],
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: TextStyle(
                fontSize: 14.sp,
                fontWeight: FontWeight.w500,
                color: Colors.grey[600],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget buildInfoRow(String title, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 6.h),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 14.sp,
                fontWeight: FontWeight.w600,
                color: Colors.grey[800],
              ),
            ),
          ),
          SizedBox(width: 8.w),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: TextStyle(
                fontSize: 14.sp,
                fontWeight: FontWeight.w500,
                color: Colors.grey[600],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget buildDateRow(
      String title1, String value1, String title2, String value2) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4.h),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          buildInfoRow(title1, value1),
          buildInfoRow(title2, value2),
        ],
      ),
    );
  }

  Widget buildStatusCard(String title, String value) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 6.h, horizontal: 12.w),
      decoration: BoxDecoration(
        color: value == "Active" ? Colors.green[100] : Colors.red[100],
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            value == "Active" ? Icons.check_circle : Icons.error,
            size: 16.w,
            color: value == "Active" ? Colors.green : Colors.red,
          ),
          SizedBox(width: 8.w),
          Text(
            "$title: $value",
            style: TextStyle(
              fontSize: 14.sp,
              fontWeight: FontWeight.w600,
              color: value == "Active" ? Colors.green[800] : Colors.red[800],
            ),
          ),
        ],
      ),
    );
  }

  Widget shimmerAssetInformationCard() {
    return Material(
      elevation: 6,
      borderRadius: BorderRadius.circular(16.r),
      shadowColor: Colors.black.withOpacity(0.1),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16.r),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        width: 380.w,
        padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
        child: Shimmer.fromColors(
          baseColor: Colors.grey[300]!,
          highlightColor: Colors.grey[100]!,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title Placeholder
              Container(
                width: 180.w,
                height: 20.h,
                color: Colors.grey[300],
              ),
              SizedBox(height: 10.h),

              // Health Status Row Placeholder
              Row(
                children: [
                  Container(
                    width: 100.w,
                    height: 16.h,
                    color: Colors.grey[300],
                  ),
                  SizedBox(width: 5.w),
                  CircleAvatar(
                    backgroundColor: Colors.grey[300],
                    radius: 8.r,
                  ),
                ],
              ),
              SizedBox(height: 20.h),

              // Asset Info Row 1 (Asset ID and Sl No/Part No)
              Row(
                children: [
                  Expanded(
                    flex: 5,
                    child: Column(
                      children: [
                        Container(
                          width: 80.w,
                          height: 16.h,
                          color: Colors.grey[300],
                        ),
                        SizedBox(height: 6.h),
                        Container(
                          width: 100.w,
                          height: 16.h,
                          color: Colors.grey[300],
                        ),
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 35.h,
                    child: VerticalDivider(
                      color: Colors.grey[300],
                      thickness: 2,
                    ),
                  ),
                  Expanded(
                    flex: 5,
                    child: Column(
                      children: [
                        Container(
                          width: 80.w,
                          height: 16.h,
                          color: Colors.grey[300],
                        ),
                        SizedBox(height: 6.h),
                        Container(
                          width: 100.w,
                          height: 16.h,
                          color: Colors.grey[300],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 10.h),

              // Divider Placeholder
              Divider(
                thickness: 1,
                color: Colors.grey[300],
              ),

              // Information Rows with Icon Placeholders
              for (int i = 0; i < 7; i++) ...[
                _buildShimmerInfoRow(),
                if (i < 6)
                  Divider(
                    thickness: 1,
                    color: Colors.grey[300],
                  ),
              ],
            ],
          ),
        ),
      ),
    );
  }

// Helper Widget to build shimmer info rows with icon and text placeholders
  Widget _buildShimmerInfoRow() {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 6.h),
      child: Row(
        children: [
          // Icon Placeholder
          Container(
            width: 18.sp,
            height: 18.sp,
            color: Colors.grey[300],
          ),
          SizedBox(width: 12.w),
          // Label Placeholder
          Expanded(
            child: Container(
              width: double.infinity,
              height: 16.h,
              color: Colors.grey[300],
            ),
          ),
          // Value Placeholder
          Expanded(
            child: Container(
              width: double.infinity,
              height: 16.h,
              color: Colors.grey[300],
            ),
          ),
        ],
      ),
    );
  }

  Widget shimmerProductInformationCard() {
    return Material(
      elevation: 6,
      borderRadius: BorderRadius.circular(16.r),
      shadowColor: Colors.black.withOpacity(0.1),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16.r),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        width: 380.w,
        child: Padding(
          padding: EdgeInsets.all(20.w),
          child: Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 200.w,
                  height: 20.h,
                  color: Colors.grey[300],
                ),
                SizedBox(height: 20.h),
                buildShimmerInfoRow(),
                buildShimmerDivider(),
                buildShimmerInfoRow(),
                buildShimmerDivider(),
                buildShimmerInfoRow(),
                buildShimmerDivider(),
                buildShimmerInfoRow(),
                buildShimmerDivider(),
                buildShimmerInfoRow(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget shimmerPlantInformationCard() {
    return Material(
      elevation: 6,
      borderRadius: BorderRadius.circular(16.r),
      shadowColor: Colors.black.withOpacity(0.1),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16.r),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        width: 380.w,
        child: Padding(
          padding: EdgeInsets.all(20.w),
          child: Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 200.w,
                  height: 20.h,
                  color: Colors.grey[300],
                ),
                SizedBox(height: 20.h),
                buildShimmerInfoRow(),
                buildShimmerDivider(),
                buildShimmerInfoRow(),
                buildShimmerDivider(),
                buildShimmerInfoRow(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget buildShimmerInfoRow() {
    return Container(
      width: double.infinity,
      height: 16.h,
      color: Colors.grey[300],
    );
  }

  Widget buildShimmerDivider() {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 10.h),
      child: Container(
        height: 1.h,
        color: Colors.grey[300],
      ),
    );
  }

  Widget viewHistoyContainer() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 10.h),
      child: Container(
        height: 50.h,
        decoration: BoxDecoration(
            color: basicColor.withOpacity(0.5),
            borderRadius: BorderRadius.circular(4)),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              width: 10.w,
            ),
            const Icon(
              Icons.history,
              color: Colors.white,
            ),
            Padding(
              padding: EdgeInsets.symmetric(
                horizontal: 10.w,
                vertical: 10.h,
              ),
              child: Text(
                "View History",
                style: normalWhiteTextStyle,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget captureLocationContainer() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 10.h),
      child: Container(
        height: 50.h,
        decoration: BoxDecoration(
            color: basicColor.withOpacity(0.5),
            borderRadius: BorderRadius.circular(4)),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              width: 10.w,
            ),
            const Icon(
              Icons.location_on,
              color: Colors.white,
            ),
            Padding(
              padding: EdgeInsets.symmetric(
                horizontal: 10.w,
                vertical: 10.h,
              ),
              child: Text(
                "Capture Location",
                style: normalWhiteTextStyle,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
