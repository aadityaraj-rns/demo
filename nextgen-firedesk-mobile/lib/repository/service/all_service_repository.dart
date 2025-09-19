import 'package:firedesk/data/network/network_api_services.dart';
import 'package:flutter/material.dart';

class AllServiceRepository {
  final NetworkApiServices _networkApiServices = NetworkApiServices();

  Future<dynamic> getDueServices(
      BuildContext context, String url) async {
    final response = await _networkApiServices.getApi(context, url);
    return response;
  }

  Future<dynamic> getUpcomingServices(
      BuildContext context, String url, Map<String, dynamic> data) async {
    final response = await _networkApiServices.postApi(context, url, data);
    return response;
  }

  Future<dynamic> getServicesByStatus(
      BuildContext context, String url, Map<String, dynamic> data) async {
    final response = await _networkApiServices.postApi(context, url, data);
    return response;
  }

 
}
