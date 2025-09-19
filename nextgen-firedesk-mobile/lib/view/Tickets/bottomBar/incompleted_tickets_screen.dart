import 'package:firedesk/data/app_exceptions.dart';
import 'package:firedesk/data/reponse/status.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/components/general_exception_widget.dart';
import 'package:firedesk/res/components/internet_exception.dart';
import 'package:firedesk/res/components/request_timeout.dart';
import 'package:firedesk/res/components/server_exception_widget.dart';
import 'package:firedesk/view/Tickets/components/build_ticket.dart';
import 'package:firedesk/view_models/providers/all_ticket_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class IncompletedTicketsScreen extends StatelessWidget {
  final String plantId;
  const IncompletedTicketsScreen({super.key, required this.plantId});

  @override
  Widget build(BuildContext context) {
    return Consumer<AllTicketsProvider>(
        builder: (context, allTicketsProvider, _){
      return Scaffold(
        backgroundColor: Colors.grey.withOpacity(0.05),
        body: returnContents(allTicketsProvider, context),
      );
    });
  }

  Widget returnContents(
      AllTicketsProvider allTicketsProvider, BuildContext context) {
    switch (allTicketsProvider.dataStatus) {
      case Status.LOADING:
        return Center(
          child: CircularProgressIndicator(
            color: basicColor,
          ),
        );
      case Status.ERROR:
        if (allTicketsProvider.dataError == InternetException) {
          return InterNetExceptionWidget(
            onPress: () {
              allTicketsProvider.fetchTicketsByStatus(context, 0, plantId);
            },
          );
        } else if (allTicketsProvider.dataError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              allTicketsProvider.fetchTicketsByStatus(context, 0, plantId);
            },
          );
        } else if (allTicketsProvider.dataError == ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              allTicketsProvider.fetchTicketsByStatus(context, 0, plantId);
            },
          );
        } else {
          return GeneralExceptionWidget(
            onPress: () {
              allTicketsProvider.fetchTicketsByStatus(context, 0, plantId);
            },
          );
        }
      case Status.COMPLETED:
        return buildTicketsTab(
          "Pending Tickets",
          "Pending",
          Icons.pending,
          Colors.orange,
          allTicketsProvider.incompleteTicketsList,
        );
      default:
        return Center(
          child: CircularProgressIndicator(
            color: basicColor,
          ),
        );
    }
  }
}
