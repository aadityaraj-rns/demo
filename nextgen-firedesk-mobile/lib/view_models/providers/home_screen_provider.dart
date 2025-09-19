import "dart:convert";

import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/models/data_models/HomeScreenModels/date_data_model.dart" as dayModel;
import "package:firedesk/models/data_models/HomeScreenModels/month_data_model.dart";
import "package:firedesk/repository/Home/home_screen_repository.dart";
import "package:firedesk/res/api_urls/api_urls.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:shared_preferences/shared_preferences.dart";

class HomeScreenProvider extends ChangeNotifier {
  final HomeScreenRepository _apiService = HomeScreenRepository();

  bool _isLoading = false;
  bool _isModalProgressHudLoading = false;

  List<MonthServicesAndTickets> _calenderResult = [];
  // List<Asset> _assets = [];
  List<ServiceData> _services = [];
  List<Ticket> _tickets = [];
  List<dayModel.Ticket> _dayTickets = [];
  List<dayModel.Service> _dayServices = [];
  final Map<DateTime, int> _eventCounts = {};
  Map<DateTime, List<ServiceData>> _selectedAssets = {};
  Map<DateTime, List<Ticket>> _selectedTickets = {};
  bool _showDayData = false;
  bool get showDayData => _showDayData;
  bool get isLoading => _isLoading;
  bool get isModalProgressHudLoading => _isModalProgressHudLoading;
  List<MonthServicesAndTickets> get calenderResult => _calenderResult;
  List<ServiceData> get services => _services;
  List<Ticket> get tickets => _tickets;
  List<dayModel.Ticket> get dayTickets => _dayTickets;
  List<dayModel.Service> get dayServices => _dayServices;
  Map<DateTime, int> get eventCounts => _eventCounts;
  Map<DateTime, List<ServiceData>> get selectedAssets => _selectedAssets;
  Map<DateTime, List<Ticket>> get selectedTickets => _selectedTickets;

  set setselectedAssets(Map<DateTime, List<ServiceData>> data){
    _selectedAssets = data;
    notifyListeners();
  }

  set setselectedTickets(Map<DateTime, List<Ticket>> data){
    _selectedTickets = data;
    notifyListeners();
  }

  void populateEventCountsAndAssets(List<MonthServicesAndTickets> calendarResults) {
    eventCounts.clear();
    selectedAssets.clear();
    selectedTickets.clear();
    _services.clear();
    _tickets.clear();
    if (kDebugMode) {
      debugPrint("came inside the populate event count and assets and calendar result length is ${calendarResults.length}");
    }
    for (MonthServicesAndTickets result in calendarResults) {
      DateTime date =
          DateTime.utc(result.date.year, result.date.month, result.date.day);
      eventCounts[date] = result.serviceDatas.length + result.tickets.length;
      _selectedAssets[date] = result.serviceDatas;
      _selectedTickets[date] = result.tickets;
      _services.addAll(result.serviceDatas);
      _tickets.addAll(result.tickets);

      if (kDebugMode) {
        debugPrint("added the eventCounts and evencounts is $eventCounts");
        debugPrint(
            "added the asset ids lisdt for the dates and map is $selectedAssets");
        debugPrint(
            "added the ticket ids for the dates and map is $selectedTickets");
      }
    }

    print("services length before notifylistener is ${services.length}");
    notifyListeners();
  }

  set setModalProgressHudLoading(bool value) {
    _isModalProgressHudLoading = value;
    notifyListeners();
  }

  set setShowDayData(bool value) {
    _showDayData = value;
    notifyListeners();
  }

  set setisLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  set setCalenderResult(List<MonthServicesAndTickets> value) {
    _calenderResult = value;
    notifyListeners();
  }

  set setServices(List<ServiceData> value) {
    _services = value;
    notifyListeners();  
  }

  set setTickets(List<Ticket> value) {
    _tickets = value;
    notifyListeners();
  }

  set setDayTickets(List<dayModel.Ticket> value) {
    _dayTickets = value;
    notifyListeners();
  }

  set setDayServices(List<dayModel.Service> value) {
    _dayServices = value;
    notifyListeners();
  }

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

  Future<void> getMonthData(BuildContext context, String plantId, String month,
      String year, bool camefromChangingMonth) async {
    dataStatus = Status.LOADING;
    setShowDayData = false;

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String technicianId = prefs.getString("technicianId") ?? "";

    setModalProgressHudLoading = true;
    if (kDebugMode) {
      debugPrint(
        "technician Id is $technicianId and plantId is $plantId and month is $month and year is $year and coming from changing Month is $camefromChangingMonth",
      );
    }
    Map<String, dynamic> data = {
      // "technicianUserId": technicianId,
      "plantId": plantId,
      "month": int.parse(month),
      "year": int.parse(year),
    };

    _apiService
        .getMonthData(context, ApiUrls.fetchMonthDataUrl, data)
        .then((value) {
        print("response body is ${value.body}");
      List<MonthServicesAndTickets> monthServicesAndTickets =
          monthServicesAndTicketsFromJson(value.body);
      if (kDebugMode) {
        debugPrint("month data is ${monthServicesAndTickets}");
      }

      setCalenderResult = monthServicesAndTickets;
      // setAssets = monthServicesAndTickets.assets!;
      // setTickets = monthServicesAndTickets.tickets!;

      if (kDebugMode) {
        debugPrint(
            "calendar result from backend is ${monthServicesAndTickets}");
      }

      populateEventCountsAndAssets(
          monthServicesAndTickets);
      if (kDebugMode) {
        debugPrint(
            "Successfully assigned the month's data to the model and calendar data length is ${calenderResult.length}");
            // and the services length is ${calenderResult.ser.length} and tickets length is ${tickets.length}
      }
      dataStatus = Status.COMPLETED;
    }).onError((error, stackTrace) {
      debugPrint(
          "error type is ${error.runtimeType} and error is ${error.toString()}");
      dataError = error.runtimeType;
      dataStatus = Status.ERROR;
    }).whenComplete(() {
      setModalProgressHudLoading = false;
      setisLoading = false;
    });
  }

  Future<void> getDateData(BuildContext context, List<ServiceData> assetIds,
      List<Ticket> ticketsIds, String date,String plantId) async {
    setModalProgressHudLoading = true;
    if (kDebugMode) {
      debugPrint(
          "Fetching data for date: $date with ticket IDs: $ticketsIds and asset IDs: $assetIds");
    }

    _apiService.getDayData(context, ApiUrls.fetchDateDataUrl, {
      // "assetIds": assetIds,
      // "ticketsIds": ticketsIds,
      "plantId": plantId,
      "date": date,
    }).then((value) {
      if (kDebugMode) {
        debugPrint("Successfully got the data for the date");
      }

      // final Map<String, dynamic> decodedResponse = jsonDecode(value.body);
    dayModel.DayServicesAndTickets dayServicesAndTickets =
          dayModel.dayServicesAndTicketsFromJson(value.body);

      setDayServices = dayServicesAndTickets.services;
      setDayTickets = dayServicesAndTickets.tickets;

      if (kDebugMode) {
        debugPrint("Successfully assigned the data of the date to the models");
        debugPrint("Date services length is ${dayServices.length}");
        debugPrint("Date tickets length is ${dayTickets.length}");
      }
    }).onError((value, stackTrace) {
      print("got error while fetching the day services and the error is ${value.toString()}");
      dataError = value.runtimeType;
      dataStatus = Status.ERROR;
    }).whenComplete(() {
      setModalProgressHudLoading = false;
    });
  }
}
