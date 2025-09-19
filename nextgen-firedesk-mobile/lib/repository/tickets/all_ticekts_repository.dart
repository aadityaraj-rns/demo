import 'package:firedesk/data/network/network_api_services.dart';
import 'package:flutter/material.dart';

class AllTicketsRepository {
  final NetworkApiServices _networkApiTickets = NetworkApiServices();

  Future<dynamic> getIncompleteTickets(
      BuildContext context, String url, Map<String, dynamic> data) async {
    final response = await _networkApiTickets.postApi(context, url, data);
    return response;
  }

  Future<dynamic> getUpcomingTickets(
      BuildContext context, String url, Map<String, dynamic> data) async {
    final response = await _networkApiTickets.postApi(context, url, data);
    return response;
  }

  Future<dynamic> getTicketsByStatus(
      BuildContext context, String url) async {
    final response = await _networkApiTickets.getApi(context, url);
    return response;
  }

 
}
