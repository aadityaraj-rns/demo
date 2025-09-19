import "package:firedesk/data/app_exceptions.dart";
import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/components/general_exception_widget.dart";
import "package:firedesk/res/components/internet_exception.dart";
import "package:firedesk/res/components/request_timeout.dart";
import "package:firedesk/res/components/server_exception_widget.dart";
import "package:firedesk/res/styles/text_style.dart";
import "package:firedesk/view_models/providers/notifications_provider.dart";
import "package:firedesk/widgets/dialog/notification_dialog.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:gap/gap.dart";
import "package:intl/intl.dart";
import "package:lottie/lottie.dart";
import "package:provider/provider.dart";

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});
  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  late final List<Widget> notificationList;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<NotificationsProvider>(
      builder: (context, notificationsProvider, _) {
        return Scaffold(
          backgroundColor: Colors.white,
          appBar: PreferredSize(
            preferredSize: Size.fromHeight(45.h),
            child: Material(
              elevation: 2,
              child: AppBar(
                backgroundColor: basicColor,
                automaticallyImplyLeading: false,
                title: Text(
                  "Notifications",
                  style: appBarTextSTyle,
                ),
                centerTitle: true,
              ),
            ),
          ),
          body: getContents(context, notificationsProvider),
        );
      },
    );
  }

  Widget getContents(
      BuildContext context, NotificationsProvider notificationsProvider) {
    switch (notificationsProvider.notificationStatus) {
      case Status.LOADING:
        return const Center(
          child: CircularProgressIndicator(
            color: Colors.blue,
          ),
        );
      case Status.ERROR:
        if (kDebugMode) {
          debugPrint("error is ${notificationsProvider.notificationsError}");
        }
        if (notificationsProvider.notificationsError == InternetException) {
          return InterNetExceptionWidget(
            onPress: () {
              notificationsProvider.fetchNotifications(context);
            },
          );
        } else if (notificationsProvider.notificationsError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              notificationsProvider.fetchNotifications(context);
            },
          );
        } else if (notificationsProvider.notificationsError ==
            ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              notificationsProvider.fetchNotifications(context);
            },
          );
        } else {
          return GeneralExceptionWidget(
            onPress: () {
              notificationsProvider.fetchNotifications(context);
            },
          );
        }
      case Status.COMPLETED:
        Future.delayed((const Duration(milliseconds: 100)), () {
          notificationsProvider.updateNotificationsReadStatus(context);
        });

        if (notificationsProvider.notifications.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Lottie.asset(
                  "assets/jsons/empty_notifications.json",
                  height: 200.h,
                  width: 300.w,
                ),
                SizedBox(height: 50.h),
                Text(
                  "No Notifications Found",
                  style:
                      TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 10.h),
              ],
            ),
          );
        }
        return ListView.builder(
          itemCount: notificationsProvider.notifications.length,
          itemBuilder: (context, index) {
            return GestureDetector(
              onTap: () {
                showNotificationDialog(
                    context,
                    notificationsProvider.notifications[index].title ?? "",
                    notificationsProvider.notifications[index].message ?? "");
              },
              child: notificationCard(
                notificationsProvider.notifications[index].title ?? "",
                notificationsProvider.notifications[index].message ?? "",
                notificationsProvider.notifications[index].createdAt.toString(),
                index,
                notificationsProvider.notifications[index].read,
              ),
            );
          },
        );
    }
  }

  Widget notificationCard(
      String title, String description, String date, int index, bool read) {
    DateTime dateTime = DateTime.parse(date);

    String formattedDate = DateFormat('dd/MM/yyyy').format(dateTime);
    return Container(
      padding: EdgeInsets.symmetric(vertical: 8.h),
      decoration: BoxDecoration(
          color: read ? Colors.white : Colors.blue.withOpacity(0.09),
          border: const Border(
              bottom: BorderSide(
            color: Colors.grey,
            width: 0.7,
          ))),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          index == 0 ? Gap(10.h) : Gap(2.h),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 5.w,
              ),
              Expanded(
                flex: 1,
                child: CircleAvatar(
                  backgroundColor: Colors.grey.withOpacity(0.1),
                  radius: 20.r,
                  child: const ClipOval(
                    child: Icon(
                      Icons.notification_important,
                      color: Colors.grey,
                      size: 25,
                    ),
                  ),
                ),
              ),
              SizedBox(width: 10.0.w),
              Expanded(
                flex: 8,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            title,
                            style: notificationHeadingTextSTyle,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.only(right: 15.w),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              Align(
                                alignment: Alignment.bottomRight,
                                child: Text(
                                  formattedDate,
                                  style: TextStyle(
                                    fontSize: 10.0.sp,
                                    fontFamily: "Poppins",
                                    fontWeight: FontWeight.w500,
                                    color: basicColor,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                    Gap(2.h),
                    Text(
                      description,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                        fontFamily: "Poppins",
                        fontWeight: FontWeight.w200,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
