import 'dart:io';

import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/utils/snack_bar_utils.dart';
import 'package:firedesk/view/InspectionForm/models/ticket_answer_model.dart';
import 'package:firedesk/view/InspectionForm/tickets/table_for_ticket_inspection_form.dart';
import 'package:firedesk/view_models/providers/tickets_list_provider.dart';
import 'package:firedesk/widgets/widget_utils.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:provider/provider.dart';

class TicketInspectionFormScreen extends StatefulWidget {
  final List<String> ticketsQuestionsList;
  final String ticketId;
  final String plantId;
  final String assetId;
  final String geoCheck;
  const TicketInspectionFormScreen({
    super.key,
    required this.ticketsQuestionsList,
    required this.ticketId,
    required this.plantId,
    required this.assetId,
    required this.geoCheck,
  });
  @override
  State<TicketInspectionFormScreen> createState() =>
      _TicketInspectionFormScreenState();
}

class _TicketInspectionFormScreenState
    extends State<TicketInspectionFormScreen> {
  XFile? imagePath1;
  XFile? imagePath2;
  XFile? imagePath3;
  TextEditingController remarksController = TextEditingController();

  Future<XFile?> pickImage(ImageSource source) async {
    final ImagePicker picker = ImagePicker();
    return await picker.pickImage(source: source);
  }

  @override
  Widget build(BuildContext context) {
    // List<bool> yesList = List.generate(10, (_) => false);
    // List<bool> noList = List.generate(10, (_) => false);
    // List<bool> naList = List.generate(19, (_) => false);
    // List<TextEditingController> editingControllers =
    //     List.generate(10, (_) => TextEditingController());
    // List<String> descriptionList = List.generate(10, (_) => "QUestion ");

    return Consumer<TicketListsProvider>(
        builder: (context, ticketsListProvider, _) {
      return ModalProgressHUD(
        inAsyncCall: ticketsListProvider.ticketSubmitLoading,
        progressIndicator: const CircularProgressIndicator(
          color: Colors.blue,
        ),
        child: WillPopScope(
          onWillPop: () async {
            Navigator.popUntil(
              context,
              ModalRoute.withName(AppRoutes.alltickets),
            );
            return true;
          },
          child: Scaffold(
            backgroundColor: Colors.white,
            appBar: AppBar(
              backgroundColor: basicColor,
              title: Text(
                "Ticket Inspection Form",
                style: appBarTextSTyle,
              ),
              leading: IconButton(
                onPressed: () {
                  Navigator.popUntil(
                      context, ModalRoute.withName(AppRoutes.alltickets));
                },
                icon: const Icon(Icons.arrow_back),
                color: Colors.white,
              ),
            ),
            body: SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 20.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      height: 10.h,
                    ),
                    TableForTicketInspectionForm(
                        questionsList: widget.ticketsQuestionsList),
                    SizedBox(
                      height: 10.h,
                    ),
                    Text(
                      "Image 1",
                      style: normalTextSTyle1,
                      textAlign: TextAlign.left,
                    ),
                    SizedBox(
                      height: 10.h,
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10.0),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 3,
                          ),
                        ],
                      ),
                      child: GestureDetector(
                        onTap: () async {
                          imagePath1 = await pickImage(ImageSource.camera);
                          setState(() {});
                        },
                        child: Container(
                          width: double.infinity,
                          height: 240.h,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8.0),
                            border: imagePath1 == null
                                ? Border.all(color: basicColor)
                                : null,
                            image: imagePath1 != null
                                ? DecorationImage(
                                    image: FileImage(File(imagePath1!.path)),
                                    fit: BoxFit.cover,
                                  )
                                : null,
                          ),
                          child: imagePath1 == null
                              ? Icon(
                                  Icons.add_a_photo,
                                  color: basicColor.withOpacity(0.8),
                                  size: 40,
                                )
                              : null,
                        ),
                      ),
                    ),
                    SizedBox(height: 20.h),
                    Text(
                      "Image 2 & 3",
                      style: normalTextSTyle1,
                      textAlign: TextAlign.left,
                    ),
                    SizedBox(
                      height: 10.h,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10.0),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 3,
                                ),
                              ],
                            ),
                            child: GestureDetector(
                              onTap: () async {
                                imagePath2 =
                                    await pickImage(ImageSource.camera);
                                setState(() {});
                              },
                              child: Container(
                                width: double.infinity,
                                height: 130.h,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8.0),
                                  border: imagePath2 == null
                                      ? Border.all(color: basicColor)
                                      : null,
                                  image: imagePath2 != null
                                      ? DecorationImage(
                                          image:
                                              FileImage(File(imagePath2!.path)),
                                          fit: BoxFit.cover,
                                        )
                                      : null,
                                ),
                                child: imagePath2 == null
                                    ? Icon(
                                        Icons.add_a_photo,
                                        color: basicColor.withOpacity(0.8),
                                        size: 40,
                                      )
                                    : null,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10.0),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 3,
                                ),
                              ],
                            ),
                            child: GestureDetector(
                              onTap: () async {
                                imagePath3 =
                                    await pickImage(ImageSource.camera);
                                setState(() {});
                              },
                              child: Container(
                                width: double.infinity,
                                height: 130.h,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8.0),
                                  border: imagePath3 == null
                                      ? Border.all(color: basicColor)
                                      : null,
                                  image: imagePath3 != null
                                      ? DecorationImage(
                                          image:
                                              FileImage(File(imagePath3!.path)),
                                          fit: BoxFit.cover,
                                        )
                                      : null,
                                ),
                                child: imagePath3 == null
                                    ? Icon(
                                        Icons.add_a_photo,
                                        color: basicColor.withOpacity(0.8),
                                        size: 40,
                                      )
                                    : null,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(
                      height: 20.h,
                    ),
                    getDefaultTextFiledWithLabelAndBorder(
                      context,
                      "Add The Remarks",
                      remarksController,
                      minLines: 4,
                    ),
                    SizedBox(
                      height: 20.h,
                    ),
                    GestureDetector(
                      onTap: () async {
                        if (kDebugMode) {
                          debugPrint(
                              "ticketId is ${widget.ticketId} and plantId is ${widget.plantId} and assetId is ${widget.assetId} and remarks is ${remarksController.text}");
                        }

                        // Get the provider instance
                        final provider = Provider.of<TicketListsProvider>(
                            context,
                            listen: false);

                        // Retrieve the ticket question answers from the provider
                        List<TicketQUestionAnswer> ticketQuestionAnswers =
                            provider.ticketQuestionAnswers;

                        // Check if all answers are not null
                        bool allAnswered = ticketQuestionAnswers
                            .every((question) => question.answer != null);

                        if (!allAnswered) {
                          // Call your custom snackbar to notify the user
                          SnackBarUtils.toastMessage(
                              "Please answer all satisfaction questions before submitting.");
                          return; // Exit early
                        }

                        // Proceed with ticket submission if all values are filled
                        await provider.submitTicket(
                          context,
                          widget.ticketId,
                          widget.plantId,
                          widget.assetId,
                          remarksController.text,
                          image1: imagePath1,
                          image2: imagePath2,
                          image3: imagePath3,
                          geoCheck: widget.geoCheck,
                        );
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
                            "Submit Ticket",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18.sp,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(
                      height: 20.h,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      );
    });
  }
}
