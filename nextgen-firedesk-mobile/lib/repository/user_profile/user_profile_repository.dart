import 'package:firedesk/data/network/network_api_services.dart';
import 'package:flutter/material.dart';

class UserProfileRepository {
  final NetworkApiServices _apiServices = NetworkApiServices();

  Future<dynamic> getUserProfile(BuildContext context, String url) async {
    final response = await _apiServices.getApi(context, url);
    return response;
  }
}
