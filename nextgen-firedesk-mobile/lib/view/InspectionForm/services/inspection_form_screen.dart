import 'dart:io';

import 'package:animated_custom_dropdown/custom_dropdown.dart';
import 'package:firedesk/data/app_exceptions.dart';
import 'package:firedesk/data/reponse/status.dart';
import "package:firedesk/models/data_models/Service_Models/service_form_model.dart"
    as questionmodel;
import 'package:firedesk/models/data_models/Service_Models/service_form_model.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/components/general_exception_widget.dart';
import 'package:firedesk/res/components/internet_exception.dart';
import 'package:firedesk/res/components/request_timeout.dart';
import 'package:firedesk/res/components/server_exception_widget.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/utils/snack_bar_utils.dart';
import 'package:firedesk/view/InspectionForm/services/table_for_inspection_form.dart';
import 'package:firedesk/view_models/providers/service_detail_screen_provider.dart';
import 'package:firedesk/widgets/widget_utils.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:provider/provider.dart';

class InspectionFormScreen extends StatefulWidget {
  final String serviceFormId;
  final bool cameFromRejectedService;
  final String geoCheck;
  final bool cameFromAssetDetails;
  const InspectionFormScreen({
    super.key,
    required this.serviceFormId,
    required this.cameFromRejectedService,
    required this.geoCheck,
    required this.cameFromAssetDetails,
  });
  @override
  State<InspectionFormScreen> createState() => _InspectionFormScreenState();
}

