import "dart:convert";
import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/models/data_models/Service_Models/service_detail_model.dart";
import "package:firedesk/models/data_models/Service_Models/service_form_model.dart"
    as questionmodel;
import "package:firedesk/repository/service/service_detail_repository.dart";
import "package:firedesk/res/api_urls/api_urls.dart";
import "package:firedesk/utils/snack_bar_utils.dart";
import "package:firedesk/view/InspectionForm/models/answer_model2.dart"
    as answermodel;
import "package:firedesk/widgets/dialog/location_disable_dialog.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:geolocator/geolocator.dart";
import "package:http/http.dart" as http;
import "package:image_picker/image_picker.dart";
import "package:shared_preferences/shared_preferences.dart";

class ServiceDetailScreenProvider extends ChangeNotifier {
  final ServiceDetailRepository _serviceDetailRepository =
      ServiceDetailRepository();

  bool _isLoading = false;
  bool _selectedServiceTypes = false;
  ServiceDetails? _serviceDetails;
  String? _pumpType = '';
  String? _pumpSequentialOperationTest = '';
  ServiceDetails? get serviceDetails => _serviceDetails;

  final List<answermodel.Section> _sectionsForServiceFormSubmit = [];
  questionmodel.Form? _questionsData;
  final List<Map<String, dynamic>> _sectionsForServiceUpdate = [];
  final List<Map<String, dynamic>> _questionsForServiceUpdate = [];

  questionmodel.ServiceForm? _serviceForm;
  questionmodel.ServiceForm? get serviceForm => _serviceForm;
  set serviceForm(questionmodel.ServiceForm? value) {
    _serviceForm = value;
    notifyListeners();
  }

  String? get pumpType => _pumpType;
  String? get pumpSequentialOperationTest => _pumpSequentialOperationTest;
  List<answermodel.Section> get sectionsForServiceFormSubmnit =>
      _sectionsForServiceFormSubmit;
  bool get selectedServiceTypes => _selectedServiceTypes;
  List<Map<String, dynamic>> get sectionsForServiceUpdate =>
      _sectionsForServiceUpdate;
  List<Map<String, dynamic>> get questionsForServiceUpdate =>
      _questionsForServiceUpdate;
  questionmodel.Form? get questionsData => _questionsData;
  String? _pumpStatus;
  String? _dieselLevel;
  String? _pressureSwitchCondition;
  String? _waterStorageLevel;
  List<String> _serviceTypeList = [];

  String? get pumpStatus => _pumpStatus;
  String? get dieselLevel => _dieselLevel;
  String? get pressureSwitchCondition => _pressureSwitchCondition;
  String? get waterStorageLevel => _waterStorageLevel;
  List<String> get serviceTypeList => _serviceTypeList;

  List<answermodel.Question2?> _sectionDatatoSubmitForm = [];
  List<answermodel.Question2?> get sectionDatatoSubmitForm =>
      _sectionDatatoSubmitForm;
  set sectionDatatoSubmitForm(List<answermodel.Question2?> value) {
    _sectionDatatoSubmitForm = value;
    notifyListeners();
  }

  set pumpType(String? value) {
    _pumpType = value;
    notifyListeners();
  }

  void makeFieldsNull() {
    _pumpType = null;
    _pumpSequentialOperationTest = null;
    _pumpStatus = null;
    _dieselLevel = null;
    _pressureSwitchCondition = null;
    _waterStorageLevel = null;
    notifyListeners();
  }

  set pumpSequentialOperationTest(String? value) {
    _pumpSequentialOperationTest = value;
    notifyListeners();
  }

  set selectedServiceTypes(bool value) {
    _selectedServiceTypes = value;
    notifyListeners();
  }

  void addQuestionForList(Map<String, dynamic> value) {
    _questionsForServiceUpdate.add(value);
    notifyListeners();
  }

  set serviceTypeList(List<String> value) {
    _serviceTypeList = value;
    notifyListeners();
  }

  set waterStorageLevel(String? value) {
    _waterStorageLevel = value;
    notifyListeners();
  }

