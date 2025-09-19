import 'package:firedesk/data/network/network_api_services.dart';
import 'package:flutter/material.dart';

class ServiceDetailRepository {
  final NetworkApiServices _apiServices = NetworkApiServices();

  Future<dynamic> getServiceDetail(
      BuildContext context, String url, Map<String, dynamic> data) async {
       print("url: $url");
    return await _apiServices.getApi(context, url);
  }

  Future<dynamic> getServiceForm(
      BuildContext context, String url,) async {
    return await _apiServices.getApi(context, url);
  }
}
