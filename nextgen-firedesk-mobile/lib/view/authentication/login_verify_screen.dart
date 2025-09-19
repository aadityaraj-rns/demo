import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/utils/snack_bar_utils.dart';
import 'package:firedesk/view_models/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:provider/provider.dart';

class LoginVerifyScreen extends StatefulWidget {
  final String phoneNumber;

  const LoginVerifyScreen({super.key, required this.phoneNumber});

  @override
  State<LoginVerifyScreen> createState() => _LoginVerifyScreenState();
}

class _LoginVerifyScreenState extends State<LoginVerifyScreen> {
  final List<TextEditingController> _controllers =
      List.generate(4, (index) => TextEditingController());
  final TextEditingController _pinCodeController = TextEditingController();

  @override
  void dispose() {
    // Dispose all controllers to avoid memory leaks
    for (var controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthenticationProvider>(
      builder: (context, provider, _) {
        return ModalProgressHUD(
          inAsyncCall: provider.isLoading,
          progressIndicator: CircularProgressIndicator(
            color: basicColor,
          ),
          child: Scaffold(
            backgroundColor: Colors.grey[100],
            body: SafeArea(
              child: SingleChildScrollView(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20.w),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      SizedBox(height: 60.h),
                      Center(
                        child: Image.asset(
                          "assets/Logos/firedesk_orange_logo.png",
                          height: 120.h,
                          width: 200.w,
                          fit: BoxFit.contain,
                        ),
                      ),
                      SizedBox(height: 30.h),

                      // Header Section
                      const Text(
                        "OTP Verification",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 10.h),
                      Text(
                        "Enter the OTP sent to ${widget.phoneNumber}",
                        style: const TextStyle(
                          color: Colors.black54,
                          fontSize: 16,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 50.h),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 40.w),
                        child: PinCodeTextField(
                          cursorColor: Colors.blue,
                          obscureText: true,
                          controller: _pinCodeController,
                          appContext: context,
                          length: 4,
                          keyboardType: TextInputType.number,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly
                          ],
                          onChanged: (value) {},
                          pinTheme: PinTheme(
                            activeFillColor: Colors.transparent,
                            inactiveFillColor: Colors.transparent,
                            selectedFillColor: Colors.transparent,
                            borderWidth: 1,
                            activeBorderWidth: 1,
                            inactiveBorderWidth: 1,
                            selectedBorderWidth: 1,
                            disabledBorderWidth: 1,
                            shape: PinCodeFieldShape.box,
                            borderRadius: BorderRadius.circular(10),
                            fieldHeight: 55.h,
                            fieldWidth: 60.w,
                            inactiveColor: Colors.orange,
                            selectedColor: Colors.blue,
                            activeColor: Colors.orange,
                            disabledColor: Colors.orange,
                          ),
                          onCompleted: (pin) async {},
                        ),
                      ),
                      // buildPinCodeFields(context),
                      SizedBox(height: 40.h),
                      buildVerifyButton(context),
                      SizedBox(height: 20.h),
                      buildResendButton(provider),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  /// Resend Button Widget
  Widget buildResendButton(AuthenticationProvider authProvider) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          "Didn't receive the code?",
          style: TextStyle(color: Colors.black54),
        ),
        SizedBox(width: 5.w),
        authProvider.remainingSeconds > 0
            ? Text(
                "Resend the otp in ${authProvider.remainingSeconds}",
                style: TextStyle(
                  color: greyFontColor,
                  fontWeight: FontWeight.bold,
                ),
              )
            : GestureDetector(
                onTap: () {
                  authProvider.phoneVerify(context, widget.phoneNumber, false);
                },
                child: Text(
                  "Resend",
                  style: TextStyle(
                    color: basicColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
      ],
    );
  }

  /// Verify Button Widget
  Widget buildVerifyButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Collect OTP from all controllers

        if (_pinCodeController.text.length == 4) {
          // Trigger OTP verification using the provider
          final provider =
              Provider.of<AuthenticationProvider>(context, listen: false);
          provider.otpVerify(
              context, widget.phoneNumber, _pinCodeController.text);
        } else {
          SnackBarUtils.toastMessage("Please enter the complete OTP.");
        }
      },
      child: Container(
        height: 50.h,
        width: double.infinity,
        decoration: BoxDecoration(
          color: basicColor,
          borderRadius: BorderRadius.circular(25.r),
        ),
        child: Center(
          child: Text(
            "Verify & Continue",
            style: TextStyle(
              color: Colors.white,
              fontSize: 18.sp,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}
