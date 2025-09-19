import "dart:async";
import "dart:convert";

import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/res/api_urls/api_urls.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/utils/snack_bar_utils.dart";
import "package:firedesk/view/InspectionForm/models/ticket_answer_model.dart";
import "package:firedesk/widgets/dialog/lat_long_update_dialog.dart";
import "package:firedesk/widgets/dialog/location_disable_dialog.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:geolocator/geolocator.dart";
import "package:http/http.dart" as http;
import "package:image_picker/image_picker.dart";
import "package:shared_preferences/shared_preferences.dart";

class TicketListsProvider with ChangeNotifier {
  // final AllTicketsRepository _allTicketsRepository = AllTicketsRepository();
  // final List<IncompletedTicket> _iincompleteTickets = [];
  // final List<UpcomingTicket> _upcomingTickets = [];
  List<TicketQUestionAnswer> _ticketQuestionAnswers = [];
  int _selectedIndex = 0;
  int get selectedIndex => _selectedIndex;
  set selectedIndex(
    int value,
  ) {
    _selectedIndex = value;
    notifyListeners();
    // await fetchTicketsByStatus(staytusList[value], plantId);
  }

  List<String> staytusList = [
    "Incomplete",
    "Upcoming",
    "Waiting for approval",
    "Completed",
    "Rejected",
  ];

  List<int> fetchedDataofStatus = [];

  List<TicketQUestionAnswer> get ticketQuestionAnswers =>
      _ticketQuestionAnswers;

  set ticketQuestionAnswers(List<TicketQUestionAnswer> value) {
    _ticketQuestionAnswers = value;
    notifyListeners();
  }

  bool _ticketSubmitLoading = false;

  bool get ticketSubmitLoading => _ticketSubmitLoading;

  set ticketSubmitLoading(bool value) {
    _ticketSubmitLoading = value;
    notifyListeners();
  }

  updateTicketQUestionAnswer(
    int index,
    String value,
  ) {
    _ticketQuestionAnswers[index].answer = value;
    notifyListeners();
  }

  updateNoteForTicketQuestionAnswer(int index, String value) {
    _ticketQuestionAnswers[index].note = value;
    notifyListeners();
  }

  bool _isLoading = false;

  bool get isLoading => _isLoading;

