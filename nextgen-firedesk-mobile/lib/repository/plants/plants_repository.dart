import 'package:firedesk/data/network/network_api_services.dart';
import 'package:firedesk/res/api_urls/api_urls.dart';
import 'package:flutter/material.dart';

class PlantsRepository {
  final NetworkApiServices _apiServices = new NetworkApiServices();

  Future<dynamic> getAllPlants(
      BuildContext context, String technicianId) async {
    final response = await _apiServices.getApi(
        context, "${ApiUrls.fetchPlantsUrl}");
    return response;
  }

  Future<dynamic> getPlantInfo(BuildContext context, String plantId) async{
    final response = await _apiServices.getApi(
        context, "${ApiUrls.fetchPlantInfoUrl}/$plantId");
    return response;
  }
}
