import 'package:firedesk/view/InspectionForm/approval_pending_screen.dart';
import 'package:firedesk/view/InspectionForm/services/image_update_screen.dart';
import 'package:firedesk/view/InspectionForm/services/inspection_form_screen.dart';
import 'package:firedesk/view/InspectionForm/tickets/ticket_inspection_form_screen.dart';
import 'package:firedesk/view/MyOrganisation/organisation_details_screen.dart';
import 'package:firedesk/view/OnBoarding/intro_screen.dart';
import 'package:firedesk/view/OnBoarding/splash_screen.dart';
import 'package:firedesk/view/Reports/reports_screen.dart';
import 'package:firedesk/view/Tabs/bottom_bar.dart';
import 'package:firedesk/view/Tabs/calendar_screen.dart';
import 'package:firedesk/view/Tabs/plants_home_screen.dart';
import 'package:firedesk/view/Tickets/all_tickets_screen.dart';
import 'package:firedesk/view/Tickets/ticket_submitted_data.dart';
import 'package:firedesk/view/Tickets/verify_ticket_asset.dart';
import 'package:firedesk/view/assets/asset_detail_screen.dart';
import 'package:firedesk/view/assets/asset_maintainance_history.dart';
import 'package:firedesk/view/assets/asset_maintainance_history2.dart';
import 'package:firedesk/view/authentication/phone_number_screen.dart';
import 'package:firedesk/view/privacy%20&%20terms/privacy_policy.dart';
import 'package:firedesk/view/privacy%20&%20terms/terms_and_condition.dart';
import 'package:firedesk/view/profile/profile_edit.dart';
import 'package:firedesk/view/scan_qr_code.dart';
import 'package:firedesk/view/servicess/all_services_screen.dart';
import 'package:firedesk/view/servicess/service_details_screen.dart';
import 'package:firedesk/view/servicess/service_submitted_data.dart';
import 'package:flutter/material.dart';
import 'package:page_transition/page_transition.dart';

import 'app_routes.dart';

class RouteHandler extends StatelessWidget {
  final RouteSettings settings;
  const RouteHandler({super.key, required this.settings});

  Route<dynamic>? generateRoute() {
    switch (settings.name) {
      case AppRoutes.splashscreen:
        return PageTransition(
          child: const SplashScreen(),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.loginscreen:
        return PageTransition(
          child: const PhoneNumberScreen(),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.introscreen:
        return PageTransition(
          child: const IntroScreen(),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.bottombar:
        final args = settings.arguments as Map<String, dynamic>?;
        final int index = args?["index"] ?? 0;
        return PageTransition(
          child: BottomBar(
            initialIndex: index,
          ),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.homescreen:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("plantId")) {
          return PageTransition(
            child: CalendarScreen(
              plantId: args["plantId"],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.allservices:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("plantId")) {
          return PageTransition(
            child: AllServicesScreen(
              plantId: args['plantId'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.alltickets:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("plantId")) {
          return PageTransition(
            child: AllTicketsScreen(
              plantId: args['plantId'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.inspectionFormScreen:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("serviceFormId") && args.containsKey("cameFromRejectedService")) {
          return PageTransition(
            child: InspectionFormScreen(
              serviceFormId: args['serviceFormId'],
              cameFromRejectedService: args['cameFromRejectedService'],
              geoCheck: args['geoCheck'],
              cameFromAssetDetails: args['cameFromAssetDetails'] ?? false,
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.ticketAssetVerifyScreen:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("plantId") && args.containsKey("assetId")) {
          return PageTransition(
            child: TicketAssetVerifyScreen(
              ticketId: args['ticketId'],
              plantId: args['plantId'],
              assetId: args['assetId'],
              ticketsQuestionList: args['ticketsQuestionList'],
              lat: args['lat'],
              long: args['long'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.serviceFormImageUpdate:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("imageUpdateId")) {
          return PageTransition(
            child: ServiceFormImageUpdate(
              updateImageId: args['imageUpdateId'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.servicedetails:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("serviceId")) {
          return PageTransition(
            child: ServiceDetailsScreen(
              serviceId: args['serviceId'],
              cameFromRejectedService: args['cameFromRejectedService'],
              serviceDate: args['serviceDate'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.assetMaintainanceHistory:
        return PageTransition(
          child: const AssetMaintainanceHistory(),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.assetMaintainanceHistory2:
        return PageTransition(
          child: const AssetMaintainanceHistory2(),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.organisationdetails:
        return PageTransition(
          child: const OraganisationDetails(),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.reportsscreen:
        return PageTransition(
          child: const ReportsScreen(),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.plantshomescreen:
        return PageTransition(
          child: const PlantsHomeScreen(),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.ticketInspectionFormScreen:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("ticketsQuestionsList") &&
            args.containsKey("assetId") &&
            args.containsKey("ticketId") &&
            args.containsKey("plantId")) {
          return PageTransition(
            child: TicketInspectionFormScreen(
              ticketsQuestionsList: args['ticketsQuestionsList'],
              assetId: args['assetId'],
              ticketId: args['ticketId'],
              plantId: args['plantId'],
              geoCheck: args['geoCheck'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.ticketSubmittedDataScreen:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("ticketId")) {
          return PageTransition(
            child: TicketSubmittedDataScreen(
              ticketId: args['ticketId'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.approvalPendingScreen:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("index")) {
          return PageTransition(
            child: ApprovalPendingScreen(
              index: args['index'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.profileUpdateScreen:
        final args = settings.arguments as Map<String, dynamic>;
        return PageTransition(
          child: ProfileScreenUpdate(
            email: args['email'],
            phone: args['phone'],
          ),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.assetdetail:
        final args = settings.arguments as Map<String, dynamic>;
        if (args.containsKey("assetId") &&
            args.containsKey("cameFromScanner")) {
          return PageTransition(
            child: AssetDetailScreen2(
              assetId: args['assetId'],
              cameFromScanner: args['cameFromScanner'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.qrCodeScreen:
        final args = settings.arguments as Map<String, dynamic>;
        print("calling qr code navigation");
        if (args.containsKey('cameFromAssetDetailsScreen')){
          return PageTransition(
            child: FullScreenScanner(
              cameFromAssetDetailsScreen: args['cameFromAssetDetailsScreen'],
              cameFromRejectedService: args['cameFromRejectedService'],
              geoCheck: args['geoCheck'],
              comingFromServiceDetail: args['comingFromServiceDetail'],
              serviceFormId: args['serviceFormId'],
              assetId: args['assetId'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      case AppRoutes.privacyPolicyScreen:
        return PageTransition(
          child: const PrivacyPolicyScreen(),
          type: PageTransitionType.fade,
          settings: settings,
        );
      case AppRoutes.termsAndConditionsScreen:
        return PageTransition(
          child: const TermsAndConditionScreen(),
          type: PageTransitionType.fade,
          settings: settings,
        );
        case AppRoutes.serviceSubmittedDataScreen:
        final args = settings.arguments as Map<String, dynamic>;
        print("calling qr code navigation");
        if (args.containsKey('serviceId')){
          return PageTransition(
            child: ServiceSubmittedData(
              serviceId : args['serviceId'],
            ),
            type: PageTransitionType.fade,
            settings: settings,
          );
        }
      default:
        return null;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    throw UnimplementedError();
  }
}
