import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firedesk/firebase_options.dart';
import 'package:firedesk/res/routes/app_pages.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/view/push_notification_service.dart';
import 'package:firedesk/view_models/providers/all_service_screen_provider.dart';
import 'package:firedesk/view_models/providers/all_ticket_provider.dart';
import 'package:firedesk/view_models/providers/asset_list_provider.dart';
import 'package:firedesk/view_models/providers/bottom_bar_provider.dart';
import 'package:firedesk/view_models/providers/home_screen_provider.dart';
import 'package:firedesk/view_models/providers/notifications_provider.dart';
import 'package:firedesk/view_models/providers/organisation_provider.dart';
import 'package:firedesk/view_models/providers/plants_screen_provider.dart';
import 'package:firedesk/view_models/providers/scaffold_messenger_provider.dart';
import 'package:firedesk/view_models/providers/service_detail_screen_provider.dart';
import 'package:firedesk/view_models/providers/submitted_service_data_provider.dart';
import 'package:firedesk/view_models/providers/ticket_info_provider.dart';
import 'package:firedesk/view_models/providers/ticket_inspection_form_screen_provder.dart';
import 'package:firedesk/view_models/providers/ticket_submitted_data_provider.dart';
import 'package:firedesk/view_models/providers/tickets_list_provider.dart';
import 'package:firedesk/view_models/providers/user_provider.dart';
import 'package:firedesk/widgets/widget_utils.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  // await FirebaseMessaging.instance.deleteToken();
  requestNotificationPermissions();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(
    MultiProvider (
      providers: [
        ChangeNotifierProvider<AssetInfoProvider>(
          create: (context) => AssetInfoProvider(),
        ),
        ChangeNotifierProvider<NotificationsProvider>(
          create: (context) => NotificationsProvider(),
        ),
        ChangeNotifierProvider<TicketInfoProvider>(
          create: (context) => TicketInfoProvider(),
        ),
        ChangeNotifierProvider<TicketListsProvider>(
          create: (context) => TicketListsProvider(),
        ),
        ChangeNotifierProvider<AuthenticationProvider>(
          create: (context) => AuthenticationProvider(),
        ),
        ChangeNotifierProvider<PlantsScreenProvider>(
          create: (context) => PlantsScreenProvider(),
        ),
        ChangeNotifierProvider<HomeScreenProvider>(
          create: (context) => HomeScreenProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => ServiceDetailScreenProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => AssetInfoProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => BottomBarProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => OrganisationProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => TicketInspectionFormScreenProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => ScaffoldMessengerProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => AllServiceScreenProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => AllTicketsProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => SubmittedServiceDataProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => TicketSubmittedDataProvider(),
        ),
      ],
      child: MyApp(),
    ),
  );
}

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  if (kDebugMode) {
    debugPrint("Handling a background message: ${message.messageId}");
  }
}

void requestNotificationPermissions() async {
  FirebaseMessaging messaging = FirebaseMessaging.instance;

  // Request permission for notifications
  NotificationSettings settings = await messaging.requestPermission(
    alert: true,
    badge: true,
    sound: true,
  );

  if (settings.authorizationStatus == AuthorizationStatus.authorized) {
    debugPrint("✅ Notifications permission granted");
    String? token = await FirebaseMessaging.instance.getToken();

    if (token != null) {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('fcmToken', token);
      debugPrint('FCM Token saved in sharedPreference: $token');
    } else {
      debugPrint("Failed to get FCM Token");
    }
  } else {
    debugPrint("❌ Notifications permission denied");
  }
}

class MyApp extends StatelessWidget {
  final PushNotificationService _notificationService =
      PushNotificationService();

  MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    _notificationService.initialize();

    return ScreenUtilInit(
      designSize: ScreenUtil.defaultSize,
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (_, child) {
        initializeScreenSize(context);
        return Consumer<ScaffoldMessengerProvider>(
          builder: (context, scaffoldMessengerProvider, _) {
            return MaterialApp(
              scaffoldMessengerKey:
                  scaffoldMessengerProvider.scaffoldMessengerKey,
              debugShowCheckedModeBanner: false,
              title: 'Fire Desk',
              theme: ThemeData(
                colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
                useMaterial3: true,
              ),
              onGenerateRoute: (settings) =>
                  RouteHandler(settings: settings).generateRoute(),
              initialRoute: AppRoutes.splashscreen,
            );
          },
        );
      },
    );
  }
}
