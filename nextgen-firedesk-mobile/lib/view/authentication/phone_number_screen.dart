import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/view_models/providers/user_provider.dart";
import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart";
import "package:provider/provider.dart";
import "package:url_launcher/url_launcher.dart";

class PhoneNumberScreen extends StatefulWidget {
  const PhoneNumberScreen({super.key});
  @override
  State<PhoneNumberScreen> createState() => _PhoneNumberScreenState();
}

class _PhoneNumberScreenState extends State<PhoneNumberScreen> {
  TextEditingController phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool loginButtonClicked = false;

  bool validateLogin() {
    return _formKey.currentState?.validate() ?? false;
  }

  final String url = "https://www.firedesk.in";

  Future<void> _launchUrl() async {
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalNonBrowserApplication);
    } else {
      throw 'Could not launch $url';
    }
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);

    return Consumer<AuthenticationProvider>(
      builder: (context, provider, _) {
        return ModalProgressHUD(
          inAsyncCall: provider.isPhoneVerifyLoading,
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
                      const Text(
                        "Welcome Back!",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      // SizedBox(height: 10.h),
                      // const Text(
                      //   "Enter your phone number to continue.",
                      //   style: TextStyle(
                      //     color: Colors.black54,
                      //     fontSize: 16,
                      //   ),
                      //   textAlign: TextAlign.center,
                      // ),
                      SizedBox(height: 90.h),

                      // Form Section
                      Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // const Text(
                            //   "Phone Number",
                            //   style: TextStyle(
                            //     color: Colors.black87,
                            //     fontSize: 16,
                            //     fontWeight: FontWeight.w600,
                            //   ),
                            // ),
                            SizedBox(height: 8.h),
                            TextFormField(
                              controller: phoneController,
                              keyboardType: TextInputType.number,
                              inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly,
                                LengthLimitingTextInputFormatter(10),
                              ],
                              onChanged: (value) {
                                _formKey.currentState?.validate();
                              },
                              decoration: InputDecoration(
                                hintText: "Enter your phone number",
                                prefixIcon:
                                    Icon(Icons.phone, color: basicColor),
                                filled: true,
                                fillColor: Colors.white,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12.r),
                                  borderSide:
                                      BorderSide(color: Colors.grey[300]!),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12.r),
                                  borderSide:
                                      BorderSide(color: Colors.grey[300]!),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12.r),
                                  borderSide: BorderSide(color: basicColor),
                                ),
                                errorBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12.r),
                                  borderSide:
                                      const BorderSide(color: Colors.red),
                                ),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return "Please enter your phone number.";
                                } else if (value.length != 10) {
                                  return "Phone number must be 10 digits.";
                                }
                                return null;
                              },
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: 40.h),
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            loginButtonClicked = true;
                          });
                          if (validateLogin()) {
                            provider.phoneVerify(
                                context, phoneController.text, true);
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
                              " Verify ",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18.sp,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: 30.h),

                      // Footer Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            "Don't have an account?",
                            style: TextStyle(color: Colors.black54),
                          ),
                          SizedBox(width: 5.w),
                          GestureDetector(
                            onTap: () {
                              _launchUrl();
                            },
                            child: Text(
                              "Contact FireDesk",
                              style: TextStyle(
                                color: basicColor,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 20.h),
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
}