  set pumpStatus(String? value) {
    _pumpStatus = value;
    notifyListeners();
  }

  set dieselLevel(String? value) {
    _dieselLevel = value;
    notifyListeners();
  }

  set pressureSwitchCondition(String? value) {
    _pressureSwitchCondition = value;
    notifyListeners();
  }

  set questionsData(questionmodel.Form? value) {
    _questionsData = value;
    notifyListeners();
  }

  set serviceDetails(var value) {
    _serviceDetails = value;
    notifyListeners();
  }

  bool get isLoading => _isLoading;

  set setIsLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  bool _statusUpdateLoading = false;
  bool get statusUpdateLoading => _statusUpdateLoading;
  set setStatusUpdateLoading(bool value) {
    _statusUpdateLoading = value;
    notifyListeners();
  }

  bool _updatedStatus = false;
  bool get updatedStatus => _updatedStatus;
  set setUpdatedStatus(bool value) {
    _updatedStatus = value;
    notifyListeners();
  }

  void updateQuestionAnswer(
    int sectionIndex,
    String questionString,
    String newAnswer,
  ) {
    try {
      print(
          "updatefunction called and section index is $sectionIndex and question is $questionString and answer is $newAnswer");
      var questionToUpdate = sectionDatatoSubmitForm.firstWhere(
        (question) => question!.question == questionString,
      );

      questionToUpdate!.answer = newAnswer;
      notifyListeners();

      if (kDebugMode) {
        debugPrint(
          "Updated question answer for question ID $questionString to $newAnswer",
        );
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint(
          "Question with ID $questionString not found in section $sectionIndex.",
        );
      }
    }
  }

  void updateNoteForQUestionAnswer(
    int sectionIndex,
    String questionId,
    String note,
  ) {
    try {
      var questionToUpdate = sectionDatatoSubmitForm.firstWhere(
        (question) => question!.question == questionId,
      );

      questionToUpdate!.note = note;
      notifyListeners();
      if (kDebugMode) {
        debugPrint(
          "Updated question note for question ID $questionId to $note",
        );
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint(
          "Question with ID $questionId not found in section $sectionIndex.",
        );
      }
    }
  }

  void updateQuestionNote(int sectionIndex, String questionId, String note) {
    if (sectionIndex < sectionsForServiceFormSubmnit.length) {
      answermodel.Question2? questionToUpdate = sectionDatatoSubmitForm
          .firstWhere((question) => question!.question == questionId);

      questionToUpdate!.note = note;
      notifyListeners();
      if (kDebugMode) {
        debugPrint(
          "uodated the note inside the section ${questionToUpdate.question}",
        );
      }
    } else {
      if (kDebugMode) {
        debugPrint("Section at index $sectionIndex not found.");
      }
    }
  }

  dynamic _serviceDataError;
  dynamic get serviceDataError => _serviceDataError;
  set serviceDataError(dynamic value) {
    _serviceDataError = value;
    notifyListeners();
  }

  Status _serviceDataStatus = Status.LOADING;
  Status get serviceDataStatus => _serviceDataStatus;
  set serviceDataStatus(Status value) {
    _serviceDataStatus = value;
    notifyListeners();
  }

  Future<void> fetchServiceInfo(BuildContext context, String serviceId) async {
    serviceDataStatus = Status.LOADING;
    if (kDebugMode) {
      debugPrint("Service Id is $serviceId");
    }
    setIsLoading = true;

    _serviceDetailRepository.getServiceDetail(
      context,
      "${ApiUrls.fetchServiceInfoUrl}/$serviceId",
      {},
    ).then((value) {
      if (kDebugMode) {
        debugPrint("Successfully got the service info");
      }
      Map<String, dynamic> jsonResponse =
          jsonDecode(value.body) as Map<String, dynamic>;
      serviceDetails = ServiceDetails.fromJson(jsonResponse);
      if (kDebugMode) {
        debugPrint(
          "Successfully assigned the data of the service details to model",
        );
      }
      serviceDataStatus = Status.COMPLETED;
    }).onError((error, stackTrace) async {
      debugPrint(
        "error occured and error type is ${error.runtimeType} and error message is ${error.toString()}",
      );

      SnackBarUtils.toastMessage(
        "Error occurred while fetching service details ${error.toString()}",
      );
    });
  }