class _InspectionFormScreenState extends State<InspectionFormScreen>
    with SingleTickerProviderStateMixin {
  TextEditingController suctionPressureController = TextEditingController();
  TextEditingController batteryStatusReadingController =
      TextEditingController();
  TextEditingController dischargeressureController = TextEditingController();
  File? image1;
  File? image2;
  File? image3;
  XFile? imagePath1;
  XFile? imagePath2;
  XFile? imagePath3;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (timeStamp) {
        final provider =
            Provider.of<ServiceDetailScreenProvider>(context, listen: false);
        provider.getServiceForm(
          context,
          widget.serviceFormId,
        );
        provider.makeFieldsNull();
        provider.setStatusUpdateLoading = false;
      },
    );
    if (kDebugMode) {
      debugPrint(
          "came to inspection form screen service form id is ${widget.serviceFormId} and came from rejected service is ${widget.cameFromRejectedService} and came from asset details screen value is ${widget.cameFromAssetDetails}");
    }
  }

  final List<String> _list = [
    'ELECTRICAL DRIVEN',
    'DIESEL ENGINE',
    'JOCKEY',
    'BOOSTER',
    'OTHER'
  ];

  final List<String> _list2 = [
    'CUTOFF',
    'START',
  ];

  @override
  Widget build(BuildContext context) {
    return Consumer<ServiceDetailScreenProvider>(
      builder: (context, provider, _) {
        return ModalProgressHUD(
          inAsyncCall: provider.statusUpdateLoading,
          progressIndicator: CircularProgressIndicator(
            color: basicColor,
          ),
          child: WillPopScope(
            onWillPop: () async {
              widget.cameFromAssetDetails
                  ? Navigator.popUntil(
                      context,
                      ModalRoute.withName(AppRoutes.assetdetail),
                    )
                  : Navigator.popUntil(
                      context,
                      ModalRoute.withName(AppRoutes.servicedetails),
                    );
              return false;
            },
            child: Scaffold(
              backgroundColor: Colors.white,
              appBar: AppBar(
                backgroundColor: basicColor,
                title: Text(
                  "Inspection  Form",
                  style: appBarTextSTyle,
                ),
                centerTitle: true,
                leading: IconButton(
                  onPressed: () {
                    widget.cameFromAssetDetails
                        ? Navigator.popUntil(
                            context,
                            ModalRoute.withName(AppRoutes.assetdetail),
                          )
                        : Navigator.popUntil(
                            context,
                            ModalRoute.withName(AppRoutes.servicedetails),
                          );

                    // Navigator.pop(context);
                  },
                  icon: const Icon(Icons.arrow_back),
                  color: Colors.white,
                ),
              ),
              body: Column(
                children: [
                  Expanded(
                    child: inspectionTableView(context),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget inspectionTableView(BuildContext context) {
    return Consumer<ServiceDetailScreenProvider>(
      builder: (context, serviceDetailScreenProvider, _) {
        switch (serviceDetailScreenProvider.serviceFormStatus) {
          case Status.LOADING:
            return const Center(
              child: CircularProgressIndicator(
                color: Colors.blue,
              ),
            );
          case Status.ERROR:
            if (kDebugMode) {
              debugPrint(
                  "error is ${serviceDetailScreenProvider.serviceFormError}");
            }
            if (serviceDetailScreenProvider.serviceFormError ==
                InternetException) {
              return InterNetExceptionWidget(
                onPress: () {
                  serviceDetailScreenProvider.getServiceForm(
                    context,
                    widget.serviceFormId,
                    // widget.productId,
                    // widget.serviceType,
                    // widget.organizationUserId,
                    // widget.categoryId,
                    // widget.serviceTicketId,
                  );
                },
              );
            } else if (serviceDetailScreenProvider.serviceFormError ==
                RequestTimeOut) {
              return RequestTimeOutWidget(
                onPress: () {
                  serviceDetailScreenProvider.getServiceForm(
                    context,
                    widget.serviceFormId,
                    // widget.productId,
                    // widget.serviceType,
                    // widget.organizationUserId,
                    // widget.categoryId,
                    // widget.serviceTicketId,
                  );
                },
              );
            } else if (serviceDetailScreenProvider.serviceFormError ==
                ServerException) {
              return ServerExceptionWidget(
                onPress: () {
                  serviceDetailScreenProvider.getServiceForm(
                    context,
                    widget.serviceFormId,
                    // widget.productId,
                    // widget.serviceType,
                    // widget.organizationUserId,
                    // widget.categoryId,
                    // widget.serviceTicketId,
                  );
                },
              );
            } else {
              return GeneralExceptionWidget(
                onPress: () {
                  serviceDetailScreenProvider.getServiceForm(
                    context,
                    widget.serviceFormId,
                    // widget.productId,
                    // widget.serviceType,
                    // widget.organizationUserId,
                    // widget.categoryId,
                    // widget.serviceTicketId,
                  );
                },
                error: serviceDetailScreenProvider.serviceFormErrorString,
              );
            }
          case Status.COMPLETED:
            return SingleChildScrollView(
                child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 10.w),
              child: Column(
                children: [
                  SizedBox(
                    height: 10.h,
                  ),
                  serviceDetailScreenProvider.serviceForm!.formName ==
                          "PUMP ROOM SERVICE"
                      ? Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFE1E9FF),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Padding(
                            padding: EdgeInsets.symmetric(
                              horizontal: 10.w,
                            ),
                            child: Column(
                              children: [
                                SizedBox(
                                  height: 20.h,
                                ),
                                SizedBox(
                                  child: CustomDropdown<String>(
                                    closedHeaderPadding: EdgeInsets.symmetric(
                                        vertical: 12.h, horizontal: 10.w),
                                    expandedHeaderPadding: EdgeInsets.symmetric(
                                        vertical: 12.h, horizontal: 10.w),
                                    hintText: 'Pump Type *',
                                    items: _list,
                                    onChanged: (value) {
                                      serviceDetailScreenProvider.pumpType =
                                          value;
                                    },
                                  ),
                                ),
                                SizedBox(height: 10.h),
                                SizedBox(
                                  // height: 54.h,
                                  child: CustomDropdown<String>(
                                    closedHeaderPadding: EdgeInsets.symmetric(
                                        vertical: 10.h, horizontal: 10.w),
                                    expandedHeaderPadding: EdgeInsets.symmetric(
                                        vertical: 10.h, horizontal: 10.w),
                                    hintText:
                                        'Pump Sequential Operation Test *',
                                    items: _list2,
                                    onChanged: (value) {
                                      serviceDetailScreenProvider
                                          .pumpSequentialOperationTest = value;
                                    },
                                  ),
                                ),
                                SizedBox(
                                  height: 10.h,
                                ),
                                (serviceDetailScreenProvider.pumpType ==
                                        'DIESEL ENGINE')
                                    ? SizedBox(
                                        child:
                                            getDefaultTextFiledWithLabelAndBorder(
                                          context,
                                          verticalPadding: 12.h,
                                          "Battery Status Reading *",
                                          batteryStatusReadingController,
                                          keyboardType: const TextInputType
                                              .numberWithOptions(
                                            decimal: true,
                                          ),
                                          inputFormatters: [
                                            FilteringTextInputFormatter.allow(
                                              RegExp(r'[0-9.]'),
                                            ),
                                          ],
                                        ),
                                      )
                                    : const SizedBox(
                                        height: 0,
                                        width: 0,
                                      ),
                                SizedBox(
                                  height:
                                      (serviceDetailScreenProvider.pumpType ==
                                              'DIESEL ENGINE')
                                          ? 10.h
                                          : 0.h,
                                ),
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    SizedBox(
                                      width: 180.w,
                                      child:
                                          getDefaultTextFiledWithLabelAndBorder(
                                        context,
                                        verticalPadding: 12.h,
                                        "Suction Pressure *",
                                        suctionPressureController,
                                        keyboardType: const TextInputType
                                            .numberWithOptions(decimal: true),
                                        inputFormatters: [
                                          FilteringTextInputFormatter.allow(
                                            RegExp(r'[0-9.]'),
                                          ),
                                        ],
                                      ),
                                    ),
                                    SizedBox(
                                      width: 180.w,
                                      child:
                                          getDefaultTextFiledWithLabelAndBorder(
                                        context,
                                        verticalPadding: 12.h,
                                        "Discharge Pressure *",
                                        dischargeressureController,
                                        keyboardType: const TextInputType
                                            .numberWithOptions(decimal: true),
                                        inputFormatters: [
                                          FilteringTextInputFormatter.allow(
                                            RegExp(r'[0-9.]'),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(
                                  height: 15.h,
                                ),
                              ],
                            ),
                          ),
                        )
                      : SizedBox(
                          height: 0.h,
                          width: 0.w,
                        ),
                  SizedBox(
                    height: 10.h,
                  ),
                  serviceDetailScreenProvider.serviceForm!.formName ==
                          "PUMP ROOM SERVICE"
                      ? Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFE1E9FF),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Padding(
                            padding: EdgeInsets.symmetric(horizontal: 10.w),
                            child: Column(
                              children: [
                                SizedBox(
                                  height: 8.h,
                                ),
                                const Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    "Pump Status *",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontWeight: FontWeight.w500,
                                      fontSize: 14,
                                    ),
                                    textAlign: TextAlign.left,
                                  ),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    _buildRadioOption(
                                      'AUTO',
                                      serviceDetailScreenProvider.pumpStatus,
                                      (newValue) {
                                        serviceDetailScreenProvider.pumpStatus =
                                            newValue;
                                      },
                                    ),
                                    SizedBox(
                                      width: 6.w,
                                    ),
                                    _buildRadioOption(
                                      'MANUAL',
                                      serviceDetailScreenProvider.pumpStatus,
                                      (newValue) {
                                        serviceDetailScreenProvider.pumpStatus =
                                            newValue;
                                      },
                                    ),
                                    SizedBox(
                                      width: 3.w,
                                    ),
                                    _buildRadioOption(
                                      'OFF CONDITION',
                                      serviceDetailScreenProvider.pumpStatus,
                                      (newValue) {
                                        serviceDetailScreenProvider.pumpStatus =
                                            newValue;
                                      },
                                    ),
                                  ],
                                ),
                                (serviceDetailScreenProvider.pumpType ==
                                        'DIESEL ENGINE')
                                    ? const Align(
                                        alignment: Alignment.centerLeft,
                                        child: Text(
                                          "Diesel Level *",
                                          style: TextStyle(
                                            color: Colors.black,
                                            fontWeight: FontWeight.w500,
                                            fontSize: 14,
                                          ),
                                          textAlign: TextAlign.left,
                                        ),
                                      )
                                    : SizedBox(
                                        height: 0.h,
                                        width: 0.w,
                                      ),
                                (serviceDetailScreenProvider.pumpType ==
                                        'DIESEL ENGINE')
                                    ? Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        children: [
                                          _buildRadioOption(
                                            'FULL',
                                            serviceDetailScreenProvider
                                                .dieselLevel,
                                            (newValue) {
                                              serviceDetailScreenProvider
                                                  .dieselLevel = newValue;
                                            },
                                          ),
                                          SizedBox(
                                            width: 10.w,
                                          ),
                                          _buildRadioOption(
                                            'HALF',
                                            serviceDetailScreenProvider
                                                .dieselLevel,
                                            (newValue) {
                                              serviceDetailScreenProvider
                                                  .dieselLevel = newValue;
                                            },
                                          ),
                                          SizedBox(
                                            width: 10.w,
                                          ),
                                          _buildRadioOption(
                                            'NEED RE-FUEL',
                                            serviceDetailScreenProvider
                                                .dieselLevel,
                                            (newValue) {
                                              serviceDetailScreenProvider
                                                  .dieselLevel = newValue;
                                            },
                                          ),
                                        ],
                                      )
                                    : SizedBox(
                                        height: 0.h,
                                        width: 0.w,
                                      ),
                                const Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    "Water storage Level *",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontWeight: FontWeight.w500,
                                      fontSize: 14,
                                    ),
                                    textAlign: TextAlign.left,
                                  ),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    _buildRadioOption(
                                      'FULL',
                                      serviceDetailScreenProvider
                                          .waterStorageLevel,
                                      (newValue) {
                                        serviceDetailScreenProvider
                                            .waterStorageLevel = newValue;
                                      },
                                    ),
                                    SizedBox(
                                      width: 10.w,
                                    ),
                                    _buildRadioOption(
                                      'HALF',
                                      serviceDetailScreenProvider
                                          .waterStorageLevel,
                                      (newValue) {
                                        serviceDetailScreenProvider
                                            .waterStorageLevel = newValue;
                                      },
                                    ),
                                    SizedBox(
                                      width: 10.w,
                                    ),
                                    _buildRadioOption(
                                      'NEED RE-FUEL',
                                      serviceDetailScreenProvider
                                          .waterStorageLevel,
                                      (newValue) {
                                        serviceDetailScreenProvider
                                            .waterStorageLevel = newValue;
                                      },
                                    ),
                                  ],
                                ),
                                const Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    "Pressure Switch Condition *",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontWeight: FontWeight.w500,
                                      fontSize: 14,
                                    ),
                                    textAlign: TextAlign.left,
                                  ),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    _buildRadioOption(
                                      'OPEN',
                                      serviceDetailScreenProvider
                                          .pressureSwitchCondition,
                                      (newValue) {
                                        serviceDetailScreenProvider
                                            .pressureSwitchCondition = newValue;
                                      },
                                    ),
                                    SizedBox(
                                      width: 7.w,
                                    ),
                                    _buildRadioOption(
                                      'CLOSE',
                                      serviceDetailScreenProvider
                                          .pressureSwitchCondition,
                                      (newValue) {
                                        serviceDetailScreenProvider
                                            .pressureSwitchCondition = newValue;
                                      },
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        )
                      : SizedBox(
                          height: 0.h,
                          width: 0.w,
                        ),
                  SizedBox(
                    height: 10.h,
                  ),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: 1,
                    itemBuilder: (context, index) {
                      questionmodel.Form item =
                          serviceDetailScreenProvider.questionsData!;
                      List<Question> descriptionList = item.questions ?? [];
                      String heading = item.name ?? "";
                      List<TextEditingController> editingControllers =
                          List.generate(item.questions!.length,
                              (_) => TextEditingController());

                      return TableForInspectionForm(
                        headingText1: "",
                        headingText2: heading,
                        index: index,
                        leadingText: "A.${index + 1}",
                        descriptionList: descriptionList,
                        editingControllers: editingControllers,
                      );
                    },
                  ),
                  SizedBox(
                    height: 20.h,
                  ),
                  GestureDetector(
                    onTap: () async {
                      bool allQuestionsAnswered = true;
                      if (serviceDetailScreenProvider.serviceForm!.formName ==
                          "PUMP ROOM SERVICE") {
                        if (serviceDetailScreenProvider.pumpType != null &&
                            serviceDetailScreenProvider
                                    .pumpSequentialOperationTest !=
                                null &&
                            suctionPressureController.text.isNotEmpty &&
                            dischargeressureController.text.isNotEmpty &&
                            serviceDetailScreenProvider.pumpStatus != null &&
                            serviceDetailScreenProvider.waterStorageLevel !=
                                null &&
                            serviceDetailScreenProvider
                                    .pressureSwitchCondition !=
                                null) {
                          //  if (imagePath1 != null &&
                          //     imagePath2 != null &&
                          //     imagePath3 != null) {
                          if (kDebugMode) {
                            debugPrint("came for section data verifications");
                          }
                          // for (var section in serviceDetailScreenProvider
                          //     .sectionsForServiceFormSubmnit) {
                          for (var question in serviceDetailScreenProvider
                              .sectionDatatoSubmitForm) {
                            // Check if any question's answer is empty or null
                            if (question!.answer == null ||
                                question.answer!.isEmpty) {
                              allQuestionsAnswered = false;
                              if (kDebugMode) {
                                debugPrint(
                                    "allquestions answered is false makinng value $allQuestionsAnswered");
                              }
                              break;
                            }
                            // }
                            if (!allQuestionsAnswered) break;
                          }
                          if (allQuestionsAnswered) {
                            if (kDebugMode) {
                              debugPrint(
                                  "All questions are answered. Proceed with API call.");
                            }
                            var response = await serviceDetailScreenProvider
                                .submitServiceFrom(
                              // widget.plantId,
                              // widget.assetId,
                              widget.serviceFormId,
                              serviceDetailScreenProvider.serviceForm!.formId ??
                                  "",
                              batteryStatusReadingController.text,
                              suctionPressureController.text,
                              dischargeressureController.text,
                              // widget.service,
                              widget.cameFromRejectedService,
                              serviceDetailScreenProvider
                                      .serviceForm!.formName ??
                                  "",
                              widget.geoCheck,
                            );

                            if (response[0] == 200) {
                              Navigator.pushNamed(
                                  context, AppRoutes.serviceFormImageUpdate,
                                  arguments: {"imageUpdateId": response[1]});
                            }
                          } else {
                            SnackBarUtils.toastMessage(
                                "Please fill all the  satisfactory fields before submitting.");
                          }
                        } else {
                          SnackBarUtils.toastMessage(
                              "Please fill required fields related to service");
                        }
                      } else {
                        for (var question in serviceDetailScreenProvider
                            .sectionDatatoSubmitForm) {
                          // Check if any question's answer is empty or null
                          print(
                              "answer for question ${question!.question} is ${question.answer}");
                          if (question.answer == null ||
                              question.answer!.isEmpty) {
                            allQuestionsAnswered = false;
                            if (kDebugMode) {
                              debugPrint(
                                  "allquestions answered is false makinng value $allQuestionsAnswered");
                            }
                            break;
                          }
                          // }
                          if (!allQuestionsAnswered) break;
                        }
                        if (allQuestionsAnswered) {
                          if (kDebugMode) {
                            debugPrint(
                                "All questions are answered. Proceed with API call. and serviceFormid is ${serviceDetailScreenProvider.serviceForm!.formId} and serviceTicketId is ${widget.serviceFormId}");
                          }
                          var response = await serviceDetailScreenProvider
                              .submitServiceFrom(
                            serviceDetailScreenProvider.serviceForm!.formId ??
                                "",
                            widget.serviceFormId,
                            batteryStatusReadingController.text,
                            suctionPressureController.text,
                            dischargeressureController.text,
                            widget.cameFromRejectedService,
                            serviceDetailScreenProvider.serviceForm!.formName ??
                                "",
                            widget.geoCheck,
                          );

                          if (response[0] == 200) {
                            Navigator.pushNamed(
                                context, AppRoutes.serviceFormImageUpdate,
                                arguments: {"imageUpdateId": response[1]});
                          }
                        } else {
                          SnackBarUtils.toastMessage(
                              "Please fill all the  satisfactory fields before submitting.");
                        }
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
                          "Submit Service",
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
            ));
          default:
            return const Center(
              child: CircularProgressIndicator(
                color: Colors.blue,
              ),
            );
        }
      },
    );
  }

  Widget _buildRadioOption(
    String value,
    String? status,
    ValueChanged<String> onChanged,
  ) {
    return Row(
      children: [
        Radio<String>(
          value: value,
          activeColor: basicColor,
          groupValue: status,
          onChanged: (String? newValue) {
            if (newValue != null) {
              onChanged(newValue);
            }
          },
        ),
        Text(
          value,
          overflow: TextOverflow.ellipsis,
          maxLines: 1,
          style: const TextStyle(
            color: Colors.black,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}
