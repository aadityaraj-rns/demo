import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/view_models/providers/notifications_provider.dart';
import 'package:firedesk/widgets/widget_utils.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkIfNewUser();
  }

  Future<void> _checkIfNewUser() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool isNewUser = prefs.getBool('isNewUser') ?? true;
    bool isAuthenticatedUser = prefs.getBool('isAuthenticatedUser') ?? false;
    if (kDebugMode) {
      debugPrint("is new user $isNewUser");
      debugPrint("is authenticated user $isAuthenticatedUser");
    }
    Future.delayed(const Duration(seconds: 3), () {
      if (isNewUser) {
        prefs.setBool('isNewUser', false);
        Navigator.pushReplacementNamed(context, AppRoutes.introscreen);
      } else {
        if (isAuthenticatedUser) {
          final notificationsProvider =
              Provider.of<NotificationsProvider>(context, listen: false);
          notificationsProvider.fetchNotifications(context);
          Navigator.pushReplacementNamed(context, AppRoutes.bottombar);
          // Navigator.pushReplacementNamed(context, AppRoutes.loginscreen);
        } else {
          Navigator.pushReplacementNamed(context, AppRoutes.loginscreen);
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Animate(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ClipRRect(
                child: Image.asset(
                  "assets/Logos/firedesk logo2.png",
                  fit: BoxFit.fill,
                  width: 300.w,
                  height: 300.h,
                ),
              ),
              getVerSpace(60.h),
              AnimatedTextKit(
                animatedTexts: [
                  WavyAnimatedText(
                    'Fire Desk',
                    textStyle: TextStyle(
                      color: basicColor,
                      fontSize: 30,
                      fontFamily: "Poppins",
                    ),
                  ),
                ],
                isRepeatingAnimation: true,
                onTap: () {},
              ),
            ],
          ),
        ),
      ),
    );
  }
}
