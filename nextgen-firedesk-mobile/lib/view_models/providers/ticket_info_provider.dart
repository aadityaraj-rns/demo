import "dart:convert";

import "package:firedesk/models/data_models/ticket_info.dart";
import "package:firedesk/res/api_urls/api_urls.dart";
import "package:firedesk/utils/make_api_call.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";

class TicketInfoProvider with ChangeNotifier {
  TicketInfo? assetInfo;
  bool _isLoading = false;
  TicketInfo? get getMyassetInfo => assetInfo;
  bool get isLoading => _isLoading;

  set setMyAssetInfo(TicketInfo? newAssetInfo) {
    assetInfo = newAssetInfo;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  Future<TicketInfo> fetchTicketInfo(BuildContext context, int ticketId) async {
    var responseBody = {
      "ticketId": ticketId,
    };
    _setLoading(true);

    try {
      // Use the centralized postApiCall method
      var response =
          await postApiCall(context, ApiUrls.fetchTicketInfoUrl, responseBody);

      if (response.statusCode == 200) {
        if (kDebugMode) {
          debugPrint("Successfully got the ticket info");
        }
        Map<String, dynamic> jsonResponse = jsonDecode(response.body);
        TicketInfo ticketInfo = TicketInfo.fromJson(jsonResponse);
        _setLoading(false);
        return ticketInfo;
      } else {
        if (kDebugMode) {
          debugPrint("Error occurred while getting the ticket info");
        }
        throw Exception(
          "Failed to load ticket info with status code: ${response.statusCode}",
        );
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint("Error occurred while getting the ticket info: $e");
      }
      throw Exception("Error occurred while getting the ticket info: $e");
    } finally {
      _setLoading(false);
    }
  }
}
