import 'package:firedesk/data/network/network_api_services.dart';
import 'package:flutter/material.dart';

class NotificationsRepository {
  final NetworkApiServices _apiServices = NetworkApiServices();

  Future<dynamic> fetchNotifications(BuildContext context, String url) async {
    final response = await _apiServices.getApi(context, url);
    return response;
  }

  Future<dynamic> updateNotificationsReadStatus(
      BuildContext context, String url) async {
    final response = await _apiServices.putApi(context, url, {});
    return response;
  }
}
