import "dart:async";
import "dart:convert";
import "dart:isolate";
import "package:firedesk/data/app_exceptions.dart";
import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/models/data_models/User/login_data_model.dart";
import "package:firedesk/models/data_models/User/technician_profile_model.dart"
    as technicianprofile;
import "package:firedesk/repository/authentication/auth_repository.dart";
import "package:firedesk/repository/user_profile/user_profile_repository.dart";
import "package:firedesk/res/api_urls/api_urls.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/utils/snack_bar_utils.dart";
import "package:firedesk/view/authentication/login_verify_screen.dart";
import "package:firedesk/view_models/providers/notifications_provider.dart";
import "package:firedesk/widgets/dialog/account_logged_in_dilaog.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:http/http.dart" as http;
import "package:image_picker/image_picker.dart";
import "package:shared_preferences/shared_preferences.dart";

NotificationsProvider? _notificationsProvider;

class AuthenticationProvider extends ChangeNotifier {
  final AuthRepository _apiService = AuthRepository();
  final UserProfileRepository _profileApiService = UserProfileRepository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;
  Technician? _technician;

  Technician? get technician => _technician;

  technicianprofile.Technician? _techniCian2;
  technicianprofile.Technician? get techniCian2 => _techniCian2;

  set techniCian2(technicianprofile.Technician? value) {
    _techniCian2 = value;
    notifyListeners();
  }

  technicianprofile.Technician? _techniCian2Local;
  technicianprofile.Technician? get techniCian2Local => _techniCian2Local;

  set techniCian2Local(technicianprofile.Technician? value) {
    _techniCian2Local = value;
    notifyListeners();
  }

  set technician(Technician? value) {
    _technician = value;
    notifyListeners();
  }

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  bool _isPhoneVerifyLoading = false;
  bool get isPhoneVerifyLoading => _isPhoneVerifyLoading;
  set isPhoneVerifyLoading(bool value) {
    _isPhoneVerifyLoading = value;
    notifyListeners();
  }

  int remainingSeconds = 0;
  Timer? _timer;

