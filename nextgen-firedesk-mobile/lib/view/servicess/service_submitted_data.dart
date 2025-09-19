import 'package:carousel_slider/carousel_slider.dart';
import 'package:firedesk/models/data_models/Service_Models/submitted_service_info.dart'
    as submitted_service_info;
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/view/servicess/components/table_for_submitted_data.dart';
import 'package:firedesk/view_models/providers/submitted_service_data_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';

class ServiceSubmittedData extends StatefulWidget {
  final String serviceId;
  const ServiceSubmittedData({super.key, required this.serviceId});

  @override
  State<ServiceSubmittedData> createState() => _ServiceSubmittedDataState();
}

class _ServiceSubmittedDataState extends State<ServiceSubmittedData> {
  @override
  void initState() {
    super.initState();

    print("service id i got is ${widget.serviceId}");
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) async {
      final provider =
          Provider.of<SubmittedServiceDataProvider>(context, listen: false);
      await provider.fetchServiceInfo(context, widget.serviceId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<SubmittedServiceDataProvider>(
        builder: (context, submittedServiceProvider, _) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: basicColor,
          title: Text(
            "Submitted Data",
            style: appBarTextSTyle,
          ),
          centerTitle: true,
          leading: IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: const Icon(Icons.arrow_back),
            color: Colors.white,
          ),
        ),
        body: submittedServiceProvider.isLoading
            ? const Center(
                child: CircularProgressIndicator(
                  color: Colors.blue,
                ),
              )
            : Column(
                children: [
                  Expanded(
                    child: inspectionTableView(context),
                  ),
                ],
              ),
      );
    });
  }

  Widget inspectionTableView(BuildContext context) {
    return Consumer<SubmittedServiceDataProvider>(
      builder: (context, serviceDetailScreenProvider, _) {
        return SingleChildScrollView(
            child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 10.w),
          child: Column(
            children: [
              // SizedBox(
              //   height: 10.h,
              // ),
              // serviceDetailScreenProvider.submittedServiceInfo!.serviceName ==
              //         "PUMP ROOM SERVICE"
              //     ? Container(
              //         decoration: BoxDecoration(
              //           color: const Color(0xFFE1E9FF),
              //           borderRadius: BorderRadius.circular(10),
              //         ),
              //         child: Padding(
              //           padding: EdgeInsets.symmetric(
              //             horizontal: 10.w,
              //           ),
              //           child: Column(
              //             children: [
              //               SizedBox(
              //                 height: 20.h,
              //               ),
              //               Container(
              //                 width: double.infinity,
              //                 padding: EdgeInsets.symmetric(
              //                   horizontal: 10.w,
              //                   vertical: 12.h,
              //                 ),
              //                 decoration: BoxDecoration(
              //                   color: Colors.white,
              //                   borderRadius: BorderRadius.circular(8),
              //                 ),
              //                 child: Text(
              //                     "${serviceDetailScreenProvider.pumpType}"),
              //               ),
              //               // SizedBox(
              //               //   height: 54.h,
              //               //   child: CustomDropdown(
              //               //     hintText: serviceDetailScreenProvider.pumpType,
              //               //     items: const [],
              //               //   ),
              //               // ),
              //               SizedBox(height: 10.h),
              //               Container(
              //                 width: double.infinity,
              //                 padding: EdgeInsets.symmetric(
              //                   horizontal: 10.w,
              //                   vertical: 12.h,
              //                 ),
              //                 decoration: BoxDecoration(
              //                   color: Colors.white,
              //                   borderRadius: BorderRadius.circular(8),
              //                 ),
              //                 child: Text(
              //                     "${serviceDetailScreenProvider.pumpSequentialOperationTest}"),
              //               ),
              //               SizedBox(
              //                 height: 10.h,
              //               ),
              //               Container(
              //                 width: double.infinity,
              //                 padding: EdgeInsets.symmetric(
              //                   horizontal: 10.w,
              //                   vertical: 12.h,
              //                 ),
              //                 decoration: BoxDecoration(
              //                   color: Colors.white,
              //                   borderRadius: BorderRadius.circular(8),
              //                 ),
              //                 child: Text(
              //                   "Battery Status Reading - ${serviceDetailScreenProvider.submittedServiceInfo!.pumpDetails!.batteryStatusReading.toString()}",
              //                 ),
              //               ),
              //               SizedBox(
              //                 height: 10.h,
              //               ),
              //               Row(
              //                 crossAxisAlignment: CrossAxisAlignment.start,
              //                 mainAxisAlignment: MainAxisAlignment.spaceBetween,
              //                 children: [
              //                   Expanded(
              //                     flex: 5,
              //                     child: Container(
              //                       width: double.infinity,
              //                       padding: EdgeInsets.symmetric(
              //                         horizontal: 10.w,
              //                         vertical: 12.h,
              //                       ),
              //                       decoration: BoxDecoration(
              //                           color: Colors.white,
              //                           borderRadius: BorderRadius.circular(8)),
              //                       child: Text(
              //                           "Suction Pressure - ${serviceDetailScreenProvider.submittedServiceInfo!.pumpDetails!.suctionPressure.toString()}"),
              //                     ),
              //                   ),
              //                   SizedBox(
              //                     width: 10.w,
              //                   ),
              //                   Expanded(
              //                     flex: 5,
              //                     child: Container(
              //                       width: double.infinity,
              //                       padding: EdgeInsets.symmetric(
              //                         horizontal: 10.w,
              //                         vertical: 12.h,
              //                       ),
              //                       decoration: BoxDecoration(
              //                           color: Colors.white,
              //                           borderRadius: BorderRadius.circular(8)),
              //                       child: Text(
              //                           "Discharge Pressure - ${serviceDetailScreenProvider.submittedServiceInfo!.pumpDetails!.dischargePressureGaugeReading.toString()}"),
              //                     ),
              //                   ),
              //                 ],
              //               ),
              //               SizedBox(
              //                 height: 15.h,
              //               ),
              //             ],
              //           ),
              //         ),
              //       )
              //     : SizedBox(
              //         height: 0.h,
              //         width: 0.w,
              //       ),
              // SizedBox(
              //   height: 10.h,
              // ),
              // serviceDetailScreenProvider.submittedServiceInfo!.serviceName ==
              //         "PUMP ROOM SERVICE"
              //     ? Container(
              //         decoration: BoxDecoration(
              //           color: const Color(0xFFE1E9FF),
              //           borderRadius: BorderRadius.circular(10),
              //         ),
              //         child: Padding(
              //           padding: EdgeInsets.symmetric(horizontal: 10.w),
              //           child: Column(
              //             children: [
              //               SizedBox(
              //                 height: 8.h,
              //               ),
              //               const Align(
              //                 alignment: Alignment.centerLeft,
              //                 child: Text(
              //                   "Pump Status *",
              //                   style: TextStyle(
              //                     color: Colors.black,
              //                     fontWeight: FontWeight.w500,
              //                     fontSize: 18,
              //                   ),
              //                   textAlign: TextAlign.left,
              //                 ),
              //               ),
              //               Row(
              //                 mainAxisAlignment: MainAxisAlignment.start,
              //                 children: [
              //                   _buildRadioOption(
              //                     'AUTO',
              //                     serviceDetailScreenProvider.pumpStatus,
              //                     (newValue) {},
              //                   ),
              //                   SizedBox(
              //                     width: 7.w,
              //                   ),
              //                   _buildRadioOption(
              //                     'OFF CONDITION',
              //                     serviceDetailScreenProvider.pumpStatus,
              //                     (newValue) {},
              //                   ),
              //                   SizedBox(
              //                     width: 18.w,
              //                   ),
              //                   _buildRadioOption(
              //                     'MANUAL',
              //                     serviceDetailScreenProvider.pumpStatus,
              //                     (newValue) {},
              //                   ),
              //                 ],
              //               ),
              //               const Align(
              //                 alignment: Alignment.centerLeft,
              //                 child: Text(
              //                   "Diesel Level *",
              //                   style: TextStyle(
              //                     color: Colors.black,
              //                     fontWeight: FontWeight.w500,
              //                     fontSize: 18,
              //                   ),
              //                   textAlign: TextAlign.left,
              //                 ),
              //               ),
              //               Row(
              //                 mainAxisAlignment: MainAxisAlignment.start,
              //                 children: [
              //                   _buildRadioOption(
              //                     'FULL',
              //                     serviceDetailScreenProvider.dieselLevel,
              //                     (newValue) {},
              //                   ),
              //                   SizedBox(
              //                     width: 10.w,
              //                   ),
              //                   _buildRadioOption(
              //                     'HALF',
              //                     serviceDetailScreenProvider.dieselLevel,
              //                     (newValue) {},
              //                   ),
              //                   SizedBox(
              //                     width: 10.w,
              //                   ),
              //                   _buildRadioOption(
              //                     'NEED RE-FUEL',
              //                     serviceDetailScreenProvider.dieselLevel,
              //                     (newValue) {},
              //                   ),
              //                 ],
              //               ),
              //               const Align(
              //                 alignment: Alignment.centerLeft,
              //                 child: Text(
              //                   "Water storage Level *",
              //                   style: TextStyle(
              //                     color: Colors.black,
              //                     fontWeight: FontWeight.w500,
              //                     fontSize: 18,
              //                   ),
              //                   textAlign: TextAlign.left,
              //                 ),
              //               ),
              //               Row(
              //                 mainAxisAlignment: MainAxisAlignment.start,
              //                 children: [
              //                   _buildRadioOption(
              //                     'FULL',
              //                     serviceDetailScreenProvider.waterStorageLevel,
              //                     (newValue) {},
              //                   ),
              //                   SizedBox(
              //                     width: 10.w,
              //                   ),
              //                   _buildRadioOption(
              //                     'HALF',
              //                     serviceDetailScreenProvider.waterStorageLevel,
              //                     (newValue) {},
              //                   ),
              //                   SizedBox(
              //                     width: 10.w,
              //                   ),
              //                   _buildRadioOption(
              //                     'NEED RE-FUEL',
              //                     serviceDetailScreenProvider.waterStorageLevel,
              //                     (newValue) {},
              //                   ),
              //                 ],
              //               ),
              //               const Align(
              //                 alignment: Alignment.centerLeft,
              //                 child: Text(
              //                   "Pressure Switch Condition *",
              //                   style: TextStyle(
              //                     color: Colors.black,
              //                     fontWeight: FontWeight.w500,
              //                     fontSize: 18,
              //                   ),
              //                   textAlign: TextAlign.left,
              //                 ),
              //               ),
              //               Row(
              //                 mainAxisAlignment: MainAxisAlignment.start,
              //                 children: [
              //                   _buildRadioOption(
              //                     'OPEN',
              //                     serviceDetailScreenProvider
              //                         .pressureSwitchCondition,
              //                     (newValue) {},
              //                   ),
              //                   SizedBox(
              //                     width: 7.w,
              //                   ),
              //                   _buildRadioOption(
              //                     'CLOSE',
              //                     serviceDetailScreenProvider
              //                         .pressureSwitchCondition,
              //                     (newValue) {},
              //                   ),
              //                 ],
              //               ),
              //             ],
              //           ),
              //         ),
              //       )
              //     : SizedBox(
              //         height: 0.h,
              //         width: 0.w,
              //       ),
              SizedBox(
                height: 10.h,
              ),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: 1,
                itemBuilder: (context, index) {
                  List<TextEditingController> editingControllers =
                      List.generate(1, (_) => TextEditingController());
                  List<submitted_service_info.Question> descriptionList =
                      serviceDetailScreenProvider.questions
                          .map((question) => question)
                          .toList();
                  return TableForSubmittedData(
                    headingText1:  serviceDetailScreenProvider.submittedServiceInfo!.sectionName ?? "",
                    headingText2: '',
                    index: index,
                    leadingText: "A.${index + 1}",
                    descriptionList: descriptionList,
                    editingControllers: editingControllers,
                  );
                },
              ),
              SizedBox(height: 15.h),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
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
                child: Builder(
                  builder: (context) {
                    // Filter the list to only include valid image URLs
                    final validImages = serviceDetailScreenProvider
                        .submittedServiceInfo!.images!
                        .where((image) => image != null && image != "null")
                        .toList();

                    debugPrint("Valid images length is ${validImages.length}");

                    // Check if there are no valid images
                    if (validImages.isEmpty) {
                      return const SizedBox.shrink();
                    }

                    if (validImages.length == 1) {
                      return Container(
                        height: 240.h,
                        margin: const EdgeInsets.symmetric(horizontal: 5),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8.0),
                          image: DecorationImage(
                            image: NetworkImage(
                              validImages[0],
                            ), // Single valid image
                            fit: BoxFit.cover,
                          ),
                        ),
                      );
                    }

                    // If there are multiple valid images, use a CarouselSlider
                    return CarouselSlider.builder(
                      itemCount: validImages.length,
                      itemBuilder: (context, index, realIndex) {
                        return Container(
                          margin: const EdgeInsets.symmetric(horizontal: 5),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8.0),
                            image: DecorationImage(
                              image: NetworkImage(
                                  validImages[index]), // Access correct image
                              fit: BoxFit.cover,
                            ),
                          ),
                        );
                      },
                      options: CarouselOptions(
                        height: 240.h,
                        enlargeCenterPage: true,
                        enableInfiniteScroll: true,
                        autoPlay: true,
                        autoPlayInterval: const Duration(seconds: 3),
                        autoPlayCurve: Curves.easeInOut,
                        viewportFraction: 0.9,
                      ),
                    );
                  },
                ),
              ),
              SizedBox(
                height: 15.h,
              ),
              // (serviceDetailScreenProvider
              //                 .submittedServiceInfo != null && serviceDetailScreenProvider
              //                 .submittedServiceInfo!.technicianRemark !=
              //             null &&
              //         serviceDetailScreenProvider
              //             .submittedServiceInfo!.technicianRemark!.isNotEmpty)
              //     ? Align(
              //         alignment: Alignment.centerLeft,
              //         child: Text(
              //             "Technician Remark : ${serviceDetailScreenProvider.submittedServiceInfo!.technicianRemark}"),
              //       )
              //     : SizedBox(
              //         height: 0.h,
              //         width: 0.w,
              //       ),
              // SizedBox(
              //   height: 30.h,
              // ),
            ],
          ),
        ));
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
        ),
      ],
    );
  }
}
