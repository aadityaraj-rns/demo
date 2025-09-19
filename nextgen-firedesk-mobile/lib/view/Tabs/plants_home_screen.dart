import 'package:animated_custom_dropdown/custom_dropdown.dart';
import 'package:firedesk/data/app_exceptions.dart';
import 'package:firedesk/data/reponse/status.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/components/general_exception_widget.dart';
import 'package:firedesk/res/components/internet_exception.dart';
import 'package:firedesk/res/components/request_timeout.dart';
import 'package:firedesk/res/components/server_exception_widget.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/res/styles/text_styles.dart';
import 'package:firedesk/utils/snack_bar_utils.dart';
import 'package:firedesk/view/Layouts/layouts_screen.dart';
import 'package:firedesk/view_models/providers/plants_screen_provider.dart';
import 'package:firedesk/view_models/providers/user_provider.dart';
import 'package:firedesk/widgets/dialog/camera_disabled_dialog.dart';
import 'package:firedesk/widgets/dialog/delete_dialog.dart';
import 'package:firedesk/widgets/dialog/logout_dialog.dart';
import 'package:firedesk/widgets/dialog/notification_permission_request_dialog.dart';
import 'package:firedesk/widgets/sidebar_item_container.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:lottie/lottie.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

enum NotificationPermissionStatus {
  granted,
  denied,
  notDetermined,
}

class PlantsHomeScreen extends StatefulWidget {
  const PlantsHomeScreen({super.key});
  @override
  State<PlantsHomeScreen> createState() => _PlantsHomeScreenState();
}

