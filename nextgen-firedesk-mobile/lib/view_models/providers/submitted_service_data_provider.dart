import 'dart:convert';

import 'package:firedesk/models/data_models/Service_Models/submitted_service_info.dart';
import 'package:firedesk/res/api_urls/api_urls.dart';
import 'package:firedesk/utils/make_api_call.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class SubmittedServiceDataProvider extends ChangeNotifier {
  bool _isLoading = false;
  bool get isLoading => _isLoading;
  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  final TextEditingController _batteryStatusReadingController =
      TextEditingController();
  final TextEditingController _suctionPressureController =
      TextEditingController();
  final TextEditingController _dischargePressureController =
      TextEditingController();

  // Getters for controllers
  TextEditingController get batteryStatusReadingController =>
      _batteryStatusReadingController;
  TextEditingController get suctionPressureController =>
      _suctionPressureController;
  TextEditingController get dischargePressureController =>
      _dischargePressureController;

  String? _pumpType;
  String? _pumpSequentialOperationTest;

  String? get pumpType => _pumpType;
  String? get pumpSequentialOperationTest => _pumpSequentialOperationTest;

  void setPumpType(String? value) {
    _pumpType = value;
    notifyListeners();
  }

  void setPumpSequentialOperationTest(String? value) {
    _pumpSequentialOperationTest = value;
    notifyListeners();
  }

  // Setters for controller values
  void setBatteryStatusReading(String value) {
    _batteryStatusReadingController.text = value;
    notifyListeners();
  }

  void setSuctionPressure(String value) {
    _suctionPressureController.text = value;
    notifyListeners();
  }

  void setDischargePressure(String value) {
    _dischargePressureController.text = value;
    notifyListeners();
  }

  // Method to clear all controllers
  void clearControllers() {
    _batteryStatusReadingController.clear();
    _suctionPressureController.clear();
    _dischargePressureController.clear();
    notifyListeners();
  }

  String? _pumpStatus;
  String? _dieselLevel;
  String? _pressureSwitchCondition;
  String? _waterStorageLevel;

  // Getters
  String? get pumpStatus => _pumpStatus;
  String? get dieselLevel => _dieselLevel;
  String? get pressureSwitchCondition => _pressureSwitchCondition;
  String? get waterStorageLevel => _waterStorageLevel;

  // Setters
  void setPumpStatus(String? value) {
    _pumpStatus = value;
    notifyListeners();
  }

  void setDieselLevel(String? value) {
    _dieselLevel = value;
    notifyListeners();
  }

  void setPressureSwitchCondition(String? value) {
    _pressureSwitchCondition = value;
    notifyListeners();
  }

  void setWaterStorageLevel(String? value) {
    _waterStorageLevel = value;
    notifyListeners();
  }

  void setInitialDataValues(
      String? pumpTYpe,
      String? pumpSequentialOpeartionTest,
      String? batteryStatus,
      String? suctionPressure,
      String? dischargePressure,
      String? pumpStatus,
      String? dieselLevel,
      String? waterStorageLevel,
      String? pressureSwitchCondition) {
    _pumpStatus = pumpStatus;
    _pumpType = pumpTYpe;
    _pumpSequentialOperationTest = pumpSequentialOpeartionTest;
    _dieselLevel = dieselLevel;
    _pressureSwitchCondition = pressureSwitchCondition;
    _waterStorageLevel = waterStorageLevel;
    _suctionPressureController.text = suctionPressure ?? "";
    _dischargePressureController.text = dischargePressure ?? "";
    _batteryStatusReadingController.text = batteryStatus ?? "";
    notifyListeners();
  }

  List<Question> _questions = [];
  List<Question> get questions => _questions;
  void setQuestions(List<Question> questions) {
    _questions = questions;
    notifyListeners();
  }

  SubmittedServiceInfo? _submittedServiceInfo;
  SubmittedServiceInfo? get submittedServiceInfo => _submittedServiceInfo;
  void setSubmittedServiceInfo(SubmittedServiceInfo? submittedServiceInfo) {
    _submittedServiceInfo = submittedServiceInfo;
    notifyListeners();
  }

  Future<void> fetchServiceInfo(BuildContext context, String serviceId) async {
    if (kDebugMode) {
      debugPrint("Service Id is $serviceId");
    }
    isLoading = true;

    try {
      var response = await getApiCall(
          context, "${ApiUrls.fetchSubmittedServiceInfoUrl}/$serviceId");

      if (response.statusCode == 200) {
        if (kDebugMode) {
          debugPrint("Successfully got the service info");
        }
        Map<String, dynamic> jsonResponse = jsonDecode(response.body);
        SubmittedServiceInfo serviceInfo =
            SubmittedServiceInfo.fromJson(jsonResponse);
        print("completed first data assigning in propvider");

        setSubmittedServiceInfo(serviceInfo);
        // setInitialDataValues(
        //     serviceInfo.pumpDetails?.pumpType,
        //     serviceInfo.pumpDetails?.pumpSequentialOperationTest,
        //     serviceInfo.pumpDetails?.batteryStatusReading.toString(),
        //     serviceInfo.pumpDetails?.suctionPressure.toString(),
        //     serviceInfo.pumpDetails?.dischargePressureGaugeReading.toString(),
        //     serviceInfo.pumpDetails?.pumpStatus,
        //     serviceInfo.pumpDetails?.dieselLevel,
        //     serviceInfo.pumpDetails?.waterStorageLevel,
        //     serviceInfo.pumpDetails?.pressureSwitchCondition);

        setQuestions(serviceInfo.questions ?? []);
        if (kDebugMode) {
          debugPrint(
              "got questions and length of questions is ${_questions.length}");
          debugPrint(
              "Successfully assigned the data of the submitted  service details to model");
        }
      } else if (response.statusCode == 403) {
        // Handle 403 Forbidden
        if (kDebugMode) {
          debugPrint("Forbidden access while fetching service info");
        }
      } else {
        if (kDebugMode) {
          debugPrint(
              "Error occurred while getting the service info: ${response.body}");
        }
        throw Exception(
            "Failed to load service info with status code: ${response.statusCode}");
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint("Error occurred while getting the service info: $e");
      }
      throw Exception("Error occurred while getting the service info: $e");
    } finally {
      isLoading = false;
    }
  }
}
