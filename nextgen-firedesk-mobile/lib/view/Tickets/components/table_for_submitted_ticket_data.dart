import 'package:firedesk/models/data_models/Ticket_Models/submitted_ticket_response.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/view_models/providers/service_detail_screen_provider.dart';
import 'package:firedesk/widgets/widget_utils.dart';
import 'package:flutter/material.dart';

import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';

class TableForSubmittedTicketData extends StatefulWidget {
  final String headingText1;
  final String headingText2;
  final int index;
  final String leadingText;
  final List<Question> descriptionList;
  final List<TextEditingController> editingControllers;
  const TableForSubmittedTicketData({
    super.key,
    required this.headingText1,
    required this.headingText2,
    required this.index,
    required this.leadingText,
    required this.descriptionList,
    required this.editingControllers,
  });

  @override
  State<TableForSubmittedTicketData> createState() => _TableForSubmittedTicketDataState();
}

class _TableForSubmittedTicketDataState extends State<TableForSubmittedTicketData> {
  List<String?> selectedSatisfactionValues = [];
  List<TextEditingController> controllers = [];

  @override
  void initState() {
    super.initState();
    selectedSatisfactionValues =
        List<String?>.filled(widget.descriptionList.length, null);
    controllers = List.generate(
        widget.descriptionList.length, (_) => TextEditingController());
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ServiceDetailScreenProvider>(
      builder: (context, serviceDetailScreenProvider, _) {
        return Container(
          padding: EdgeInsets.symmetric(horizontal: 4.w),
          margin: EdgeInsets.symmetric(horizontal: 0.w, vertical: 4.h),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 2,
              ),
            ],
          ),
          child: Theme(
            data: Theme.of(context).copyWith(
              dividerColor: Colors.transparent,
            ),
            child: ExpansionTile(
              title: Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: widget.headingText1,
                      style: const TextStyle(color: Colors.black),
                    ),
                    TextSpan(
                      text: widget.headingText2,
                      style: const TextStyle(color: Colors.red),
                    ),
                  ],
                ),
              ),
              leading: Text(
                widget.leadingText,
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
                      widget.descriptionList.length,
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
                                    widget.descriptionList[index]
                                        .question
                                        .toString(),
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
                                  SizedBox(height: 2.h),
                                  Container(
                                    width: double.infinity,
                                    padding: EdgeInsets.symmetric(
                                      horizontal: 10.w,
                                      vertical: 12.h,
                                    ),
                                    decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(8)),
                                    child: Text(
                                        "${widget.descriptionList[index].answer}"),
                                  ),
                                  SizedBox(
                                    height: 5.h,
                                  ),
                                  Text(
                                    "Note",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 16.sp,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                  SizedBox(
                                    height: 2.h,
                                  ),
                                  Container(
                                    width: double.infinity,
                                    padding: EdgeInsets.symmetric(
                                      horizontal: 10.w,
                                      vertical: 12.h,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                        "${widget.descriptionList[index].note}"),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget getTextField(int index) {
    return getDefaultTextFiledWithLabelAndBorder(
      verticalPadding: 12,
      onChanged: (value) {
        final provider =
            Provider.of<ServiceDetailScreenProvider>(context, listen: false);
        provider.updateQuestionNote(
          widget.index,
          widget.descriptionList[index].id.toString(),
          value,
        );
      },
      context,
      "Enter Note",
      controllers[index],
    );
  }
}