class _PlantsHomeScreenState extends State<PlantsHomeScreen>
    with SingleTickerProviderStateMixin {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  bool isScannerVisible = false;

  @override
  void initState() {
    super.initState();
    // WidgetsBinding.instance.addPostFrameCallback((timeStamp) async{
    //   final provider =
    //       Provider.of<PlantsScreenProvider>(context, listen: false);
    //   await provider.fetchMyPlants(context);
    // });
    _requestNotificationPermission();
  }

  Future<void> _requestNotificationPermission() async {
    // Check if notification permission is already granted
    NotificationPermissionStatus status = await _checkNotificationPermission();

    if (status == NotificationPermissionStatus.denied) {
      showNotificationPermissionRequestDialog(
          context,
          "Notification Permission Required",
          "We need permission to send you notifications. Please enable them in the settings.");
    } else if (status == NotificationPermissionStatus.notDetermined) {
      // Request notification permission
      await _requestPermission();
    }
  }

  Future<NotificationPermissionStatus> _checkNotificationPermission() async {
    final status = await Permission.notification.status;
    if (status.isGranted) {
      debugPrint("notification permission is granted");
      return NotificationPermissionStatus.granted;
    } else if (status.isDenied) {
      return NotificationPermissionStatus.denied;
    } else {
      return NotificationPermissionStatus.notDetermined;
    }
  }

  Future<void> _requestPermission() async {
    final permissionStatus = await Permission.notification.request();

    if (permissionStatus.isGranted) {
      // Permission granted, proceed with notifications
      debugPrint('Notification Permission Granted');
    } else {
      // Permission denied, show a message or dialog
      showNotificationPermissionRequestDialog(
          context,
          "Notification Permission Required",
          "We need permission to send you notifications. Please enable them in the settings.");
    }
  }

  void toggleScannerVisibility() {
    setState(() {
      isScannerVisible = !isScannerVisible;
    });
  }

  List<String> categories = ["category 1", "category 2", "category 3"];

  @override
  Widget build(BuildContext context) {
    return Consumer<PlantsScreenProvider>(
        builder: (context, plantsProvider, _) {
      return Scaffold(
        backgroundColor: const Color(0xFFFBFBFB),
        key: _scaffoldKey,
        appBar: PreferredSize(
          preferredSize: Size.fromHeight(60.h),
          child: Material(
            elevation: 2,
            child: AppBar(
              leading: IconButton(
                onPressed: () {
                  _scaffoldKey.currentState?.openDrawer();
                  final profileProvider = Provider.of<AuthenticationProvider>(
                      context,
                      listen: false);
                  profileProvider.profileData(context);
                },
                icon: const Icon(
                  Icons.menu,
                  color: Colors.white,
                ),
              ),
              backgroundColor: basicColor,
              automaticallyImplyLeading: false,
              title: Image.asset(
                "assets/Logos/firedesk white logo.png",
                height: 40.h,
                width: 300.w,
              ),
              centerTitle: true,
              actions: [
                Padding(
                  padding: EdgeInsets.only(right: 10.w),
                  child: Row(
                    children: [
                      IconButton(
                        onPressed: () async {
                          _checkPermissionAndNavigate(context);
                        },
                        icon: const Icon(
                          Icons.qr_code_scanner,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        drawer: Drawer(
          child: Consumer<AuthenticationProvider>(
              builder: (context, profileProvider, _) {
            return ListView(
              padding: EdgeInsets.zero,
              children: <Widget>[
                SizedBox(
                  height: 309.h,
                  child: DrawerHeader(
                    decoration: BoxDecoration(
                      color: basicColor,
                    ),
                    child: (profileProvider.profileStatus == Status.LOADING)
                        ? const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              CircularProgressIndicator(
                                color: Colors.white,
                              )
                            ],
                          )
                        : (profileProvider.profileStatus == Status.COMPLETED)
                            ? Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  (profileProvider.techniCian2!.userId!
                                                  .profile !=
                                              null &&
                                          profileProvider.techniCian2!.userId!
                                              .profile!.isNotEmpty)
                                      ? CircleAvatar(
                                          radius: 80.r,
                                          backgroundImage: NetworkImage(
                                            '${profileProvider.techniCian2!.userId!.profile}',
                                          ),
                                        )
                                      : CircleAvatar(
                                          backgroundColor: Colors.white,
                                          radius: 80.r,
                                          child: Icon(
                                            Icons.person,
                                            size: 100.r,
                                            color: darkGreyColor.withAlpha(200),
                                          ),
                                        ),
                                  Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        Text(
                                          '${profileProvider.techniCian2!.userId!.name}',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          textAlign: TextAlign.center,
                                        ),
                                        Text(
                                          '${profileProvider.techniCian2!.userId!.email}',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 14,
                                            fontWeight: FontWeight.w700,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          textAlign: TextAlign.center,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              )
                            : const SizedBox(),
                  ),
                ),
                sideBarItemContainer(
                  "My Organisation",
                  Icons.corporate_fare,
                  callback: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.organisationdetails);
                  },
                ),
                SideBarItemContainer2(
                  title: "Plants",
                  icon: CircleAvatar(
                    radius: 18,
                    backgroundColor: darkGreyColor.withAlpha(200),
                    child: const Icon(
                      Icons.dashboard_customize_outlined,
                      size: 20,
                      color: Colors.white,
                    ),
                  ),
                  callback: () {
                    Navigator.pop(context);
                    // Navigator.pushNamed(context, '/layoutsscreen');
                  },
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: Divider(
                    color: Colors.grey,
                    thickness: 0.5,
                  ),
                ),
                sideBarItemContainer(
                  "Privacy Policy",
                  Icons.corporate_fare,
                  callback: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.privacyPolicyScreen);
                  },
                ),
                sideBarItemContainer(
                  "Terms And Conditions",
                  Icons.corporate_fare,
                  callback: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(
                        context, AppRoutes.termsAndConditionsScreen);
                  },
                ),
                sideBarItemContainer(
                  "Delete",
                  Icons.delete,
                  callback: () {
                    showDeleteDialog(context);
                  },
                ),
                sideBarItemContainer(
                  "LogOut",
                  Icons.exit_to_app_rounded,
                  callback: () {
                    showLogoutDialog(context);
                  },
                ),
                SizedBox(
                  height: 120.h,
                ),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10.w),
                  child: Text("FireDesk V1.0.0+4", style: mBlackTextStyle),
                ),
              ],
            );
          }),
        ),
        body: getContents(context, plantsProvider),
      );
    });
  }
}

void _checkPermissionAndNavigate(BuildContext context) async {
  final status = await Permission.camera.request();

  if (status.isDenied) {
    SnackBarUtils.toastMessage(
        "Camera permission is required to scan QR codes.");
    // Navigator.pop(context);
    return;
  }

  if (status.isPermanentlyDenied) {
    showCameraDisabledDialog(context);
  }

  if (status.isGranted) {
    Navigator.pushNamed(
      context,
      AppRoutes.qrCodeScreen,
      arguments: {
        'cameFromAssetDetailsScreen': false,
        "cameFromRejectedService": false,
        "geoCheck": "",
        "comingFromServiceDetail":false,
        "serviceFormId":"",
        "assetId":"",
      },
    );
  }
}

