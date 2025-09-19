import 'package:firedesk/data/network/network_api_services.dart';
import 'package:flutter/material.dart';

class TicketSubmittedRepository {
  final NetworkApiServices _networkApiTickets = NetworkApiServices();

  Future<dynamic> getSubmittedTicketResponse(
      BuildContext context, String url) async {
    final response = await _networkApiTickets.getApi(context, url);
    return response;
  }

}