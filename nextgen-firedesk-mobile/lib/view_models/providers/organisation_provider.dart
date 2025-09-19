import "dart:convert";

import "package:firedesk/models/data_models/Organisation/my_organisation.dart";
import "package:firedesk/res/api_urls/api_urls.dart";
import "package:firedesk/utils/make_api_call.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:http/http.dart" as http;

class OrganisationProvider extends ChangeNotifier {
  bool _isLoading = false;

  bool get isLoading => _isLoading;
  MyOrganisationInfo? _organisationInfo;

  MyOrganisationInfo? get organisationInfo => _organisationInfo;

  set organisationInfo(MyOrganisationInfo? value) {
    _organisationInfo = value;
    notifyListeners();
  }

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  Future<void> fetchOrganisationInfo(BuildContext context) async {
    isLoading = true;

    try {
      http.Response response =
          await getApiCall(context, ApiUrls.fetchOrganisationInfo);

      if (response.statusCode == 200) {
        if (kDebugMode) {
          debugPrint("Successfully fetched organisation info");
        }

        final jsonResponse = jsonDecode(response.body);
        MyOrganisationInfo organisationInfos =
            MyOrganisationInfo.fromJson(jsonResponse);

        organisationInfo = organisationInfos;
        if (kDebugMode) {
          debugPrint("Successfully assigned the data to the model");
        }
      } else {
        throw Exception(
            "Failed to fetch organisation info with status code: ${response.statusCode}");
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint("Error occurred while fetching organisation info: $e");
      }
      throw Exception("Error occurred while fetching organisation info: $e");
    } finally {
      isLoading = false;
    }
  }
}