Widget drawerContents(
    BuildContext context, AuthenticationProvider authProvider) {
  switch (authProvider.profileStatus) {
    case Status.LOADING:
      return const Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(
            color: Colors.white,
          )
        ],
      );
    case Status.ERROR:
      if (authProvider.profileDataError == InternetException) {
        return InterNetExceptionWidget(
          onPress: () {
            authProvider.profileData(context);
          },
        );
      } else if (authProvider.profileDataError == RequestTimeOut) {
        return RequestTimeOutWidget(
          onPress: () {
            authProvider.profileData(context);
          },
        );
      } else if (authProvider.profileDataError == ServerException) {
        return ServerExceptionWidget(
          onPress: () {
            authProvider.profileData(context);
          },
        );
      } else {
        return GeneralExceptionWidget(
          onPress: () {
            authProvider.profileData(context);
          },
        );
      }
    case Status.COMPLETED:
      return Column(
        mainAxisSize: MainAxisSize.max,
        children: [
          (authProvider.techniCian2!.userId!.profile != null &&
                  authProvider.techniCian2!.userId!.profile!.isNotEmpty)
              ? CircleAvatar(
                  radius: 80.r,
                  backgroundImage: NetworkImage(
                    '${authProvider.techniCian2!.userId!.profile}',
                  ),
                )
              : CircleAvatar(
                  radius: 80.r,
                  child: const Icon(
                    Icons.person,
                    color: Colors.white,
                  ),
                ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  '${authProvider.techniCian2!.userId!.name}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),
                Text(
                  '${authProvider.techniCian2!.userId!.email}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      );
    default:
      return const Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(
            color: Colors.white,
          )
        ],
      );
  }
}

