import 'package:firedesk/data/network/network_api_services.dart';
import 'package:flutter/material.dart';

class MyAssetsRepository {
  final NetworkApiServices _apiServices = NetworkApiServices();

  Future<dynamic> getAssets(BuildContext context, String url) async {
    final response = await _apiServices.getApi(context, url);
    return response;
  }

  Future<dynamic> getSearchedAssets(BuildContext context, String url) {
    final response = _apiServices.getApi(context, url);
    return response;
  }

  Future<dynamic> getAssetInfo(
      BuildContext context, String url, Map<String, dynamic> data) async {
    print("calling asset details api and url is $url");
    final response = await _apiServices.getApi(context, url);
    return response;
  }

  Future<dynamic> updateAssetInfo(
      BuildContext context, String url, Map<String, dynamic> data) async {
    try {
      debugPrint("url in update function is $url");
      debugPrint("data in update function is $data");

      final response = await _apiServices.putApi(context, url, data);

      debugPrint("response in update function is ${response.body}");
      return response;
    } catch (e, stackTrace) {
      debugPrint("Error occurred in updateAssetInfo: $e");
      debugPrint("StackTrace: $stackTrace");
      throw Exception("Failed to update asset info: ${e.toString()}");
    }
  }
}
