import 'dart:convert';

import 'package:firedesk/data/reponse/status.dart';
import 'package:firedesk/models/data_models/Service_Models/due_services_model.dart';
import "package:firedesk/models/data_models/Service_Models/service_by_status_model.dart"
    as servicesbystatusmodel;
import 'package:firedesk/repository/service/all_service_repository.dart';
import 'package:firedesk/res/api_urls/api_urls.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AllServiceScreenProvider extends ChangeNotifier {
  final AllServiceRepository _allServiceRepository = AllServiceRepository();

  int _currentIndex = 0;

  int get currentIndex => _currentIndex;

  set currentIndex(int index) {
    _currentIndex = index;
    notifyListeners();
  }

  List<DueServices> _dueServicessList = [];
  // List<PendingService> _upcomingServicesList = [];
  List<servicesbystatusmodel.Service> _approvalPendingServices = [];

  List<servicesbystatusmodel.Service> _completedService = [];

  List<servicesbystatusmodel.Service> _rejectedServices = [];
  List<servicesbystatusmodel.Service> _lapsedServices = [];

  List<DueServices> get dueServicesList => _dueServicessList;
  // List<PendingService> get upcomingServicesList => _upcomingServicesList;
  List<servicesbystatusmodel.Service> get approvalPendingServices =>
      _approvalPendingServices;
  List<servicesbystatusmodel.Service> get completedServices =>
      _completedService;
  List<servicesbystatusmodel.Service> get rejectedServices => _rejectedServices;
  List<servicesbystatusmodel.Service> get lapsedServices => _lapsedServices;

  set completedServices(List<servicesbystatusmodel.Service> value) {
    _completedService = value;
    notifyListeners();
  }

  set rejectedServices(List<servicesbystatusmodel.Service> value) {
    _rejectedServices = value;
    notifyListeners();
  }

  set dueServicesList(List<DueServices> value) {
    _dueServicessList = value;
    notifyListeners();
  }

  // set upcomingServicesList(List<PendingService> value) {
  //   _upcomingServicesList = value;
  //   notifyListeners();
  // }

  set approvalPendingServices(List<servicesbystatusmodel.Service> vaue) {
    _approvalPendingServices = vaue;
    notifyListeners();
  }

  set lapsedServices(List<servicesbystatusmodel.Service> value) {
    _lapsedServices = value;
    notifyListeners();
  }

  List<servicesbystatusmodel.Service> _sevicesByStatusList = [];

  List<servicesbystatusmodel.Service> get servicesByStatusList =>
      _sevicesByStatusList;

  set servicesByStatusList(List<servicesbystatusmodel.Service> value) {
    _sevicesByStatusList = value;
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

  Future<void> fetchDueServices(BuildContext context, String plantId) async {
    dataStatus = Status.LOADING;

    print("plant id is $plantId and url is ${ApiUrls.fetchDueServices}/$plantId");
  

    _allServiceRepository
        .getDueServices(context, "${ApiUrls.fetchDueServices}/$plantId")
        .then((value) {
      if (kDebugMode) {
        debugPrint("Successfully got the incomplete services");
      }

      final decodedJson = jsonDecode(value.body);

      // If the response is directly a List
      List<dynamic> dueServicesJson = decodedJson;

      // OR, if it's a map containing a list, like { "DueServicess": [...] }
      // List<dynamic> dueServicesJson = decodedJson['DueServicess'];

      List<DueServices> dueServices =
          dueServicesJson.map((item) => DueServices.fromJson(item)).toList();

      dueServicesList = dueServices;

      if (kDebugMode) {
        debugPrint(
            "Successfully got the list of incomplete services, and length is ${dueServicesList.length}");
      }

      dataStatus = Status.COMPLETED;
    }).onError((value, stackTrace) {
      print(
          "error occured while fetching due services and the error is ${value.toString()}");
      dataError = value.runtimeType;
      dataStatus = Status.ERROR;
    });
  }

  Future<void> fetchServicesListByStatus(
    BuildContext context, String status, String plantId) async {
  
  if (kDebugMode) {
    debugPrint("plant id is $plantId and status is $status");
  }
  
  dataStatus = Status.LOADING;

  var requestBody = {
    "status": status,
    "plantId": plantId,
  };

  try {
    var value = await _allServiceRepository.getServicesByStatus(
        context, ApiUrls.fetchServicesByStatusUrl, requestBody);

    if (kDebugMode) {
      debugPrint("Successfully got the list of services by status");
      debugPrint("Response body: ${value.body}");
    }

    var decoded = json.decode(value.body);  // Map<String, dynamic>

    if (decoded['services'] != null) {
      servicesByStatusList = (decoded['services'] as List)
          .map((e) => servicesbystatusmodel.Service.fromJson(e))
          .toList();

      if (kDebugMode) {
        debugPrint("Services count: ${servicesByStatusList.length}");
      }
    } else {
      servicesByStatusList = [];
      if (kDebugMode) {
        debugPrint("No services found");
      }
    }

    // Categorizing based on status
    if (status == "Completed") {
      completedServices = servicesByStatusList;
    } else if (status == "Rejected") {
      rejectedServices = servicesByStatusList;
    } else if (status == "Waiting for approval") {
      approvalPendingServices = servicesByStatusList;
    } else if (status == "Lapsed") {
      lapsedServices = servicesByStatusList;
    }

    dataStatus = Status.COMPLETED;
    if (kDebugMode) {
      debugPrint("Successfully assigned services to servicesByStatusList");
    }
  } catch (error) {
    print("Error occurred in fetchServicesListByStatus: $error");
    dataError = error.runtimeType;
    dataStatus = Status.ERROR;
  }
}

}
