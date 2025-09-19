import 'dart:convert';

import 'package:firedesk/data/reponse/status.dart';
import 'package:firedesk/models/data_models/Ticket_Models/submitted_ticket_response.dart';
import 'package:firedesk/repository/tickets/ticket_submitted_repository.dart';
import 'package:firedesk/res/api_urls/api_urls.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class TicketSubmittedDataProvider extends ChangeNotifier {
  Status _loadingStatus = Status.LOADING;
  Status get loadingStatus => _loadingStatus;
  set loadingStatus(Status status) {
    _loadingStatus = status;
    notifyListeners();
  }

  TicketSubmittedResponse? _ticketResponse;
  TicketSubmittedResponse? get ticketResponse => _ticketResponse;
  set setticketResponse(TicketSubmittedResponse? response) {
    _ticketResponse = response;
    notifyListeners();
  }

  final TicketSubmittedRepository _ticketSubmittedRepository =
      TicketSubmittedRepository();

  dynamic _ticketResponseError;
  dynamic get ticketResponseError => _ticketResponseError;
  set ticketResponseError(dynamic error) {
    _ticketResponseError = error;
    notifyListeners();
  }

  Future<void> getSubmittedTicketData(
      BuildContext context, String ticketId) async {
    loadingStatus = Status.LOADING;

    _ticketSubmittedRepository
        .getSubmittedTicketResponse(
            context, "${ApiUrls.ticketSubmittedDataUrl}/$ticketId")
        .then((value) {
      if (kDebugMode) {
        debugPrint(
            "Response code is 200, successfully got the submitted ticket");
      }
      final Map<String, dynamic> decodedResponse = jsonDecode(value.body);
      final response = TicketSubmittedResponse.fromJson(decodedResponse);
      setticketResponse = response;
      debugPrint("submitted ticket response succesfully updated to the model");
      loadingStatus = Status.COMPLETED;
    }).onError((error, stackTrace) {
      ticketResponseError = error.runtimeType;
      debugPrint(
          "error occured while getting submitted ticket data and the error is ${error.toString()}");
      loadingStatus = Status.ERROR;
    });
  }
}
