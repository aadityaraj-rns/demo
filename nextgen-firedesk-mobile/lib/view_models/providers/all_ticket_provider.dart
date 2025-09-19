import 'package:firedesk/data/reponse/status.dart';
import "package:firedesk/models/data_models/Ticket_Models/all_tickets_model.dart"
    as ticketsbystatusmodel;
import 'package:firedesk/repository/tickets/all_ticekts_repository.dart';
import 'package:firedesk/res/api_urls/api_urls.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AllTicketsProvider extends ChangeNotifier {
  final AllTicketsRepository _allTicketsRepository = AllTicketsRepository();

  int _currentIndex = 0;
  int get currentIndex => _currentIndex;

  set currentIndex(int index) {
    _currentIndex = index;
    notifyListeners();
  }

  List<ticketsbystatusmodel.Ticket> _incompleteTicketsList = [];
  List<ticketsbystatusmodel.Ticket> _upcomingTicketsList = [];
  List<ticketsbystatusmodel.Ticket> _completedTicketsList = [];
  List<ticketsbystatusmodel.Ticket> _appprovalPendingTicketsList = [];
  List<ticketsbystatusmodel.Ticket> _rejectedTicketsList = [];

  List<ticketsbystatusmodel.Ticket> get incompleteTicketsList =>
      _incompleteTicketsList;
  List<ticketsbystatusmodel.Ticket> get upcomingTicketsList =>
      _upcomingTicketsList;
  List<ticketsbystatusmodel.Ticket> get completedTicketsList =>
      _completedTicketsList;
  List<ticketsbystatusmodel.Ticket> get appprovalPendingTicketsList =>
      _appprovalPendingTicketsList;
  List<ticketsbystatusmodel.Ticket> get rejectedTicketsList =>
      _rejectedTicketsList;

  set incompleteTicketsList(List<ticketsbystatusmodel.Ticket> value) {
    _incompleteTicketsList = value;
    notifyListeners();
  }

  set upcomingTicketsList(List<ticketsbystatusmodel.Ticket> value) {
    _upcomingTicketsList = value;
    notifyListeners();
  }

  set completedTicketsList(List<ticketsbystatusmodel.Ticket> value) {
    _completedTicketsList = value;
    notifyListeners();
  }

  set appprovalPendingTicketsList(List<ticketsbystatusmodel.Ticket> value) {
    _appprovalPendingTicketsList = value;
    notifyListeners();
  }

  set rejectedTicketsList(List<ticketsbystatusmodel.Ticket> value) {
    _rejectedTicketsList = value;
    notifyListeners();
  }

  List<String> staytusList = [
    "Open",
    "Waiting for approval",
    "Completed",
    "Rejected",
  ];

  dynamic _dataError;
  dynamic get dataError => _dataError;
  set dataError(dynamic value) {
    _dataError = value;
    notifyListeners();
  }

  Status _dataStatus = Status.LOADING;
  Status get dataStatus => _dataStatus;
  set dataStatus(Status value) {
    _dataStatus = value;
    notifyListeners();
  }

  Future<void> fetchTicketsByStatus(
      BuildContext context, int index, String plantId) async {
    dataStatus = Status.LOADING;

    if (kDebugMode) {
      debugPrint("Plant ID is $plantId");
      debugPrint("Index called is $index");
      debugPrint("sttaus is ${staytusList[index]}");
    }

    if (kDebugMode) {
      debugPrint(
          "url is ${ApiUrls.fetchTicketsByStatus}/${staytusList[index]}/$plantId");
    }

    _allTicketsRepository
        .getTicketsByStatus(context,
            "${ApiUrls.fetchTicketsByStatus}/${staytusList[index]}/$plantId")
        .then((value) {
      // Construct the endpoint URL
      if (kDebugMode) {
        debugPrint("Successfully fetched tickets by status");
      }

      var ticketsBystatus1 =
          ticketsbystatusmodel.ticketsByStatusFromJson(value.body);

      if (staytusList[index] == "Open") {
        upcomingTicketsList = ticketsBystatus1.tickets ?? [];
      } else if (staytusList[index] == "Rejected") {
        rejectedTicketsList = ticketsBystatus1.tickets ?? [];
      } else if (staytusList[index] == "Completed") {
        completedTicketsList = ticketsBystatus1.tickets ?? [];
      } else if (staytusList[index] == "Waiting for approval") {
        appprovalPendingTicketsList = ticketsBystatus1.tickets ?? [];
      }

      if (kDebugMode) {
        debugPrint("Length of ticketsByStatus list: "
            "Incomplete: ${_incompleteTicketsList.length}, "
            "Upcoming: ${upcomingTicketsList.length}, "
            "Completed: ${completedTicketsList.length}, "
            "Waiting for approval: ${appprovalPendingTicketsList.length}, "
            "Rejected: ${rejectedTicketsList.length}");
      }
      dataStatus = Status.COMPLETED;
    }).onError((error, stackTrace) {
      if (kDebugMode) {
        debugPrint("error type is ${error.runtimeType}");
        debugPrint("error occured while fetching tickets by status: $error");
      }
      dataError = error.runtimeType;
      dataStatus = Status.ERROR;
    });
  }
}
