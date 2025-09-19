import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http/io_client.dart';

/// Returns an HTTP client that bypasses SSL certificate validation.
/// ⚠️ Only for development and internal testing. Not recommended for production.
http.Client getUnsafeClient() {
  final HttpClient ioHttpClient = HttpClient()
    ..badCertificateCallback = (
      X509Certificate cert,
      String host,
      int port,
    ) {
      print('⚠️ Ignoring invalid SSL certificate from $host');
      return true;
    };

  return IOClient(ioHttpClient);
}