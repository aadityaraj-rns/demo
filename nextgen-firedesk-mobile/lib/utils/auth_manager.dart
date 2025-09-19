import 'package:shared_preferences/shared_preferences.dart';

class AuthManager {
  Future<String?> getAccessToken() async{
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString("accessToken");
  }

  Future<String?> getTechnicianId() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString("technicianId") ?? "";
  }

  Future<String?> refreshAccessToken() async {
    return null;
  }
}