import "package:firedesk/models/data_models/Ticket_Models/all_tickets_model.dart"
    as ticketsbystatumodel;
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/res/styles/text_style.dart";
import "package:firedesk/utils/snack_bar_utils.dart";
import "package:firedesk/view/Tickets/ticket_submitted_data.dart";
import "package:firedesk/view_models/providers/tickets_list_provider.dart";
import "package:firedesk/widgets/date_formatter.dart";
import "package:firedesk/widgets/dialog/camera_disabled_dialog.dart";
import "package:flutter/foundation.dart";
import "package:flutter/gestures.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:lottie/lottie.dart";
import "package:permission_handler/permission_handler.dart";
import "package:provider/provider.dart";

Widget buildTicketsTab(
  String headingText,
  String status,
  IconData icon,
  Color color,
  List<ticketsbystatumodel.Ticket> listofTickets,
) {
  return SingleChildScrollView(
    child: Consumer<TicketListsProvider>(
        builder: (context, ticketsListProvider, _) {
      return listofTickets.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    height: 100.h,
                  ),
                  Lottie.asset(
                    "assets/jsons/empty_tickets.json",
                  ),
                  SizedBox(height: 50.h),
                  Text(
                    "currently there are no tickets in this status",
                    style: normalTextSTyle1,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            )
          : ListView.builder(
              itemCount: listofTickets.length,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemBuilder: (BuildContext context, int index) {
                final ticket = listofTickets[index];
                return ticketCard(context, ticket, status);
              });
    }),
  );
}

