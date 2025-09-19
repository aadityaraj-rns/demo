import 'package:animated_custom_dropdown/custom_dropdown.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/view/InspectionForm/models/ticket_answer_model.dart';
import 'package:firedesk/view_models/providers/service_detail_screen_provider.dart';
import 'package:firedesk/view_models/providers/tickets_list_provider.dart';
import 'package:firedesk/widgets/widget_utils.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';

class TableForTicketInspectionForm extends StatefulWidget {
  final List<String> questionsList;
  const TableForTicketInspectionForm({
    super.key,
    required this.questionsList,
  });

  @override
  State<TableForTicketInspectionForm> createState() =>
      _TableForTicketInspectionFormState();
}

class _TableForTicketInspectionFormState
    extends State<TableForTicketInspectionForm> {
  List<String?> selectedSatisfactionValues = [];
  List<TextEditingController> controllers = [];

  final List<String> _list = [
    "Satisfactory",
    "Unsatisfactory",
    "N/A",
  ];

  @override
  void initState() {
    super.initState();

    // After the first frame is rendered
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      final provider = Provider.of<TicketListsProvider>(context, listen: false);

      // Initialize the list of questions with empty note and null answer
      List<TicketQUestionAnswer> initialAnswers = widget.questionsList
          .map((question) =>
              TicketQUestionAnswer(question: question, note: '', answer: null))
          .toList();

      // Update the provider with the initialized list
      provider.ticketQuestionAnswers = initialAnswers;
      if (kDebugMode) {
        debugPrint(
            "now added questions for the model list now the list is ${provider.ticketQuestionAnswers.length}");
      }
    });

    // Initializing other controllers and satisfaction values
    selectedSatisfactionValues =
        List<String?>.filled(widget.questionsList.length, null);
    controllers = List.generate(
        widget.questionsList.length, (_) => TextEditingController());
  }

  @override
  void dispose() {
    super.dispose();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      final provider = Provider.of<TicketListsProvider>(context, listen: false);
      provider.ticketQuestionAnswers.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ServiceDetailScreenProvider>(
      builder: (context, serviceDetailScreenProvider, _) {
        return Container(
          margin: EdgeInsets.symmetric(horizontal: 0.w, vertical: 4.h),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 5,
              ),
            ],
          ),
          child: Theme(
            data: Theme.of(context).copyWith(
              dividerColor: Colors.transparent,
            ),
            child: ExpansionTile(
              title: const Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: "Questions to be answered in  the ",
                      style: TextStyle(color: Colors.black),
                    ),
                    TextSpan(
                      text: "Ticket Submission",
                      style: TextStyle(color: Colors.red),
                    ),
                  ],
                ),
              ),
              leading: Text(
                "A.1",
                style: TextStyle(color: basicColor, fontSize: 24.sp),
              ),
              children: [
                Table(
                  defaultVerticalAlignment: TableCellVerticalAlignment.middle,
                  border: TableBorder.all(color: Colors.white, width: 0.6),
                  columnWidths: {
                    0: FixedColumnWidth(40.w),
                    1: FixedColumnWidth(350.w),
                  },
                  children: [
                    ...List.generate(
                      widget.questionsList.length,
                      (index) => TableRow(
                        decoration: BoxDecoration(
                          color: basicColor.withOpacity(0.07),
                        ),
                        children: [
                          TableCell(
                            verticalAlignment: TableCellVerticalAlignment.top,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                "${index + 1})",
                              ),
                            ),
                          ),
                          TableCell(
                            verticalAlignment:
                                TableCellVerticalAlignment.middle,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    widget.questionsList[index].toString(),
                                    textAlign: TextAlign.left,
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 16.sp,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                  Gap(5.h),
                                  Text(
                                    "Satisfaction *",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 16.sp,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                  Padding(
                                    padding:
                                        EdgeInsets.symmetric(horizontal: 15.w),
                                    child: CustomDropdown<String>(
                                      hintText: 'Pump Type *',
                                      items: _list,
                                      closedHeaderPadding: EdgeInsets.symmetric(
                                          vertical: 10.h, horizontal: 10.w),
                                      onChanged: (value) {
                                        if (value == null) return;
                                        setState(() {
                                          selectedSatisfactionValues[index] =
                                              value;
                                        });

                                        final provider =
                                            Provider.of<TicketListsProvider>(
                                                context,
                                                listen: false);
                                        provider.updateTicketQUestionAnswer(
                                            index, value);
                                      },
                                    ),
                                  ),
                                  Text(
                                    "Note",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 16.sp,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                  getTextField(index),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
                SizedBox(height: 10.h),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget getTextField(int index) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 15.w),
      child: getDefaultTextFiledWithLabelAndBorder(
        verticalPadding: 12,
        onChanged: (value) {
          final provider =
              Provider.of<TicketListsProvider>(context, listen: false);
          provider.updateNoteForTicketQuestionAnswer(
            index,
            value,
          );
        },
        context,
        "Enter Note",
        controllers[index],
      ),
    );
  }
}
