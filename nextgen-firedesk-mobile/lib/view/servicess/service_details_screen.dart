import "dart:math";
import "package:firedesk/data/app_exceptions.dart";
import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/models/data_models/Service_Models/service_detail_model.dart";
import "package:firedesk/repository/assets/my_assets_repository.dart";
import "package:firedesk/res/api_urls/api_urls.dart";
import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/components/general_exception_widget.dart";
import "package:firedesk/res/components/internet_exception.dart";
import "package:firedesk/res/components/request_timeout.dart";
import "package:firedesk/res/components/server_exception_widget.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/res/styles/text_style.dart";
import "package:firedesk/utils/snack_bar_utils.dart";
import "package:firedesk/view_models/providers/service_detail_screen_provider.dart";
import "package:firedesk/widgets/dialog/location_disable_dialog.dart";
import "package:firedesk/widgets/dialog/location_verification_dialog.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:geolocator/geolocator.dart";
import "package:intl/intl.dart";
import "package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart";
import "package:provider/provider.dart";
import "package:shimmer/shimmer.dart";

class ServiceDetailsScreen extends StatefulWidget {
  final String serviceId;
  final bool cameFromRejectedService;
  final String serviceDate;

  const ServiceDetailsScreen({
    super.key,
    required this.serviceId,
    required this.cameFromRejectedService,
    required this.serviceDate,
  });
  @override
  State<ServiceDetailsScreen> createState() => _ServiceDetailsScreenState();
}

class _ServiceDetailsScreenState extends State<ServiceDetailsScreen> {
  List<String> list = <String>['Status1', 'Status2', 'Status3', 'Status4'];
  String dropdownValue = "Status1";
  bool canStart = false;
  bool locationUpdateLoading = false;
  final MyAssetsRepository _apiService = MyAssetsRepository();

  @override
  void initState() {
    super.initState();
    // debugPrint("show submit button value is  ${widget.showSubmitButton}");

    print("serviceId is ${widget.serviceId}");

    WidgetsBinding.instance.addPostFrameCallback(
      (timeStamp) {
        if (kDebugMode) {
          // debugPrint(
          // "serviceId is ${widget.serviceId} and serviceType is ${widget.serviceType}");
        }
        final provider =
            Provider.of<ServiceDetailScreenProvider>(context, listen: false);
        provider.fetchServiceInfo(context, widget.serviceId);
        String todayDate = getTodayDate();
        validateServiceDate(widget.serviceDate.toString());
        if (kDebugMode) {
          debugPrint("service date  of widget is ${widget.serviceDate}");
          debugPrint("today date is $todayDate");
        }
      },
    );
  }

  String getTodayDate() {
    final now = DateTime.now();
    return DateFormat('yyyy-MM-dd HH:mm:ss.SSS').format(now);
  }

  void validateServiceDate(String serviceDateStr) {
    final now = DateTime.now();

    // Parse the serviceDate string
    final serviceDate = DateTime.parse(serviceDateStr);

    // Normalize dates to compare only the date part
    final today = DateTime(now.year, now.month, now.day);
    final serviceDateNormalized =
        DateTime(serviceDate.year, serviceDate.month, serviceDate.day);

    if (serviceDateNormalized.isBefore(today)) {
      debugPrint("Service date has passed.");
      canStart = true;
    } else if (serviceDateNormalized.isAtSameMomentAs(today)) {
      canStart = true;
      debugPrint("Service date is today.");
    } else {
      canStart = false;
      debugPrint("Service date is yet to come.");
    }
  }

