import 'dart:async';
import 'dart:convert';

import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/utils/auth_manager.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

Future<http.Response> getApiCall(BuildContext context, String endpoint) async {
  final accessToken = await AuthManager().getAccessToken();
  if (kDebugMode) {
    debugPrint("Calling Api Url:  $endpoint Access Token:  $accessToken");
  }
  try {
    final response = await http.get(
      Uri.parse(endpoint),
      headers: {
        'Authorization': 'Bearer $accessToken',
      },
    ).timeout(
      const Duration(seconds: 60),
    );
    if (response.statusCode == 401) {
      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.loginscreen,
        (Route<dynamic> route) => false,
      );
      return response;
    } else if (response.statusCode >= 200 && response.statusCode < 300) {
      return response;
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized');
    } else {
      throw Exception('Error: ${response.statusCode}, ${response.body}');
    }
  } catch (e) {
    if (kDebugMode) {
      debugPrint('Request failed with error: $e');
    }
    throw Exception('Failed to make GET API call: $e');
  }
}

Future<http.Response> postApiCall(
    BuildContext context, String endpoint, Map<String, dynamic> fields) async {
  final accessToken = await AuthManager().getAccessToken();

  try {
    final response = await http.post(
      Uri.parse(endpoint),
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(fields),
    );

    if (response.statusCode == 401) {
      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.loginscreen,
        (Route<dynamic> route) => false,
      );
      return response;
    } else if (response.statusCode >= 200 && response.statusCode < 300) {
      return response;
    } else {
      throw Exception('Error: ${response.statusCode}, ${response.body}');
    }
  } catch (e) {
    if (kDebugMode) {
      debugPrint('Request failed with error: $e');
    }
    throw Exception('Failed to make POST API call: $e');
  }
}