Widget ticketCard(
    BuildContext context, ticketsbystatumodel.Ticket ticket, String status) {
  return Padding(
    padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
    child: Card(
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      color: Colors.white,
      shadowColor: Colors.grey.withOpacity(0.1),
      child: Padding(
        padding: EdgeInsets.all(12.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Ticket Id - ${ticket.ticketId}",
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 14.sp,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      "Asset Id - ${ticket.assetId}",
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 14.sp,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ],
            ),
            // SizedBox(height: 16.h),
            // Container(
            //   decoration: BoxDecoration(
            //     color: Colors.grey.shade100,
            //     borderRadius: BorderRadius.circular(8),
            //   ),
            //   padding: EdgeInsets.all(12.w),
            //   child: Column(
            //     crossAxisAlignment: CrossAxisAlignment.start,
            //     children: [
            //       Text(
            //         "Questions to Answer",
            //         style: TextStyle(
            //           fontSize: 16.sp,
            //           fontWeight: FontWeight.w600,
            //           color: Colors.black87,
            //         ),
            //       ),
            //       SizedBox(height: 8.h),
            //       ...List.generate(ticket.taskNames?.length ?? 0, (index) {
            //         return Padding(
            //           padding: EdgeInsets.symmetric(vertical: 4.h),
            //           child: Row(
            //             crossAxisAlignment: CrossAxisAlignment.start,
            //             children: [
            //               Text(
            //                 "${index + 1}.",
            //                 style: TextStyle(
            //                   fontSize: 14.sp,
            //                   fontWeight: FontWeight.w400,
            //                   color: Colors.black54,
            //                 ),
            //               ),
            //               SizedBox(width: 8.w),
            //               Expanded(
            //                 child: Text(
            //                   ticket.taskNames![index],
            //                   style: TextStyle(
            //                     fontSize: 14.sp,
            //                     color: Colors.black87,
            //                   ),
            //                   maxLines: 2,
            //                   overflow: TextOverflow.ellipsis,
            //                 ),
            //               ),
            //             ],
            //           ),
            //         );
            //       }),
            //     ],
            //   ),
            // ),
            SizedBox(height: 16.h),
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade300, width: 1),
              ),
              padding: EdgeInsets.all(12.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  (ticket.taskDescription != null &&
                          ticket.taskDescription!.length < 30)
                      ? RichText(
                          text: TextSpan(
                            text: "Ticket Description - ",
                            style: TextStyle(
                              fontSize: 14.sp,
                              fontWeight: FontWeight.w500,
                              color: Colors.black87,
                            ),
                            children: [
                              TextSpan(
                                text: ticket.taskDescription ??
                                    "No description provided.",
                                style: TextStyle(
                                  fontSize: 14.sp,
                                  color: Colors.black54,
                                  height: 1.5,
                                ),
                              ),
                            ],
                          ),
                        )
                      : ExpandableRichText(
                          descriptionText: "Ticket Description - ",
                          dynamicText: ticket.taskDescription ??
                              "No description provided.",
                          expandText: "Show more",
                          collapseText: "Show less",
                          maxLines: 3,
                          descriptionStyle: TextStyle(
                            fontSize: 14.sp,
                            fontWeight: FontWeight.w500,
                            color: Colors.black87,
                          ),
                          dynamicTextStyle: TextStyle(
                            fontSize: 14.sp,
                            color: Colors.black54,
                            height: 1.5,
                          ),
                          linkStyle: TextStyle(
                            fontSize: 14.sp,
                            color: Colors.blue,
                          ),
                        ),
                ],
              ),
            ),
            status == 'Rejected'
                ? Column(
                    children: [
                      SizedBox(height: 6.h),
                      Text(
                        "Rejected Reason - ${ticket.ticketResponse!.managerRemark} ",
                        style: const TextStyle(color: Colors.red),
                      ),
                    ],
                  )
                : SizedBox(
                    height: 0.h,
                    width: 0.w,
                  ),
            SizedBox(
              height: 10.h,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                (status != "Approval Pending" &&
                        status != "Completed" &&
                        status != "Rejected")
                    ? ElevatedButton.icon(
                        onPressed: () {
                          _checkPermissionAndNavigate(context, ticket);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue.shade700,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          padding:
                              EdgeInsets.zero, // Remove any default padding
                        ),
                        label: Padding(
                          padding: EdgeInsets.symmetric(
                              horizontal: 20.w,
                              vertical:
                                  4.h), // Control padding for the label here
                          child: Text(
                            "Initiate",
                            style: TextStyle(
                              fontSize: 14.sp,
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      )
                    : SizedBox(
                        height: 0.h,
                        width: 0.w,
                      ),
                (status != "Approval Pending" &&
                        status != "Completed" &&
                        status != "Rejected")
                    ? Text(
                        "Due Date: ${customDateFormatter(ticket.targetDate.toString())}",
                        style: TextStyle(
                          fontSize: 14.sp,
                          color: Colors.red,
                        ),
                      )
                    : GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => TicketSubmittedDataScreen(
                                  ticketId: ticket.ticketResponse!.id ?? ""),
                            ),
                          );
                        },
                        child: Chip(
                          label: Text(
                            "Submitted Data",
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.blueAccent[700],
                            ),
                          ),
                          backgroundColor: Colors.blueAccent.withOpacity(0.1),
                        ),
                      ),
              ],
            ),
          ],
        ),
      ),
    ),
  );
}

