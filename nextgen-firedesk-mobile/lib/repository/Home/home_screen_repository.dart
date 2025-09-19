import 'package:firedesk/data/network/network_api_services.dart';
import 'package:flutter/material.dart';

class HomeScreenRepository {
  final NetworkApiServices _apiService = NetworkApiServices();

  Future<dynamic> getMonthData(
      BuildContext context, String url, Map<String, dynamic> data) async {
    final response = await _apiService.postApi(context, url, data);
    return response;
  }

  Future<dynamic> getDayData(
      BuildContext context, String url, Map<String, dynamic> data) async {
    final response = await _apiService.postApi(context, url, data);
    return response;
  }
}