  void _setLoading(bool value) {
    _isLoading = value;
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

  static Future<void> _addImageToRequest(
    http.MultipartRequest request,
    String fieldName,
    XFile? image,
  ) async {
    if (image != null) {
      var imageStream =
          http.ByteStream(Stream.fromIterable([await image.readAsBytes()]));
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

  Future<void> submitTicket(
    BuildContext context,
    String ticketId,
    String plantId,
    String assetsId,
    String technicianRemarks, {
    XFile? image1,
    XFile? image2,
    XFile? image3,
    String? geoCheck,
  }) async {
    const int maxRetries = 2;
    int retryCount = 0;
    bool success = false;

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String technicianId = prefs.getString("technicianId") ?? "";
    String? accessToken = prefs.getString("accessToken") ?? "";
    Map<String, dynamic> additionalFields = {};

    if (kDebugMode) {
      debugPrint(
          "technician id $technicianId ticket id $ticketId and asset id $assetsId plant id is $plantId");
    }
    for (var value in ticketQuestionAnswers) {
      if (kDebugMode) {
        debugPrint("${value.question} ${value.answer} ${value.note}");
      }
    }

    while (retryCount < maxRetries && !success) {
      try {
        retryCount++;
        ticketSubmitLoading = true;

        if (kDebugMode) {
          debugPrint("Attempt $retryCount: Submitting ticket...");
        }

        var request = http.MultipartRequest(
          'POST',
          Uri.parse(ApiUrls.submitTicket),
        );

        // Add headers
        request.headers['Content-Type'] = 'multipart/form-data';
        request.headers['Authorization'] = 'Bearer $accessToken';

        // Add form data
        request.fields['ticketId'] = ticketId;
        request.fields['plantId'] = plantId;
        request.fields['assetsId'] = assetsId;
        request.fields['status'] = "Waiting for approval";
        request.fields['technicianId'] = technicianId;
        request.fields['remark'] = technicianRemarks;
        request.fields['geoCheck'] = geoCheck ?? "";

        // Add questions
        List<Map<String, dynamic>> questionsList = ticketQuestionAnswers
            .map((ticketQuestionAnswer) => ticketQuestionAnswer.toJson())
            .toList();
        request.fields['questions'] = jsonEncode(questionsList);

        additionalFields.forEach((key, value) {
          request.fields[key] = value;
        });

        debugPrint("image 1 is $image1");
        debugPrint("image 2 is $image2");
        debugPrint("image 3 is $image3");

        // Add images if available
        await _addImageToRequest(request, "ticketimage1", image1);
        await _addImageToRequest(request, "ticketimage2", image2);
        await _addImageToRequest(request, "ticketimage3", image3);

        var response = await request.send();
        var responseBody = await http.Response.fromStream(response);

        if (response.statusCode == 201) {
          if (retryCount > 1) {
            SnackBarUtils.toastMessage(
                "Asset Location is updated successfully to this latitude and longitude");
          }
          if (kDebugMode) {
            debugPrint("Ticket submitted successfully: ${responseBody.body}");
          }
          success = true;
          debugPrint(response.toString());
          debugPrint("retry count is $retryCount");
          Navigator.pushNamed(context, AppRoutes.approvalPendingScreen,
              arguments: {"index": 1});
        } else if (response.statusCode == 403) {
          if (kDebugMode) {
            debugPrint("403 detected. Fetching location...");
          }

          Position position = await _determinePosition(context);
          String latitude = position.latitude.toString();
          String longitude = position.longitude.toString();
          additionalFields['lat'] = latitude;
          additionalFields['long'] = longitude;

          bool shouldRetry = await _handleLatLongUpdateDialog(context);
          if (shouldRetry) {
            continue;
          } else {
            break;
          }
        } else {
          if (kDebugMode) {
            debugPrint("Failed to submit ticket: ${response.statusCode}");
            debugPrint("Response body: ${responseBody.body}");
          }
          SnackBarUtils.toastMessage(responseBody.body);
          break;
        }
      } catch (e) {
        if (kDebugMode) {
          debugPrint("Error occurred during ticket submission: $e");
        }
        SnackBarUtils.toastMessage(
            "Failed to submit ticket. Please try again.$e");
      } finally {
        ticketSubmitLoading = false;
      }
    }
  }

  Future<bool> _handleLatLongUpdateDialog(BuildContext context) async {
    final Completer<bool> completer = Completer<bool>();

    showLatLongUpdateDialog(
      context,
      () {
        completer.complete(true);
      },
      () {
        Navigator.pop(context);
        Navigator.popUntil(context, ModalRoute.withName(AppRoutes.alltickets));
        completer.complete(false);
      },
    );

    return completer.future;
  }

  Future<Position> _determinePosition(BuildContext context) async {
    bool serviceEnabled;
    LocationPermission permission;

    // Check if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
        Navigator.of(context).pop();
      }, () async {
        Navigator.of(context).pop();
        Navigator.of(context).pop();
        await Geolocator.openLocationSettings();
      });
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      // Request location permission
      permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied) {
        Navigator.of(context).pop();
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
        Navigator.of(context).pop();
      }, () async {
        Navigator.of(context).pop();
        Navigator.of(context).pop();
        await Geolocator.openAppSettings();
      });
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    // Permissions are granted, fetch the location
    return await Geolocator.getCurrentPosition();
  }

  // void _showPermissionDialog(BuildContext context) {
  //   showDialog(
  //     context: context,
  //     builder: (BuildContext context) {
  //       return AlertDialog(
  //         title: const Text('Permission Required'),
  //         content: const Text(
  //             'Location permissions are permanently denied. Please enable permissions in the app settings.'),
  //         actions: [
  //           TextButton(
  //             onPressed: () {
  //               Navigator.of(context).pop();
  //               Navigator.of(context).pop();
  //             },
  //             child: const Text('Cancel'),
  //           ),
  //           TextButton(
  //             onPressed: () async {
  //               Navigator.of(context).pop();
  //               Navigator.of(context).pop();
  //               await Geolocator.openAppSettings();
  //             },
  //             child: const Text('Open Settings'),
  //           ),
  //         ],
  //       );
  //     },
  //   );
  // }
}
