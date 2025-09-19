import "dart:isolate";

import 'package:badges/badges.dart' as badges;
import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/utils/snack_bar_utils.dart";
import "package:firedesk/view/Tabs/my_assets_screen.dart";
import "package:firedesk/view/Tabs/notifications_screen.dart";
import "package:firedesk/view/Tabs/plants_home_screen.dart";
import "package:firedesk/view/Tabs/profile_screen.dart";
import "package:firedesk/view_models/providers/asset_list_provider.dart";
import "package:firedesk/view_models/providers/bottom_bar_provider.dart";
import "package:firedesk/view_models/providers/notifications_provider.dart";
import "package:firedesk/view_models/providers/plants_screen_provider.dart";
import "package:firedesk/view_models/providers/user_provider.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:provider/provider.dart";
import "package:salomon_bottom_bar/salomon_bottom_bar.dart";

NotificationsProvider? _notificationsProvider;

class BottomBar extends StatefulWidget {
  final int initialIndex;
  const BottomBar({super.key, required this.initialIndex});
  @override
  State<BottomBar> createState() => _BottomBarState();
}

class _BottomBarState extends State<BottomBar> {
  final List<Widget> _screens = [
    // CalendarScreen(),
    const PlantsHomeScreen(),
    const MyAssetsScreen(),
    const NotificationsScreen(),
    const ProfileScreen(),
  ];
  DateTime? _lastBackPressed;

  @override
  void initState() {
    super.initState();
    _notificationsProvider =
        Provider.of<NotificationsProvider>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      final notificationsProvider =
          Provider.of<NotificationsProvider>(context, listen: false);
      // notificationsProvider.fetchNotifications(context);
      notificationsProvider.startNotificationIsolate(context);
    });

    WidgetsBinding.instance.addPostFrameCallback(
      (timeStamp) {
        final provider = Provider.of<BottomBarProvider>(context, listen: false);
        provider.setCurrentIndex = 0;
        final plantsScreenProvider =
            Provider.of<PlantsScreenProvider>(context, listen: false);
        plantsScreenProvider.fetchMyPlants(context);
      },
    );
  }

  @override
  void dispose() {
    _notificationsProvider?.isolate?.kill(priority: Isolate.immediate);
    _notificationsProvider?.isolate = null;
    _notificationsProvider?.mainReceivePort.close();
    _notificationsProvider?.workerSendPort = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<BottomBarProvider>(
      builder: (context, bottomBarProvider, _) {
        return Consumer<NotificationsProvider>(
            builder: (context, notificationsProvider, _) {
          return WillPopScope(
            onWillPop: () async {
              DateTime now = DateTime.now();
              if (_lastBackPressed == null ||
                  now.difference(_lastBackPressed!) >
                      const Duration(seconds: 3)) {
                _lastBackPressed = now;
                SnackBarUtils.toastMessage(
                    "Click again to exit or close the app");
                return false;
              }
              SystemNavigator.pop();
              return true;
            },
            child: Scaffold(
              body: _screens[bottomBarProvider.currentIndex],
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
                      currentIndex: bottomBarProvider.currentIndex,
                      backgroundColor: Colors.transparent,
                      onTap: (i) {
                        // SnackBarUtils.toastMessage(
                        //     "Changed the tab in the bottom bar");
                        if (i == 1) {
                          final assetsProvider = Provider.of<AssetInfoProvider>(
                              context,
                              listen: false);
                          assetsProvider.isSearchBarEnabled = false;
                          bottomBarProvider.setCurrentIndex = i;
                          assetsProvider.currentPage = 1;
                          assetsProvider.myAssets.clear();
                          assetsProvider.fetchMyAssets(context);
                          // assetsProvider.fetchAssetsStatus = Status.LOADING;
                        } else if (i == 3) {
                          final profilePrvoider =
                              Provider.of<AuthenticationProvider>(context,
                                  listen: false);
                          // profilePrvoider.isLoading = true;
                          profilePrvoider.profileData(context);
                          // profilePrvoider.profileStatus = Status.LOADING;
                        } else if (i == 0) {
                          final plantsScreenProvider =
                              Provider.of<PlantsScreenProvider>(context,
                                  listen: false);
                          // plantsScreenProvider.isLoading = true;
                          plantsScreenProvider.fetchMyPlants(context);
                          // plantsScreenProvider.allPlantsStatus = Status.LOADING;
                        } else if (i == 2) {
                          final notificationsProvider =
                              Provider.of<NotificationsProvider>(context,
                                  listen: false);
                          notificationsProvider.fetchNotifications(context);
                        }
                        // final assetsProvider =
                        //     Provider.of<AssetInfoProvider>(context, listen: false);
                        // assetsProvider.myAssetsLocal.clear();
                        final plantsProvider =
                            Provider.of<PlantsScreenProvider>(context,
                                listen: false);
                        plantsProvider.plants.clear();
                        plantsProvider.allPlantsStatus = Status.LOADING;
                        if (kDebugMode) {
                          debugPrint("cleared both plants and assets list");
                        }
                        bottomBarProvider.setCurrentIndex = i;
                      },
                      items: [
                        SalomonBottomBarItem(
                          unselectedColor: darkGreyColor,
                          icon: const Icon(
                            Icons.home,
                          ),
                          title: const Text("Home"),
                          selectedColor: basicColor,
                        ),
                        SalomonBottomBarItem(
                          unselectedColor: darkGreyColor,
                          icon: const Icon(Icons.fire_extinguisher),
                          title: const Text("My Assets"),
                          selectedColor: basicColor,
                        ),
                        SalomonBottomBarItem(
                          unselectedColor: darkGreyColor,
                          icon: badges.Badge(
                              showBadge: (notificationsProvider
                                          .newNotificationsCount !=
                                      null &&
                                  bottomBarProvider.currentIndex != 2 &&
                                  notificationsProvider.newNotificationsCount !=
                                      0),
                              badgeContent: Text(
                                (notificationsProvider.newNotificationsCount !=
                                        null)
                                    ? notificationsProvider
                                        .newNotificationsCount
                                        .toString()
                                    : "",
                                style: const TextStyle(
                                  color: Colors.white,
                                ),
                              ),
                              child: const Icon(Icons.notifications)),
                          title: const Text("Notifications"),
                          selectedColor: basicColor,
                        ),
                        SalomonBottomBarItem(
                          unselectedColor: darkGreyColor,
                          icon: const Icon(Icons.person),
                          title: const Text("Profile"),
                          selectedColor: basicColor,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        });
      },
    );
  }
}