  @override
  Widget build(BuildContext context) {
    return ModalProgressHUD(
      inAsyncCall: locationUpdateLoading,
      progressIndicator: const CircularProgressIndicator(
        color: Colors.blue,
      ),
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
              title: Text("Service Details", style: appBarTextSTyle),
              centerTitle: true,
              actions: const [],
            ),
          ),
        ),
        body: Consumer<ServiceDetailScreenProvider>(
          builder: (context, serviceDetailsScreenPrvider, _) {
            switch (serviceDetailsScreenPrvider.serviceDataStatus) {
              case Status.LOADING:
                return shimmerContentList();
              case Status.ERROR:
                debugPrint(
                    "error is ${serviceDetailsScreenPrvider.serviceDataError}");
                if (serviceDetailsScreenPrvider.serviceDataError ==
                    InternetException) {
                  return InterNetExceptionWidget(
                    onPress: () {
                      serviceDetailsScreenPrvider.fetchServiceInfo(
                          context, widget.serviceId);
                    },
                  );
                } else if (serviceDetailsScreenPrvider.serviceDataError ==
                    RequestTimeOut) {
                  return RequestTimeOutWidget(
                    onPress: () {
                      serviceDetailsScreenPrvider.fetchServiceInfo(
                          context, widget.serviceId);
                    },
                  );
                } else if (serviceDetailsScreenPrvider.serviceDataError ==
                    ServerException) {
                  return ServerExceptionWidget(
                    onPress: () {
                      serviceDetailsScreenPrvider.fetchServiceInfo(
                          context, widget.serviceId);
                    },
                  );
                } else {
                  return GeneralExceptionWidget(
                    onPress: () {
                      serviceDetailsScreenPrvider.fetchServiceInfo(
                          context, widget.serviceId);
                    },
                  );
                }
              case Status.COMPLETED:
                bool isGroup = serviceDetailsScreenPrvider
                            .serviceDetails!.individualService ==
                        false
                    ? true
                    : false;
                ServiceDetails serviceDetails =
                    serviceDetailsScreenPrvider.serviceDetails!;
                return Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _infoTile(
                            title: "Category Name",
                            value: serviceDetails.categoryId ?? "NA",
                            icon: Icons.category,
                          ),
                          _infoTile(
                            title: "Plant",
                            value: serviceDetails.plantId ?? "NA",
                            icon: Icons.local_florist_outlined,
                          ),
                          if (serviceDetails.individualService == true &&
                              serviceDetails.assetsId != null &&
                              serviceDetails.assetsId!.isNotEmpty)
                            _latLongTile(
                              lat: serviceDetails.assetsId![0].lat ?? "NA",
                              long: serviceDetails.assetsId![0].long ?? "NA",
                            ),
                          _dualInfoTile(
                            title1: "Service Type",
                            value1: serviceDetails.serviceType ?? "NA",
                            icon1: Icons.build_outlined,
                            title2: "Service Date",
                            value2: serviceDetails.date != null
                                ? DateFormat('d MMM yyyy')
                                    .format(serviceDetails.date!)
                                : "NA",
                            icon2: Icons.calendar_today_outlined,
                          ),
                          _infoTile(
                            title: "Service Frequency",
                            value: serviceDetails.serviceFrequency ?? "NA",
                            icon: Icons.repeat,
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(
                                horizontal: 10.w, vertical: 10.h),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(isGroup ? "Assets" : "Asset Info",
                                    style: TextStyle(
                                        color: Colors.black,
                                        fontWeight: FontWeight.w500)),
                                SizedBox(height: 5.h),
                                SizedBox(
                                    height: 140.h,
                                    child: ListView.builder(
                                      shrinkWrap: true,
                                      scrollDirection: Axis.horizontal,
                                      itemCount: serviceDetailsScreenPrvider
                                          .serviceDetails!.assetsId!.length,
                                      padding: EdgeInsets.symmetric(
                                          horizontal: 12, vertical: 8),
                                      itemBuilder: (context, index) {
                                        final asset =
                                            serviceDetailsScreenPrvider
                                                .serviceDetails!
                                                .assetsId![index];
                                        return Container(
                                          width: 200
                                              .w, // Fixed width for consistent layout
                                          margin: EdgeInsets.only(right: 12),
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 16.w, vertical: 8.h),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            borderRadius:
                                                BorderRadius.circular(6),
                                            boxShadow: [
                                              BoxShadow(
                                                color: Colors.grey
                                                    .withOpacity(0.15),
                                                blurRadius: 2,
                                                offset: Offset(0, 1),
                                              ),
                                            ],
                                            border: Border.all(
                                                color:
                                                    Colors.grey.withAlpha(22)),
                                          ),
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
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
                                                      "${asset.building ?? ""},${asset.location ?? ""}",
                                                      style: TextStyle(
                                                        fontSize: 13.sp,
                                                        fontWeight:
                                                            FontWeight.w400,
                                                        color: Colors.black87,
                                                      ),
                                                      overflow:
                                                          TextOverflow.ellipsis,
                                                      maxLines: 2,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    )),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        if (serviceDetails.individualService == false ||
                            (serviceDetails.assetsId![0].lat != null &&
                                serviceDetails.assetsId![0].long != null)) {
                          serviceDetails.individualService == true
                              ? verifyLocationAndNavigate(
                                  latitude:
                                      serviceDetails.assetsId![0].lat ?? "",
                                  longitude:
                                      serviceDetails.assetsId![0].long ?? "",
                                  assetId: serviceDetails.assetsId![0].id ?? "",
                                )
                              : Navigator.pushNamed(
                                  context,
                                  AppRoutes.inspectionFormScreen,
                                  arguments: {
                                    "cameFromRejectedService":
                                        widget.cameFromRejectedService,
                                    "serviceFormId": widget.serviceId,
                                    "geoCheck": "NA",
                                    "cameFromAssetDetails": false,
                                  },
                                );
                        } else {
                          print(
                              "came to else block and locationUploading value is $locationUpdateLoading");
                          if (!locationUpdateLoading) {
                            () async {
                              print(
                                  "starting determinePositionAndUpdateLocation...");
                              await determinePositionAndUpdateLocation(
                                  context,
                                  setState,
                                  serviceDetails.assetsId![0].id ?? "");
                            }();
                          }
                        }
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
                            (serviceDetails.individualService == false ||
                                    (serviceDetails.assetsId![0].lat != null &&
                                        serviceDetails.assetsId![0].long !=
                                            null))
                                ? "Start Service"
                                : "Update Lat-Long",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18.sp,
                              fontFamily: "Poppins",
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              default:
                return shimmerContentList();
            }
          },
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

  void verifyLocationAndNavigate(
      {required String latitude,
      required String longitude,
      required String assetId}) async {
    Position position = await _determinePosition(context);
    double currentLat = position.latitude;
    double currentLong = position.longitude;

    double distance = _calculateDistance(
      currentLat,
      currentLong,
      double.parse(latitude.toString()),
      double.parse(longitude.toString()),
    );

    const double thresholdDistance = 5;

    if (distance <= thresholdDistance) {
      // SnackBarUtils.toastMessage(
      //     "we got to know that you are doing work in the same location where we installed the asset");

      showLocationVerificationDialog(context, () {
        Navigator.pushNamed(
          context,
          AppRoutes.qrCodeScreen,
          arguments: {
            "cameFromRejectedService": widget.cameFromRejectedService,
            "serviceFormId": widget.serviceId,
            "geoCheck": "Inside",
            "cameFromAssetDetailsScreen": false,
            "comingFromServiceDetail": true,
            "assetId": assetId,
          },
        );
      }, () {
        Navigator.pop(context);
      }, "You are within the boundary asset location verified successfully");
    } else {
      showLocationVerificationDialog(context, () {
        Navigator.pushNamed(
          context,
          AppRoutes.qrCodeScreen,
          arguments: {
            "cameFromRejectedService": false,
            "cameFromAssetDetailsScreen": true,
            "geoCheck": "Outside",
            "comingFromServiceDetail": false,
            "serviceFormId": widget.serviceId,
            "assetId": assetId,
          },
        );
      }, () {
        Navigator.pop(context);
      }, "You are away from asset location by more than 5 meters,Do you still want to continue",
          isCancel: true, onCancel: () {});
    }
  }

  Future<void> determinePositionAndUpdateLocation(
    BuildContext context,
    void Function(void Function()) setState,
    String assetId,
  ) async {
    print("came inside function");
    setState(() {
      locationUpdateLoading = true;
    });

    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
      }, () async {
        Navigator.of(context).pop();
        await Geolocator.openLocationSettings();
      });
      setState(() {
        locationUpdateLoading = false;
      });
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        Navigator.of(context).pop();
        setState(() {
          locationUpdateLoading = false;
        });
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
      setState(() {
        locationUpdateLoading = false;
      });
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    Position position = await Geolocator.getCurrentPosition();

    // ServiceDetails serviceDetails =
    //     context.read<ServiceDetailScreenProvider>().serviceDetails!;

    print("assetId is $assetId");

    Map<String, dynamic> data = {
      "lat": position.latitude.toString(),
      "long": position.longitude.toString(),
      "assetId": assetId,
    };

    await _apiService
        .updateAssetInfo(context, ApiUrls.updateLocationUrl, data)
        .then((value) {
      context.read<ServiceDetailScreenProvider>().updateServiceAssetLatLong(
          position.latitude.toString(), position.longitude.toString());
      SnackBarUtils.toastMessage("Service asset location updated successfully");
    }).onError((error, stackTrace) {
      if (kDebugMode) {
        debugPrint("$error");
      }
      SnackBarUtils.toastMessage(error.toString());
    }).whenComplete(() {
      setState(() {
        locationUpdateLoading = false;
      });
    });

    print("came to end");
  }

  Widget _buildModernInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 6.h),
      child: Row(
        children: [
          Icon(icon, size: 18.sp, color: Colors.grey[600]),
          SizedBox(width: 12.w),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 14.sp,
                fontWeight: FontWeight.w500,
                color: Colors.grey[700],
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: TextStyle(
                fontSize: 14.sp,
                fontWeight: FontWeight.w400,
                color: Colors.grey[900],
              ),
            ),
          ),
        ],
      ),
    );
  }

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

  Widget shimmerContentList() {
    return Scaffold(
      // backgroundColor: Colors.white,
      // appBar: PreferredSize(
      //   preferredSize: Size.fromHeight(45.h),
      //   child: Material(
      //     elevation: 2,
      //     child: AppBar(
      //       backgroundColor: basicColor,
      //       leading: GestureDetector(
      //         onTap: () {
      //           Navigator.pop(context);
      //         },
      //         child: const Icon(
      //           Icons.arrow_back,
      //           color: Colors.white,
      //         ),
      //       ),
      //       title: Text(
      //         "Service Details",
      //         style: appBarTextSTyle,
      //       ),
      //       centerTitle: true,
      //     ),
      //   ),
      // ),
      body: SingleChildScrollView(
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
              Container(
                width: 180.w,
                height: 20.h,
                color: Colors.grey[300],
              ),
              SizedBox(height: 10.h),
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

  Widget _infoTile({
    required String title,
    required String value,
    required IconData icon,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.blueAccent),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 15,
                    color: Colors.black87,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _dualInfoTile({
    required String title1,
    required String value1,
    required IconData icon1,
    required String title2,
    required String value2,
    required IconData icon2,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
      child: Row(
        children: [
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(icon1, size: 20, color: Colors.orangeAccent),
                SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title1,
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 13,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        value1,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(icon2, size: 20, color: Colors.green),
                SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title2,
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 13,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        value2,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _latLongTile({required String lat, required String long}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
      child: Row(
        children: [
          Icon(Icons.location_on_outlined, size: 20, color: Colors.redAccent),
          SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Latitude",
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 13,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  lat,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Longitude",
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 13,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  long,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
