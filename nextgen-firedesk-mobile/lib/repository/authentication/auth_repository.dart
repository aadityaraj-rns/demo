import 'package:firedesk/data/network/network_api_services.dart';
import 'package:flutter/material.dart';

class AuthRepository {
  final NetworkApiServices _apiService = NetworkApiServices();

  Future<dynamic> login(
      BuildContext context, String url, Map<String, dynamic> fields) async {
    final response = await _apiService.postApi(context, url, fields);
    return response;
  }

  Future<dynamic> phoneVerify(
      BuildContext context, String url, Map<String, dynamic> fields) async {
    final response = await _apiService.postApi(context, url, fields);
    return response;
  }

  Future<dynamic> logOut(
      BuildContext context, String url, Map<String, dynamic> fields) async {
    final response = await _apiService.postApi(context, url, fields);
    return response;
  }

  Future<dynamic> forgotPassword(
      BuildContext context, String url, Map<String, dynamic> fields) async {
    final response = await _apiService.postApi(context, url, fields);
    return response;
  }
}