  Future<Position> _determinePosition(BuildContext context) async {
    bool serviceEnabled;
    LocationPermission permission;

    // Check if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      showLocationDisabledDialog(
        context,
        () {
          Navigator.of(context).pop();
          Navigator.of(context).pop();
        },
        () async {
          Navigator.of(context).pop();
          Navigator.of(context).pop();
          await Geolocator.openLocationSettings();
        },
      );
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied) {
        Navigator.of(context).pop();
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      showLocationDisabledDialog(
        context,
        () {
          Navigator.of(context).pop();
          Navigator.of(context).pop();
        },
        () async {
          Navigator.of(context).pop();
          Navigator.of(context).pop();
          await Geolocator.openAppSettings();
        },
      );
      return Future.error(
        'Location permissions are permanently denied, we cannot request permissions.',
      );
    }

    return await Geolocator.getCurrentPosition();
  }

  dynamic _serviceFormError;
  dynamic get serviceFormError => _serviceFormError;
  set serviceFormError(dynamic value) {
    _serviceFormError = value;
    notifyListeners();
  }

  void updateServiceAssetLatLong(String lat, String long) {
    if (kDebugMode) {
      debugPrint("updating lat long in asset info provider");
    }
    if (serviceDetails!.assetsId != null &&
        serviceDetails!.assetsId!.isNotEmpty) {
      serviceDetails!.assetsId![0].lat = lat;
      serviceDetails!.assetsId![0].long = long;
      notifyListeners();
    } else {
      if (kDebugMode) {
        debugPrint("Asset info or assets list is null or empty");
      }
    }
  }

  String? _serviceFormErrorString;
  String? get serviceFormErrorString => _serviceFormErrorString;
  set serviceFormErrorString(String? value) {
    _serviceFormErrorString = value;
    notifyListeners();
  }

  Status _serviceFormStatus = Status.LOADING;
  Status get serviceFormStatus => _serviceFormStatus;
  set serviceFormStatus(Status value) {
    _serviceFormStatus = value;
    notifyListeners();
  }

  Future<void> getServiceForm(
    BuildContext context,
    // String productId,
    // String serviceType,
    // organisationUserId,
    // String categoryId,
    String serviceFormId,
  ) async {
    serviceFormStatus = Status.LOADING;
    Map<String, dynamic> fields = {
      // "productId": productId,
      // "serviceType": serviceType,
      // "organizationUserId": organisationUserId,
      // "categoryId": categoryId,
    };

    if (kDebugMode) {
      debugPrint(
        "serviceFormId  is $serviceFormId ",
      );
    }

    _serviceDetailRepository
        .getServiceForm(context, "${ApiUrls.getServiceForm}/$serviceFormId")
        .then((value) {
      if (kDebugMode) {
        debugPrint("Successfully got the service form");
      }
      final jsonResponse = jsonDecode(value.body);

      // Convert the response to ServiceForm model
      questionmodel.ServiceForm serviceForm1 =
          questionmodel.ServiceForm.fromJson(jsonResponse);
      serviceForm = serviceForm1;

      // Process the form data
      _questionsData = serviceForm1.form;
      sectionDatatoSubmitForm.clear();

      print("came until the sectiondatatosubmit clear");

      for (var item in _questionsData!.questions!) {
        sectionDatatoSubmitForm.add(
          answermodel.Question2(
              question: item.question ?? "", answer: "", note: ""),
        );
      }

      print("finished for loop");

      selectedServiceTypes = true;
      setUpdatedStatus = true;
      if (kDebugMode) {
        debugPrint(
          "After everything, the list of sections is $_sectionsForServiceFormSubmit",
        );
      }
      for (var item in _sectionsForServiceFormSubmit) {
        if (kDebugMode) {
          debugPrint("item name is ${item.name}");
          debugPrint("item questions are ${item.questions}");
        }
      }
      serviceFormStatus = Status.COMPLETED;
    }).onError((error, stackTrace) {
      print(
          "error occured in getting service form and error is ${error.toString()}");
      serviceFormStatus = Status.ERROR;
      serviceFormErrorString = error.toString();
      serviceFormError = error.runtimeType;
    });
  }

  Future<List> submitServiceFrom(
    String serviceTicketId,
    String serviceFormId,
    String batteryStatusReading,
    String suctionPressure,
    String dischargePressure,
    bool isRejectedService,
    String assetType,
    String geoCheck,
  ) async {
    setStatusUpdateLoading = true;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? accessToken = prefs.getString("accessToken");
    // String? technicianId = prefs.getString("technicianId");
    // List<String> serviceType = [];

    if (kDebugMode) {
      debugPrint("asset type is $assetType");
      // debugPrint("organization user id is $organizationUserId");
    }

    if (kDebugMode) {
      debugPrint(
          "questions length is ${sectionDatatoSubmitForm.length} and serviceFormId is $serviceFormId and serviceTicketId is $serviceTicketId");
      // debugPrint("plant id is $plantId and ased id is $assetId");
    }

    // inspectionChecked ? serviceType.add("Inspection") : null;
    // serviceOrMaintainnanceChecked
    //     ? serviceType.add("Service/Maintenance")
    //     : null;
    // testingChecked ? serviceType.add("Testing") : null;

    for (var value in sectionDatatoSubmitForm) {
      if (kDebugMode) {
        debugPrint("value is ${value!.note}");
      }
    }

    try {
      double? suctionPressureInt;
      double? dischargePressureInt;
      double? batteryStatusInt;

      if (kDebugMode) {
        debugPrint("suction pressure is $suctionPressure");
        debugPrint("discharge pressure is $dischargePressure");
      }

      if (assetType == "PUMP ROOM SERVICE") {
        suctionPressureInt =
            suctionPressure.isNotEmpty ? double.tryParse(suctionPressure) : 0;
        dischargePressureInt = dischargePressure.isNotEmpty
            ? double.tryParse(dischargePressure)
            : 0;
        batteryStatusInt = batteryStatusReading.isNotEmpty
            ? double.tryParse(batteryStatusReading)
            : 0;

        // Validate that all numeric fields are parsed correctly
        if (suctionPressureInt == null ||
            dischargePressureInt == null ||
            batteryStatusInt == null) {
          throw Exception(
            'Invalid input: ensure all numeric fields are correctly formatted',
          );
        }
      }

      if (kDebugMode) {
        debugPrint("suction pressure is $suctionPressureInt");
      }

      final Map<String, dynamic> pumpDetails = {
        "pumpType": pumpType ?? "",
        "pumpStatus": pumpStatus ?? "",
        "pumpSequentialOperationTest": pumpSequentialOperationTest ?? "",
        "suctionPressure": suctionPressureInt,
        "pressureSwitchCondition": pressureSwitchCondition ?? "",
        "dischargePressureGaugeReading": dischargePressureInt,
        "waterStorageLevel": waterStorageLevel ?? "",

        // if(pumpType == "DIESEL LEVEL") "batteryStatusReading" : batteryStatusInt,
        // if(pumpType == "DIESEL LEVEL") "dieselLevel" : dieselLevel ?? "",
      };

      if (pumpType == 'DIESEL ENGINE') {
        pumpDetails["dieselLevel"] = dieselLevel ?? "";
      }

      if (pumpType == 'DIESEL ENGINE') {
        pumpDetails["batteryStatusReading"] = batteryStatusInt ?? 0;
      }

      debugPrint("ths final pump details value is $pumpDetails");

      // debugPrint(
      //   "the final sybmit value datas are techniacin id is $technicianId and plantid is $plantId and assetid is $assetId and servicetype is $serviceType and section  name is ${questionsData!.name} and servicename is $assetType and service id is $serviceFromId",
      // );

      for (var value in sectionDatatoSubmitForm) {
        debugPrint(
            "question id - ${value!.question},answer is ${value.answer}");
      }

      print(
          "complete section data to submit value is $sectionDatatoSubmitForm");
      print(
          "oth index question is ${sectionDatatoSubmitForm[0]!.question} and answer is ${sectionDatatoSubmitForm[0]!.answer}");

      final Map<String, dynamic> body = {
        // "technicianUserId": technicianId,
        "sectionName": questionsData!.name ?? "",
        "questions": sectionDatatoSubmitForm,
        // "serviceName": assetType,
        "geoCheck": geoCheck,
        "serviceFormId": serviceFormId,
        "serviceTicketId": serviceTicketId,
        if (assetType == "PUMP ROOM SERVICE") "pumpDetails": pumpDetails,
      };

      // if (isRejectedService) {
      //   body["serviceFormId"] = serviceFormId;
      // }

      final response = await http.post(
        Uri.parse(ApiUrls.submitServiceForm),
        body: jsonEncode(body),
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 200) {
        if (kDebugMode) {
          debugPrint("Successfully submitted the service form");
        }
        var responseBody = jsonDecode(response.body);
        if (kDebugMode) {
          debugPrint("data is ${responseBody['data']}");
        }
        return [200, responseBody['data']];
      } else {
        if (kDebugMode) {
          debugPrint("reponse status code is ${response.statusCode}");
        }
        if (kDebugMode) {
          debugPrint("Error occurred while submitting the service form");
          debugPrint("Response body: ${response.body}");
          debugPrint("status code is ${response.statusCode}");
        }
        return [400, ''];
      }
    } catch (err) {
      if (kDebugMode) {
        debugPrint(
          "Catch error occurred while submitting the service form: $err",
        );
      }
      return [500, ''];
    } finally {
      setStatusUpdateLoading = false;
    }
  }

  static Future<void> _addImageToRequest(
    http.MultipartRequest request,
    String fieldName,
    XFile? image,
  ) async {
    if (image != null) {
      var imageStream = http.ByteStream(
        Stream.fromIterable([await image.readAsBytes()]),
      );
      var length = await image.length();
      var imageMultipartFile = http.MultipartFile(
        fieldName,
        imageStream,
        length,
        filename: image.path.split("/").last,
      );
      request.files.add(imageMultipartFile);
    }
  }

  Future<void> uploadImages({
    required XFile image1,
    XFile? image2,
    XFile? image3,
    String? responseId,
    String? remark,
  }) async {
    // Replace with your actual server URL
    setStatusUpdateLoading = true;
    const String uploadUrl = ApiUrls.uploadServicesImage;

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? accessToken = prefs.getString("accessToken");

    // Create a multipart request
    var request = http.MultipartRequest('POST', Uri.parse(uploadUrl));

    request.headers['Content-Type'] = 'multipart/form-data';
    request.headers['Authorization'] = 'Bearer $accessToken';
    (remark != null && remark.isNotEmpty)
        ? request.fields['remark'] = remark
        : null;

    if (responseId != null) {
      request.fields['formResponseId'] = responseId;
    }

    await _addImageToRequest(request, 'image1', image1);

    if (image2 != null) {
      await _addImageToRequest(request, 'image2', image2);
    }

    if (image3 != null) {
      await _addImageToRequest(request, 'image3', image3);
    }

    try {
      var response = await request.send();

        debugPrint('Response body: ${response.stream.bytesToString()}');

      if (response.statusCode == 200) {
        if (kDebugMode) {
          debugPrint('Images uploaded successfully.');
        }
      } else {
        if (kDebugMode) {
          debugPrint(
            'Failed to upload images. Status code: ${response.statusCode}',
          );
        }
        var responseBody = await response.stream.bytesToString();
        if (kDebugMode) {
          debugPrint('Response body: $responseBody');
        }
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('An error occurred while uploading images: $e');
      }
    } finally {
      setStatusUpdateLoading = false;
    }
  }
}
