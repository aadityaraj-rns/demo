import 'package:flutter/material.dart';

abstract class BaseApiServices {
  Future<dynamic> getApi(BuildContext context,String url);

  Future<dynamic> postApi(BuildContext context,String endpoint, Map<String, dynamic> fields);
}