  void phoneVerify(BuildContext context, String? contactNo, bool navigate) {
    isPhoneVerifyLoading = true;
    Map<String, dynamic> requestBody = {"contactNo": contactNo ?? ""};
    startCountdown();

    _apiService
        .phoneVerify(context, ApiUrls.phoneVerifyUrl, requestBody)
        .then((value) {
      if (kDebugMode) {
        debugPrint(
          "Response code is 200, successfully verified phone number",
        );
      }
      if (navigate) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                LoginVerifyScreen(phoneNumber: contactNo.toString()),
          ),
        );
      }
      isPhoneVerifyLoading = false;
    }).onError((error, stackTrace) {
      isPhoneVerifyLoading = false;
      if (kDebugMode) {
        debugPrint("error type is ${error.runtimeType}");
        debugPrint("and error is $error");
      }
      if (error is FetchDataException) {
        SnackBarUtils.toastMessage(
          "your number is not registered to firedesk as a technician,try again with correct number",
        );
      } else {
        SnackBarUtils.toastMessage(error.toString());
      }
    }).whenComplete(() {
      // stopCountdown();
    });
  }

  void startCountdown() {
    remainingSeconds = 60;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        notifyListeners();
      } else if (remainingSeconds == 0) {
        stopCountdown();
      } else {
        timer.cancel(); // Stop the timer when it reaches 0
      }
    });
  }

  void stopCountdown() {
    _timer?.cancel();
    remainingSeconds = 0;
    notifyListeners();
  }

  void otpVerify(BuildContext context, String? contactNo, String? otp) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? fcmToken = prefs.getString("fcmToken") ?? "";
    isLoading = true;

    print("fcm token is $fcmToken");

    var requestBody = {
      "contactNo": contactNo ?? "",
      "otp": otp ?? "",
      "deviceToken": fcmToken,
    };

    _apiService
        .login(context, ApiUrls.otpverifyUrl, requestBody)
        .then((response) async {
      if (kDebugMode) {
        debugPrint(
          "OTP verified successfully, navigating to the home screen",
        );
      }
      try {
        Map<String, dynamic> responseData = json.decode(response.body);

        if (kDebugMode) {
          debugPrint("Decoded Response Data: $responseData");
        }

        TechnicianProfile profileData = TechnicianProfile.fromJson(
          responseData,
        );

        technician = profileData.technician;
        if (kDebugMode) {
          debugPrint("Technician name: ${profileData.technician!.name}");
        }

        // Save data to SharedPreferences
        await prefs.setBool("loggedIn", true);
        await prefs.setString("accessToken", responseData['accessToken']);
        await prefs.setString("technicianId", technician!.id ?? '');
        await prefs.setBool('isAuthenticatedUser', true);

        isLoading = false;
        showDialog(
          context: context,
          builder: (context) {
            return const AccountLoggedInDialog();
          },
        );
        await Future.delayed(const Duration(seconds: 1));
        Navigator.pop(context);
        Navigator.pushReplacementNamed(
          context,
          AppRoutes.bottombar,
          arguments: {"index": 2},
        );
      } catch (error) {
        isLoading = false;
        if (kDebugMode) {
          debugPrint("Error decoding response: $error");
        }
        SnackBarUtils.toastMessage("An error occurred. Please try again.");
      }
    }).onError((error, stackTrace) {
      isLoading = false;
      if (kDebugMode) {
        debugPrint("error type is ${error.runtimeType}");
        debugPrint("and error is $error");
      }
      if (error is FetchDataException) {
        SnackBarUtils.toastMessage(
          "You have entered the wrong OTP! Please enter the correct one and try again.",
        );
      } else {
        SnackBarUtils.toastMessage(error.toString());
      }
    });
  }

  void logout(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    isLoading = true;

    _apiService.logOut(context, ApiUrls.logoutUrl, {}).then((value) async {
      if (!context.mounted) return;

      isLoading = false;

      // Clear user-related shared preferences
      await prefs.setBool('isAuthenticatedUser', false);

      _notificationsProvider?.isolate?.kill(priority: Isolate.immediate);
      _notificationsProvider?.isolate = null;
      _notificationsProvider?.mainReceivePort.close();
      _notificationsProvider?.workerSendPort = null;

      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.loginscreen,
        (Route<dynamic> route) => false,
      );
    }).onError((error, stackTrace) {
      isLoading = false;

      if (context.mounted) {
        SnackBarUtils.toastMessage(error.toString());
      }

      if (kDebugMode) {
        debugPrint("error type is ${error.runtimeType}");
        debugPrint("and error is $error");
      }

      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.loginscreen,
        (Route<dynamic> route) => false,
      );
    });
  }

  Status _profileStatus = Status.LOADING;
  Status get profileStatus => _profileStatus;
  set profileStatus(Status value) {
    _profileStatus = value;
    notifyListeners();
  }

  dynamic _profileDataError;
  dynamic get profileDataError => _profileDataError;
  set profileDataError(dynamic value) {
    _profileDataError = value;
    notifyListeners();
  }

  void profileData(BuildContext context) async {
    profileStatus = Status.LOADING;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String technicianId = prefs.getString("technicianId") ?? "";

    if (kDebugMode) {
      debugPrint("Technician ID is $technicianId");
    }

    _profileApiService
        .getUserProfile(context, "${ApiUrls.fetchProfileDataUrl}/$technicianId")
        .then((value) {
      if (kDebugMode) {
        debugPrint("Successfully fetched the user profile data");
      }
      var jsonResponse = jsonDecode(value.body);

      technicianprofile.TechnicianProfile technicianProfileData =
          technicianprofile.TechnicianProfile.fromJson(jsonResponse);

      techniCian2 = technicianProfileData.technician;
      techniCian2Local = technicianProfileData.technician;
      profileStatus = Status.COMPLETED;
    }).onError((error, stackTrace) {
      profileStatus = Status.ERROR;
      profileDataError = error.runtimeType;
      print("error occured while fetching profile data and the error is ${error.toString()}");
    });
  }

  static Future<void> addImageToRequest(
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

  Future<void> updateProfileData(
    BuildContext context,
    String? phone,
    String? email,
    String? name,
    XFile? image1,
  ) async {
    isLoading = true;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String technicianId = prefs.getString("technicianId") ?? "";
    String? accessToken = prefs.getString("accessToken") ?? "";

    if (kDebugMode) {
      debugPrint("technician id is $technicianId");
    }

    try {
      var request = http.MultipartRequest(
        'PUT',
        Uri.parse(ApiUrls.updateProfile),
      );

      request.headers['Content-Type'] = 'multipart/form-data';
      request.headers['Authorization'] = 'Bearer $accessToken';

      request.fields['technicianUserId'] = technicianId;
      request.fields['name'] = name ?? "";
      request.fields['phone'] = phone ?? "";
      request.fields['email'] = email ?? "";

      if (image1 != null) {
        await addImageToRequest(request, 'profile', image1);
      }

      var response = await request.send();
      var responseBody = await http.Response.fromStream(response);

      if (response.statusCode == 200) {
        if (kDebugMode) {
          debugPrint("Profile data updated successfully");
          debugPrint("success message is ${responseBody.body}");
        }
      } else if (response.statusCode == 401) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setBool("loggedIn", true);
        SnackBarUtils.toastMessage("Un authorized request");
        Navigator.pushNamedAndRemoveUntil(
          context,
          AppRoutes.loginscreen,
          (Route<dynamic> route) => false,
        );
      } else {
        if (kDebugMode) {
          debugPrint("Error occurred while updating profile data");
          debugPrint("Status code is ${response.statusCode}");
          debugPrint("Error is ${responseBody.body}");
        }
        SnackBarUtils.toastMessage(responseBody.body);
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint("Error occurred while updating the user profile: $e");
      }
      rethrow;
    } finally {
      isLoading = false;
    }
  }

//delete account
  Future<void> deActivateTechnician(BuildContext context) async {
    isLoading = true;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String technicianId = prefs.getString("technicianId") ?? "";

    final response = await http.put(
      Uri.parse("${ApiUrls.deActivateAccount}/$technicianId"),
    );
    debugPrint(
      "response while deactivating account is ${response.statusCode} ${response.body}",
    );

    try {
      if (response.statusCode == 200) {
        Navigator.pushNamedAndRemoveUntil(
          context,
          AppRoutes.loginscreen,
          (Route<dynamic> route) => false,
        );
      } else if (response.statusCode == 401) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setBool("loggedIn", false);
        SnackBarUtils.toastMessage("Un authorized request");
        Navigator.pushNamedAndRemoveUntil(
          context,
          AppRoutes.loginscreen,
          (Route<dynamic> route) => false,
        );
        throw Exception('Unauthorized');
      } else {
        throw Exception('Failed to refresh token');
      }
    } on Exception catch (e) {
      if (kDebugMode) {
        debugPrint('Error: $e');
      }
      SnackBarUtils.toastMessage("Failed to deactivate your account.");
    }
  }
}
