import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:firedesk/data/network/basi_api_services.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/utils/auth_manager.dart';
import 'package:firedesk/utils/snack_bar_utils.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../app_exceptions.dart';

class NetworkApiServices extends BaseApiServices {
  @override
  Future<dynamic> getApi(BuildContext context, String url) async {
    final accessToken = await AuthManager().getAccessToken();
    if (kDebugMode) {
      debugPrint("Calling Api Url:  $url Access Token:  $accessToken");
    }

    try {
      final response = await http
          .get(
            Uri.parse(url),
            headers: {'Authorization': 'Bearer $accessToken'},
          )
          .timeout(const Duration(seconds: 30));

      debugPrint(
        "respone staus code while getting my assets ${response.statusCode} ${response.body}",
      );
      return returnResponse(response);
    } on SocketException {
      throw InternetException('No Internet connection');
    } on TimeoutException {
      throw RequestTimeOut('The request timed out');
    } on AppExceptions catch (e) {
      if (e is UnauthorizedException) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setBool("loggedIn", false);
        SnackBarUtils.toastMessage("Un authorized request");
        Navigator.pushNamedAndRemoveUntil(
          context,
          AppRoutes.loginscreen,
          (Route<dynamic> route) => false,
        );
      } else {
        rethrow;
      }
    } catch (e) {
      throw FetchDataException('Failed to make GET API call: $e');
    }
  }

  @override
  Future<dynamic> postApi(
    BuildContext context,
    String url,
    Map<String, dynamic> fields,
  ) async {
    final accessToken = await AuthManager().getAccessToken();

    try {
      final response = await http
          .post(
            Uri.parse(url),
            headers: {
              'Authorization': 'Bearer $accessToken',
              'Content-Type': 'application/json',
            },
            body: jsonEncode(fields),
          )
          .timeout(const Duration(seconds: 30));

      return returnResponse(response);
    } on SocketException {
      throw InternetException('No Internet connection');
    } on TimeoutException {
      throw RequestTimeOut('The request timed out');
    } on AppExceptions catch (e) {
      if (e is UnauthorizedException) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setBool("loggedIn", false);
        SnackBarUtils.toastMessage("Un authorized request");
        Navigator.pushNamedAndRemoveUntil(
          context,
          AppRoutes.loginscreen,
          (Route<dynamic> route) => false,
        );
      } else {
        rethrow;
      }
    } catch (e) {
      throw FetchDataException('Failed to make POST API call: $e');
    }
  }

  Future<dynamic> putApi(
    BuildContext context,
    String url,
    Map<String, dynamic> fields,
  ) async {
    final accessToken = await AuthManager().getAccessToken();

    try {
      final response = await http
          .put(
            Uri.parse(url),
            headers: {
              'Authorization': 'Bearer $accessToken',
              'Content-Type': 'application/json',
            },
            body: jsonEncode(fields),
          )
          .timeout(const Duration(seconds: 30));
      debugPrint("response is ${response.body}");

      return returnResponse(response);
    } on SocketException {
      throw InternetException('No Internet connection');
    } on TimeoutException {
      throw RequestTimeOut('The request timed out');
    } on AppExceptions catch (e) {
      if (e is UnauthorizedException) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setBool("loggedIn", false);
        SnackBarUtils.toastMessage("Un authorized request");
        Navigator.pushNamedAndRemoveUntil(
          context,
          AppRoutes.loginscreen,
          (Route<dynamic> route) => false,
        );
      } else {
        rethrow;
      }
    } catch (e) {
      throw FetchDataException('Failed to make PUT API call: $e');
    }
  }

  dynamic returnResponse(http.Response response) {
    if (response.statusCode == 200 || response.statusCode == 201) {
      try {
        return response;
      } catch (e) {
        throw ParsingException('Failed to parse response: ${e.toString()}');
      }
    } else {
      String errorMessage = response.toString();
      try {
        final parsedBody = jsonDecode(response.body);
        errorMessage = parsedBody['message'] ?? response.body;
      } catch (_) {}

      switch (response.statusCode) {
        case 400:
          if (kDebugMode) {
            debugPrint(" $errorMessage");
          }
          throw FetchDataException(errorMessage);
        case 401:
          throw UnauthorizedException(errorMessage);
        case 404:
          throw InvalidUrlException(errorMessage);
        case 403:
          if (kDebugMode) {
            debugPrint("403 occured  in asset details fetching");
          }
          throw LatLongException(errorMessage);
        case 500:
        case 503:
          throw ServerException(errorMessage);
        default:
          throw FetchDataException(
            'Unexpected Error: ${response.statusCode} - $errorMessage',
          );
      }
    }
  }
}