Widget getContents(BuildContext context, PlantsScreenProvider plantsProvider) {
  switch (plantsProvider.allPlantsStatus) {
    case Status.LOADING:
      return _buildShimmerLoadingWidget();
    case Status.ERROR:
      if (kDebugMode) {
        debugPrint("error is ${plantsProvider.allPlantsError}");
      }
      if (plantsProvider.allPlantsError == InternetException) {
        return InterNetExceptionWidget(
          onPress: () {
            plantsProvider.fetchMyPlants(context);
          },
        );
      } else if (plantsProvider.allPlantsError == RequestTimeOut) {
        return RequestTimeOutWidget(
          onPress: () {
            plantsProvider.fetchMyPlants(context);
          },
        );
      } else if (plantsProvider.allPlantsError == ServerException) {
        return ServerExceptionWidget(
          onPress: () {
            plantsProvider.fetchMyPlants(context);
          },
        );
      } else {
        return GeneralExceptionWidget(
          onPress: () {
            plantsProvider.fetchMyPlants(context);
          },
        );
      }
    case Status.COMPLETED:
      return Column(
        children: [
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
            child: CustomDropdown<String>.search(
              initialItem: plantsProvider.plantNames[0],
              decoration: CustomDropdownDecoration(
                closedFillColor: Colors.grey[200],
                expandedFillColor: Colors.grey[100],
                closedShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 6,
                    offset: const Offset(0, 1),
                  ),
                ],
                expandedShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.2),
                    blurRadius: 2,
                    offset: const Offset(0, 2),
                  ),
                ],
                closedBorder: Border.all(
                  color: Colors.grey[300]!,
                  width: 1.0,
                ),
                closedBorderRadius: BorderRadius.circular(8),
                closedErrorBorder: Border.all(
                  color: Colors.redAccent,
                  width: 1.0,
                ),
                closedErrorBorderRadius: BorderRadius.circular(8),
                expandedBorder: Border.all(
                  color: Colors.blueAccent.withOpacity(0.5),
                  width: 1.0,
                ),
                expandedBorderRadius: BorderRadius.circular(8),
                hintStyle: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
                headerStyle: const TextStyle(
                  color: Colors.black,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
                noResultFoundStyle: const TextStyle(
                  color: Colors.redAccent,
                  fontSize: 14,
                ),
                errorStyle: const TextStyle(
                  color: Colors.red,
                  fontSize: 12,
                ),
                listItemStyle: const TextStyle(
                  color: Colors.black,
                  fontSize: 14,
                ),
                overlayScrollbarDecoration: ScrollbarThemeData(
                  thumbColor: WidgetStateProperty.all(Colors.grey[400]),
                  thickness: WidgetStateProperty.all(6.0),
                  radius: const Radius.circular(8),
                ),
                searchFieldDecoration: SearchFieldDecoration(
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: Colors.grey[300]!,
                      width: 1.0,
                    ),
                  ),
                ),
              ),
              closedHeaderPadding:
                  EdgeInsets.symmetric(vertical: 10.h, horizontal: 10.w),
              hintText: 'Choose the plant',
              items: plantsProvider.plantNames,
              excludeSelected: false,
              onChanged: (value) {
                plantsProvider.selectedPlant =
                    plantsProvider.plantNames.indexOf(value ?? "");
              },
            ),
          ),
          plantsProvider.plants.isEmpty
              ? Center(
                  child: Column(
                    children: [
                      Lottie.asset(
                        "assets/jsons/firedesk_empty.json",
                        height: 200.h,
                        width: 300.w,
                      ),
                      SizedBox(
                        height: 5.h,
                      ),
                      Text(
                        "No Plants Found",
                        style: TextStyle(
                            fontSize: 20.sp, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(
                        height: 10.h,
                      ),
                    ],
                  ),
                )
              : Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        SizedBox(
                          height: 10.h,
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => LayOutsScreen(
                                  plantId: plantsProvider
                                      .plants[plantsProvider.selectedPlant!].id
                                      .toString(),
                                ),
                              ),
                            );
                          },
                          child: Container(
                            margin: const EdgeInsets.symmetric(
                                vertical: 0.0, horizontal: 8.0),
                            padding: const EdgeInsets.all(12.0),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: const [
                                BoxShadow(
                                  color: Colors.grey,
                                  blurRadius: 1,
                                  offset: Offset(0, 1),
                                )
                              ],
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  width: 100.w,
                                  height: 100.h,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(8),
                                    color: Colors.grey.withOpacity(0.5),
                                  ),
                                  child: (plantsProvider
                                                  .plants[plantsProvider
                                                          .selectedPlant ??
                                                      0]
                                                  .plantImage !=
                                              null &&
                                          plantsProvider
                                                  .plants[plantsProvider
                                                          .selectedPlant ??
                                                      0]
                                                  .plantImage !=
                                              "")
                                      ? ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(8),
                                          child: Image.network(
                                            "${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].plantImage}",
                                            height: 100.h,
                                            width: 100.w,
                                            fit: BoxFit.cover,
                                          ),
                                        )
                                      : SizedBox(
                                          height: 100.h,
                                          width: 100.w,
                                        ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Expanded(
                                            child: Text(
                                              "${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].plantName}",
                                              style: normalTextSTyle1.copyWith(
                                                fontSize: 14,
                                                fontWeight: FontWeight.bold,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                          GestureDetector(
                                            onTap: () {
                                              Navigator.push(
                                                  context,
                                                  MaterialPageRoute(
                                                      builder: (context) => LayOutsScreen(
                                                          plantId: plantsProvider
                                                              .plants[plantsProvider
                                                                  .selectedPlant!]
                                                              .id
                                                              .toString())));
                                            },
                                            child: const Icon(
                                              Icons.arrow_forward,
                                              color: Colors.blue,
                                            ),
                                          )
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.location_city,
                                            color: Colors.grey[600],
                                            size: 20,
                                          ),
                                          const SizedBox(width: 4),
                                          Expanded(
                                            child: Text(
                                              "${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].address}",
                                              style: normalTextSTyle1.copyWith(
                                                fontWeight: FontWeight.w200,
                                                fontSize: 12,
                                                color: Colors.grey[700],
                                              ),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.location_on,
                                            color: Colors.grey[600],
                                            size: 20,
                                          ),
                                          const SizedBox(width: 4),
                                          Expanded(
                                            child: Text(
                                              "${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].cityId!.cityName},${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].cityId!.stateId!.stateName}",
                                              style: normalTextSTyle1.copyWith(
                                                fontWeight: FontWeight.w200,
                                                fontSize: 12,
                                                color: Colors.grey[700],
                                              ),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(
                                        height: 5,
                                      ),
                                      Row(
                                        children: [
                                          const SizedBox(
                                            width: 5,
                                          ),
                                          Icon(
                                            Icons.circle,
                                            color:
                                                "${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].status}" ==
                                                        "Active"
                                                    ? Colors.green
                                                    : Colors.red,
                                            size: 12,
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            "${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].status}",
                                            style: normalTextSTyle1.copyWith(
                                              fontSize: 14,
                                              color: Colors.grey,
                                            ),
                                          ),
                                        ],
                                      )
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 10.h,
                        ),
                        Container(
                          margin: const EdgeInsets.symmetric(
                              vertical: 0.0, horizontal: 8.0),
                          padding: const EdgeInsets.all(12.0),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: const [
                              BoxShadow(
                                color: Colors.grey,
                                blurRadius: 1,
                                offset: Offset(0, 1),
                              )
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Maintained By",
                                style: normalTextSTyle1.copyWith(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.person_outline,
                                    color: Colors.blueAccent,
                                    size: 24,
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      "${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].managerId!.userId!.name}",
                                      style: normalTextSTyle1.copyWith(
                                        fontWeight: FontWeight.w200,
                                        fontSize: 12,
                                        color: Colors.grey[900],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.phone_outlined,
                                    color: Colors.green,
                                    size: 24,
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      "${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].managerId!.userId!.phone}",
                                      style: normalTextSTyle1.copyWith(
                                        fontWeight: FontWeight.w200,
                                        fontSize: 12,
                                        color: Colors.grey[900],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.email_outlined,
                                    color: Colors.orangeAccent,
                                    size: 24,
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      "${plantsProvider.plants[plantsProvider.selectedPlant ?? 0].managerId!.userId!.email}",
                                      style: normalTextSTyle1.copyWith(
                                        fontWeight: FontWeight.w200,
                                        fontSize: 12,
                                        color: Colors.grey[900],
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        SizedBox(
                          height: 20.h,
                        ),
                        Container(
                          margin: const EdgeInsets.symmetric(
                              vertical: 0.0, horizontal: 8.0),
                          padding: const EdgeInsets.all(12.0),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: const [
                              BoxShadow(
                                color: Colors.grey,
                                blurRadius: 1,
                                offset: Offset(0, 1),
                              )
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Quick Link",
                                style: normalTextSTyle1.copyWith(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                                textAlign: TextAlign.left,
                              ),
                              const SizedBox(height: 16),
                              Row(
                                children: [
                                  SizedBox(
                                    width: 20.w,
                                  ),
                                  GestureDetector(
                                    onTap: () {
                                      // Navigator.pushNamed(
                                      //     context, AppRoutes.qrCodeScreen,
                                      //     arguments: {
                                      //       'cameFromAssetDetailsScreen': false,
                                      //     });
                                      _checkPermissionAndNavigate(context);
                                    },
                                    child: Column(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(16),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            borderRadius:
                                                BorderRadius.circular(16),
                                            boxShadow: [
                                              BoxShadow(
                                                color:
                                                    Colors.black.withAlpha(25),
                                                spreadRadius: 2,
                                                blurRadius: 10,
                                                offset: const Offset(0, 4),
                                              ),
                                            ],
                                          ),
                                          child: Center(
                                            child: Icon(
                                              Icons.qr_code_scanner,
                                              color: darkGreyColor,
                                              size: 30.sp,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          "Start Service",
                                          style: TextStyle(
                                            color: darkGreyColor,
                                            fontSize: 14.sp,
                                            fontWeight: FontWeight.w600,
                                            letterSpacing: 0.5,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(
                                    width: 20,
                                  ),
                                  GestureDetector(
                                    onTap: () {
                                      Navigator.pushNamed(
                                        context,
                                        AppRoutes.homescreen,
                                        arguments: {
                                          "plantId": plantsProvider
                                              .plants[plantsProvider
                                                      .selectedPlant ??
                                                  0]
                                              .id
                                        },
                                      );
                                    },
                                    child: Column(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(16),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            borderRadius:
                                                BorderRadius.circular(16),
                                            boxShadow: [
                                              BoxShadow(
                                                color:
                                                    Colors.black.withAlpha(25),
                                                spreadRadius: 2,
                                                blurRadius: 10,
                                                offset: const Offset(0, 4),
                                              ),
                                            ],
                                          ),
                                          child: Center(
                                            child: Icon(
                                              Icons.calendar_month,
                                              color: darkGreyColor,
                                              size: 30.sp,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          "Calendar View",
                                          style: TextStyle(
                                            color: darkGreyColor,
                                            fontSize: 14.sp,
                                            fontWeight: FontWeight.w600,
                                            letterSpacing: 0.5,
                                          ),
                                        ),
                                      ],
                                    ),
                                  )
                                ],
                              ),
                            ],
                          ),
                        ),
                        Container(
                          margin: const EdgeInsets.symmetric(
                              vertical: 8.0, horizontal: 16.0),
                          padding: const EdgeInsets.all(12.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "My Categories",
                                style: normalTextSTyle1.copyWith(
                                  fontWeight: FontWeight.w200,
                                  fontSize: 15,
                                  color: Colors.black,
                                ),
                              ),
                              const SizedBox(height: 12),
                              ListView.builder(
                                physics: const NeverScrollableScrollPhysics(),
                                shrinkWrap: true,
                                itemCount: plantsProvider.category!.length,
                                itemBuilder: (context, index) {
                                  // final categoryName = plantsProvider
                                  //     .category![index]!.categoryName;
                                  return Container(
                                    margin: const EdgeInsets.only(bottom: 8),
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(8),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.grey.withAlpha(25),
                                          spreadRadius: 1,
                                          blurRadius: 6,
                                          offset: const Offset(0, 3),
                                        ),
                                      ],
                                    ),
                                    child: Row(
                                      children: [
                                        plantsProvider.category![index]!
                                                    .categoryName ==
                                                "Fire Extinguishers"
                                            ? Text(
                                                plantsProvider.category![index]!
                                                            .categoryName ==
                                                        "Fire Hydrant Service"
                                                    ? "🔥🚰"
                                                    : plantsProvider
                                                                .category![
                                                                    index]!
                                                                .categoryName ==
                                                            "Fire Extinguishers"
                                                        ? "🧯"
                                                        : "💧🚿",
                                                style: const TextStyle(
                                                  fontSize: 16,
                                                  color: Colors.black,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              )
                                            : plantsProvider.category![index]!
                                                        .categoryName ==
                                                    "Fire Hydrant Service"
                                                ? Image.asset(
                                                    "assets/images/fire-hydrant.png",
                                                    height: 20.h,
                                                    width: 20.w,
                                                  )
                                                : Image.asset(
                                                    "assets/images/water-pump.png",
                                                    height: 20.h,
                                                    width: 20.w,
                                                  ),
                                        // Icon(
                                        //   plantsProvider.category!.categoryName ==
                                        //           "Fire Hydrant"
                                        //       ? Icons.fire_hydrant
                                        //       : plantsProvider
                                        //                   .category!.categoryName ==
                                        //               "Fire Hydrant"
                                        //           ? Icons.fire_extinguisher
                                        //           : plantsProvider.category!
                                        //                       .categoryName ==
                                        //                   "Pump Room"
                                        //               ? Icons.water_drop_outlined
                                        //               : Icons.category,
                                        //   color: Colors.blueAccent,
                                        //   size: 24,
                                        // ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Text(
                                            plantsProvider.category![index]!
                                                    .categoryName ??
                                                "",
                                            style: normalTextSTyle1.copyWith(
                                              fontWeight: FontWeight.w200,
                                              fontSize: 12,
                                              color: Colors.black,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ),
        ],
      );
  }
}

Widget _buildShimmerLoadingWidget() {
  return SingleChildScrollView(
    child: Column(
      children: [
        Padding(
            padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
            child: Shimmer.fromColors(
              baseColor: Colors.grey[300]!,
              highlightColor: Colors.grey[100]!,
              child: Container(
                height: 48.h,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  color: Colors.grey[200],
                ),
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      height: 20.h,
                      width: 100.w,
                      color: Colors.grey[300],
                    ),
                    const Icon(
                      Icons.arrow_drop_down,
                      color: Colors.grey,
                    ),
                  ],
                ),
              ),
            )),
        SizedBox(height: 10.h),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Shimmer.fromColors(
                baseColor: Colors.grey[300]!,
                highlightColor: Colors.grey[100]!,
                child: Container(
                  width: 100.w,
                  height: 100.h,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    color: Colors.grey.withOpacity(0.5),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Shimmer.fromColors(
                      baseColor: Colors.grey[300]!,
                      highlightColor: Colors.grey[100]!,
                      child: Container(
                        height: 16.0,
                        width: double.infinity,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.location_city,
                            color: Colors.grey[600], size: 20),
                        const SizedBox(width: 4),
                        Shimmer.fromColors(
                          baseColor: Colors.grey[300]!,
                          highlightColor: Colors.grey[100]!,
                          child: Container(
                            height: 12.0,
                            width: 100.0,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.location_on,
                            color: Colors.grey[600], size: 20),
                        const SizedBox(width: 4),
                        Shimmer.fromColors(
                          baseColor: Colors.grey[300]!,
                          highlightColor: Colors.grey[100]!,
                          child: Container(
                            height: 12.0,
                            width: 150.0,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 5),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const SizedBox(width: 5),
                            Shimmer.fromColors(
                              baseColor: Colors.grey[300]!,
                              highlightColor: Colors.grey[100]!,
                              child: Container(
                                width: 12,
                                height: 12,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(width: 4),
                            Shimmer.fromColors(
                              baseColor: Colors.grey[300]!,
                              highlightColor: Colors.grey[100]!,
                              child: Container(
                                height: 14.0,
                                width: 50.0,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                        GestureDetector(
                          onTap: () {},
                          child: Shimmer.fromColors(
                            baseColor: Colors.grey[300]!,
                            highlightColor: Colors.grey[100]!,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 2),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                color: Colors.blueAccent,
                              ),
                              child: const Row(
                                children: [
                                  Icon(Icons.info,
                                      color: Colors.white, size: 15),
                                  SizedBox(width: 4),
                                  Text(
                                    "view",
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        Container(
          margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 8.0),
          padding: const EdgeInsets.all(16.0),
          child: Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 20.h,
                  width: 150.w,
                  color: Colors.grey[300],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    const Icon(
                      Icons.person_outline,
                      color: Colors.blueAccent,
                      size: 24,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Container(
                        height: 20.h,
                        color: Colors.grey[300],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(
                      Icons.phone_outlined,
                      color: Colors.green,
                      size: 24,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Container(
                        height: 20.h,
                        color: Colors.grey[300],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(
                      Icons.email_outlined,
                      color: Colors.orangeAccent,
                      size: 24,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Container(
                        height: 20.h,
                        color: Colors.grey[300],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        Row(
          children: [
            const SizedBox(
              width: 20,
            ),
            Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        spreadRadius: 2,
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Shimmer.fromColors(
                      baseColor: Colors.grey[300]!,
                      highlightColor: Colors.grey[100]!,
                      child: Icon(
                        Icons.qr_code_scanner,
                        color: Colors.grey[400],
                        size: 30.sp,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Shimmer.fromColors(
                  baseColor: Colors.grey[300]!,
                  highlightColor: Colors.grey[100]!,
                  child: Container(
                    width: 100,
                    height: 14,
                    color: Colors.grey[300],
                  ),
                ),
              ],
            ),
            const SizedBox(
              width: 20,
            ),
            Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        spreadRadius: 2,
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Shimmer.fromColors(
                      baseColor: Colors.grey[300]!,
                      highlightColor: Colors.grey[100]!,
                      child: Icon(
                        Icons.calendar_month,
                        color: Colors.grey[400],
                        size: 30.sp,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Shimmer.fromColors(
                  baseColor: Colors.grey[300]!,
                  highlightColor: Colors.grey[100]!,
                  child: Container(
                    width: 120,
                    height: 14,
                    color: Colors.grey[300],
                  ),
                ),
              ],
            ),
          ],
        ),
        Container(
          margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Shimmer.fromColors(
                baseColor: Colors.grey[300]!,
                highlightColor: Colors.grey[100]!,
                child: Container(
                  width: 120,
                  height: 18,
                  color: Colors.grey[300],
                ),
              ),
              const SizedBox(height: 12),
              ListView.builder(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount:
                    5, // You can adjust this count as needed for the loading effect
                itemBuilder: (context, index) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          spreadRadius: 1,
                          blurRadius: 6,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Shimmer.fromColors(
                          baseColor: Colors.grey[300]!,
                          highlightColor: Colors.grey[100]!,
                          child: const Icon(
                            Icons.category,
                            color: Colors.blueAccent,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Shimmer.fromColors(
                            baseColor: Colors.grey[300]!,
                            highlightColor: Colors.grey[100]!,
                            child: Container(
                              height: 14,
                              color: Colors.grey[300],
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        )
      ],
    ),
  );
}

Widget buildShimmerPlanCard() {
  return Container(
    height: 230.h,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(8.0),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.1),
          spreadRadius: 2,
          blurRadius: 2,
          offset: const Offset(0, 3),
        ),
      ],
    ),
    child: Column(
      children: [
        Shimmer.fromColors(
          baseColor: Colors.grey[300]!,
          highlightColor: Colors.grey[100]!,
          child: Container(
            height: 180.h,
            width: 380.w,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8.0),
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                spreadRadius: 2,
                blurRadius: 2,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          height: 50.h,
          child: Column(
            children: [
              SizedBox(
                height: 4.h,
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Shimmer.fromColors(
                    baseColor: Colors.grey[300]!,
                    highlightColor: Colors.grey[100]!,
                    child: Container(
                      height: 20.h,
                      width: 150.w,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                  ),
                  SizedBox(height: 8.h),
                  Shimmer.fromColors(
                    baseColor: Colors.grey[300]!,
                    highlightColor: Colors.grey[100]!,
                    child: Container(
                      height: 20.h,
                      width: 150.w,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 4.h,
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Shimmer.fromColors(
                    baseColor: Colors.grey[300]!,
                    highlightColor: Colors.grey[100]!,
                    child: Container(
                      height: 20.h,
                      width: 150.w,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                  ),
                  SizedBox(height: 8.h),
                  Shimmer.fromColors(
                    baseColor: Colors.grey[300]!,
                    highlightColor: Colors.grey[100]!,
                    child: Container(
                      height: 20.h,
                      width: 150.w,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 2.h,
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

Widget plantContainer(BuildContext context, String imagePath, String location,
    String assetsCount, String manager, String plantId) {
  return GestureDetector(
    onTap: () {
      Navigator.pushNamed(context, AppRoutes.homescreen,
          arguments: {"plantId": plantId});
    },
    child: Stack(
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8.0),
            image: DecorationImage(
              image: NetworkImage(imagePath),
              fit: BoxFit.fill,
            ),
          ),
        ),
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.5),
                borderRadius: BorderRadius.circular(8.0)),
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  children: [
                    const Text(
                      "Plant Name",
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600),
                    ),
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on,
                          color: Colors.white,
                          size: 15,
                        ),
                        SizedBox(
                          width: 3.w,
                        ),
                        Text(
                          location,
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600),
                        ),
                      ],
                    )
                  ],
                ),
                Column(
                  children: [
                    Row(
                      children: [
                        // Icon(Icons.fire_extinguisher_outlined,
                        //     color: Colors.white, size: 15),
                        Text(
                          assetsCount,
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                    Text(
                      manager,
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    ),
  );
}

class PlantContainerList extends StatelessWidget {
  final List<Map<String, String>> plants = List.generate(
    10,
    (index) => {
      "imagePath": 'assets/images/fire2.jpg',
      "location": 'Bangalore',
      "assetsCount": 'Assets: ${index * 5}',
      "manager": 'Manager $index',
    },
  );

  PlantContainerList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: plants.length,
      itemBuilder: (context, index) {
        final plant = plants[index];
        return Container(
          height: 200.0,
          margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
          child: plantContainer(
            context,
            plant["imagePath"]!,
            plant["location"]!,
            plant["assetsCount"]!,
            plant["manager"]!,
            plant['id']!,
          ),
        );
      },
    );
  }
}

class Plant {
  final String plantName;
  final IconData leadingIcon;
  final IconData trailingIcon;
  final VoidCallback callback;

  Plant({
    required this.plantName,
    required this.leadingIcon,
    required this.trailingIcon,
    required this.callback,
  });
}

class SubMenuItem extends StatelessWidget {
  final String title;
  final IconData leadingIcon;
  final VoidCallback? callback;
  final IconData trailingIcon;

  const SubMenuItem({
    super.key,
    required this.title,
    required this.leadingIcon,
    this.callback,
    required this.trailingIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(left: 30.w, right: 15.w),
      child: ListTile(
        leading: Icon(
          leadingIcon,
          color: darkGreyColor,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w300,
            fontFamily: "Poppins",
            color: darkGreyColor,
          ),
        ),
        onTap: callback ?? () {},
        trailing: Icon(
          trailingIcon,
          color: basicColor.withOpacity(0.6),
          size: 20,
        ),
      ),
    );
  }
}

class SideBarItemContainer2 extends StatelessWidget {
  final String title;
  final CircleAvatar icon;
  final VoidCallback? callback;

  const SideBarItemContainer2({
    super.key,
    required this.title,
    required this.icon,
    this.callback,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<PlantsScreenProvider>(
      builder: (context, plantsProvider, child) {
        return Theme(
          data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
          child: ListTileTheme(
            contentPadding: const EdgeInsets.only(left: 8, bottom: 0),
            child: ExpansionTile(
              trailing: Padding(
                padding: EdgeInsets.symmetric(horizontal: 3.w),
                child: Icon(
                  color: darkGreyColor,
                  Icons.arrow_drop_down,
                  size: 40,
                ),
              ),
              leading: icon,
              title: Text(
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w300,
                  fontFamily: "Poppins",
                  color: darkGreyColor,
                ),
              ),
              children: plantsProvider.plants.map(
                (subItem) {
                  return SubMenuItem(
                    title: subItem.plantName ?? "",
                    leadingIcon: Icons.dashboard_customize_outlined,
                    trailingIcon: Icons.arrow_forward_ios,
                    callback: () {
                      Navigator.pop(context);
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => LayOutsScreen(
                                    plantId: subItem.id ?? "",
                                  )));
                    },
                  );
                },
              ).toList(),
            ),
          ),
        );
      },
    );
  }
}