void _checkPermissionAndNavigate(
    BuildContext context, ticketsbystatumodel.Ticket ticket) async {
  final status = await Permission.camera.request();

  if (status.isDenied) {
    SnackBarUtils.toastMessage(
        "Camera permission is required to scan QR codes.");
    return;
  }

  if (status.isPermanentlyDenied) {
    showCameraDisabledDialog(context);
  }

  if (status.isGranted) {
    final now = DateTime.now();

    // Parse the serviceDate string
    final serviceDate = DateTime.parse(ticket.targetDate.toString());

    // Normalize dates to compare only the date part
    final today = DateTime(now.year, now.month, now.day);
    final serviceDateNormalized =
        DateTime(serviceDate.year, serviceDate.month, serviceDate.day);

    if (serviceDateNormalized.isBefore(today)) {
      if (kDebugMode) {
        debugPrint("Service date has passed.");
      }

      // SnackBarUtils.toastMessage("date has passed");

      Navigator.pushNamed(context, AppRoutes.ticketAssetVerifyScreen,
          arguments: {
            "plantId": ticket.plantId ?? "",
            "ticketId": ticket.id ?? "",
            "assetId": ticket.assetsId ?? "",
            "ticketsQuestionList": ticket.taskNames ?? [],
            "lat": ticket.assetDetails!.lat ?? "",
            "long": ticket.assetDetails!.long ?? "",
          });
      // canStart = true;
    } else if (serviceDateNormalized.isAtSameMomentAs(today)) {
      Navigator.pushNamed(context, AppRoutes.ticketAssetVerifyScreen,
          arguments: {
            "plantId": ticket.plantId ?? "",
            "ticketId": ticket.id ?? "",
            "assetId": ticket.assetsId ?? "",
            "ticketsQuestionList": ticket.taskNames ?? [],
            "lat": ticket.assetDetails!.lat ?? "",
            "long": ticket.assetDetails!.long ?? "",
          });
      // canStart = true;
      debugPrint("Service date is today.");
    } else {
      Navigator.pushNamed(context, AppRoutes.ticketAssetVerifyScreen,
          arguments: {
            "plantId": ticket.plantId ?? "",
            "ticketId": ticket.id ?? "",
            "assetId": ticket.assetsId ?? "",
            "ticketsQuestionList": ticket.taskNames ?? [],
            "lat": ticket.assetDetails!.lat ?? "",
            "long": ticket.assetDetails!.long ?? "",
          });
      // SnackBarUtils.toastMessage(
      //     "you have to wait for the ticket date to start");
      // canStart = false;
      debugPrint("Service date is yet to come.");
    }
  }
}

class ExpandableRichText extends StatefulWidget {
  final String descriptionText;
  final String dynamicText;
  final String expandText;
  final String collapseText;
  final int maxLines;
  final TextStyle descriptionStyle;
  final TextStyle dynamicTextStyle;
  final TextStyle linkStyle;

  const ExpandableRichText({
    required this.descriptionText,
    required this.dynamicText,
    required this.expandText,
    required this.collapseText,
    this.maxLines = 3,
    required this.descriptionStyle,
    required this.dynamicTextStyle,
    required this.linkStyle,
    super.key,
  });

  @override
  _ExpandableRichTextState createState() => _ExpandableRichTextState();
}

class _ExpandableRichTextState extends State<ExpandableRichText> {
  late bool isExpanded;

  @override
  void initState() {
    super.initState();
    isExpanded = false;
  }

  void toggleExpanded() {
    setState(() {
      isExpanded = !isExpanded;
    });
  }

  @override
  Widget build(BuildContext context) {
    final String fullText = widget.dynamicText;
    final String truncatedText = _truncateText(fullText);

    return RichText(
      text: TextSpan(
        style: widget.descriptionStyle,
        children: [
          TextSpan(
            text: "${widget.descriptionText} ",
          ),
          TextSpan(
            text: isExpanded ? fullText : truncatedText,
            style: widget.dynamicTextStyle,
          ),
          TextSpan(
            text: isExpanded
                ? " ${widget.collapseText}"
                : " ${widget.expandText}",
            style: widget.linkStyle,
            recognizer: TapGestureRecognizer()..onTap = toggleExpanded,
          ),
        ],
      ),
    );
  }

  String _truncateText(String text) {
    // Truncate text to fit within max lines, approximate logic.
    final words = text.split(' ');
    String truncated = '';
    for (var word in words) {
      if ((truncated + word).length > widget.maxLines * 20) break;
      truncated += '$word ';
    }
    return "${truncated.trimRight()}...";
  }
}

Widget _buildStatusChip({
  required IconData icon,
  required String label,
  required Color backgroundColor,
  required Color iconColor,
}) {
  return Container(
    decoration: BoxDecoration(
      color: backgroundColor,
      borderRadius: BorderRadius.circular(20),
    ),
    padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
    child: Row(
      children: [
        Icon(icon, size: 18.sp, color: iconColor),
        SizedBox(width: 8.w),
        Text(
          label,
          style: TextStyle(
            fontSize: 14.sp,
            color: Colors.black87,
            fontWeight: FontWeight.w500,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    ),
  );
}
