import "dart:async";
import "dart:convert";
import "dart:isolate";

import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/models/data_models/notification_models/notifications_model.dart";
import "package:firedesk/repository/notifications/notifications_repository.dart";
import "package:firedesk/res/api_urls/api_urls.dart";
import "package:firedesk/utils/auth_manager.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:http/http.dart" as http;

final NotificationsRepository _apiServices = NotificationsRepository();

class NotificationsProvider with ChangeNotifier {
  List<Notifications> notifications = [];

  List<Notifications> get getNotifications => notifications;

  set setnotifications(List<Notifications> notifications) {
    this.notifications = notifications;
    countNotifications();
    notifyListeners();
  }

  void countNotifications() {
    int newNotificationsCunt =
        notifications.where((notification) => !notification.read).length;
    newNotificationsCount = newNotificationsCunt;
  }

  Isolate? isolate;
  ReceivePort mainReceivePort = ReceivePort();
  SendPort? workerSendPort;

  Status notificationStatus = Status.LOADING;
  Status get getNotificationStatus => notificationStatus;
  set setnotificationStatus(Status value) {
    notificationStatus = value;
    notifyListeners();
  }

  dynamic notificationsError;
  dynamic get getNotificationsError => notificationsError;
  set setNotificationsError(dynamic error) {
    notificationsError = error;
    notifyListeners();
  }

  int? _newNotificationsCount;
  int? get newNotificationsCount => _newNotificationsCount;
  set newNotificationsCount(int? count) {
    _newNotificationsCount = count;
    notifyListeners();
  }

  void fetchNotifications(BuildContext context) {
    setnotificationStatus = Status.LOADING;

    _apiServices
        .fetchNotifications(context, ApiUrls.fetchNotificationsUrl)
        .then((value) {
      var jsonResponse = jsonDecode(value.body);

      // Directly access the list of notifications since there is no 'data' key
      final notificationsList = List.from(jsonResponse);

      setnotifications = notificationsList
          .map((json) => Notifications.fromJson(json))
          .toList();

      if (kDebugMode) {
        debugPrint("notifications length is ${notificationsList.length}");
      }

      setnotificationStatus = Status.COMPLETED;
    }).catchError((error) {
      debugPrint("Error occurred while fetching notifications: $error");
      setnotificationStatus = Status.ERROR;
      setNotificationsError = error.runtimeType;
    });
  }

  void updateNotificationsReadStatus(BuildContext context) {
    debugPrint("called the update read status notification in provider");
    _apiServices
        .updateNotificationsReadStatus(
            context, ApiUrls.updateNotificationsStatusUrl)
        .then((value) {
      debugPrint("successfully updated notification read status");
    }).onError((value, stackTrace) {
      debugPrint(
          "error occured while updating notification status and the error is ${value.toString()}");
    });
  }

  void startNotificationIsolate(BuildContext context) async {
    mainReceivePort = ReceivePort();

    // Get the access token in the main isolate
    final accessToken = await AuthManager().getAccessToken();

    // Listen for messages from the worker isolate
    mainReceivePort.listen((message) {
      if (message is SendPort) {
        workerSendPort = message; // Save the worker's SendPort
        workerSendPort?.send({
          'url': ApiUrls.fetchNotificationsUrl, // Pass required data
          'accessToken': accessToken, // Pass the access token
        });
      } else if (message is List) {
        List<Notifications> notificationsList =
            message.map((json) => Notifications.fromJson(json)).toList();

        setnotifications = notificationsList;

        int newNotificationsCunt =
            notifications.where((notification) => !notification.read).length;
        newNotificationsCount = newNotificationsCunt;

        debugPrint("new notifications count is $newNotificationsCount");

        debugPrint(
            "In else block of main isolate. Updated notifications. Length: ${notifications.length}");
      }
    });

    // Spawn the worker isolate
    Isolate.spawn(_getUpdatedNotifications, mainReceivePort.sendPort);
  }

  static void _getUpdatedNotifications(SendPort sendPort) {
    debugPrint("Started worker isolate for notifications");

    ReceivePort workerReceivePort = ReceivePort();
    sendPort.send(workerReceivePort.sendPort);

    workerReceivePort.listen((message) async {
      if (message is Map &&
          message.containsKey('url') &&
          message.containsKey('accessToken')) {
        final url = message['url'];
        final accessToken = message['accessToken'];

        Timer.periodic(const Duration(seconds: 30), (timer) async {
          try {
            // Fetch data using the provided access token
            final response = await http.get(
              Uri.parse(url),
              headers: {
                'Authorization': 'Bearer $accessToken',
                'Content-Type': 'application/json',
              },
            );
            if (response.statusCode == 200) {
              var jsonResponse = jsonDecode(response.body);
              final notificationsList = List.from(jsonResponse);

              // Send the updated notifications list back to the main isolate
              sendPort.send(notificationsList);

              debugPrint("Fetched and sent notifications from isolate");
            } else {
              debugPrint(
                  "Failed to fetch notifications. Status: ${response.statusCode}");
            }
          } catch (error) {
            debugPrint("Error in worker isolate: $error");
          }
        });
      }
    });
  }
}
