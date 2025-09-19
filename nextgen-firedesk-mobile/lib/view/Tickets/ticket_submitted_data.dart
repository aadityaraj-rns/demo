import 'package:carousel_slider/carousel_slider.dart';
import 'package:firedesk/data/app_exceptions.dart';
import 'package:firedesk/data/reponse/status.dart';
import 'package:firedesk/models/data_models/Ticket_Models/submitted_ticket_response.dart'
    as submitted_ticket_response;
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/components/general_exception_widget.dart';
import 'package:firedesk/res/components/internet_exception.dart';
import 'package:firedesk/res/components/request_timeout.dart';
import 'package:firedesk/res/components/server_exception_widget.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/view/Tickets/components/table_for_submitted_ticket_data.dart';
import 'package:firedesk/view_models/providers/ticket_submitted_data_provider.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';

class TicketSubmittedDataScreen extends StatefulWidget {
  final String ticketId;
  const TicketSubmittedDataScreen({super.key, required this.ticketId});

  @override
  State<TicketSubmittedDataScreen> createState() =>
      _TicketSubmittedDataScreenState();
}

class _TicketSubmittedDataScreenState extends State<TicketSubmittedDataScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) async {
      final provider =
          Provider.of<TicketSubmittedDataProvider>(context, listen: false);
      // await provider.fetchServiceInfo(context, widget.ticketId);
      await provider.getSubmittedTicketData(context, widget.ticketId);
      if (kDebugMode) {
        debugPrint("ticket id is ${widget.ticketId}");
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<TicketSubmittedDataProvider>(
        builder: (context, submittedTicketProvider, _) {
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
        body: Column(
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
    return Consumer<TicketSubmittedDataProvider>(
      builder: (context, submittedTicketProvider, _) {
        switch (submittedTicketProvider.loadingStatus) {
          case Status.LOADING:
            return const Center(
              child: CircularProgressIndicator(
                color: Colors.blue,
              ),
            );
          case Status.ERROR:
            if (kDebugMode) {
              debugPrint(
                  "error is ${submittedTicketProvider.ticketResponseError}");
            }
            if (submittedTicketProvider.ticketResponseError ==
                InternetException) {
              return InterNetExceptionWidget(
                onPress: () {
                  submittedTicketProvider.getSubmittedTicketData(
                      context, widget.ticketId);
                },
              );
            } else if (submittedTicketProvider.ticketResponseError ==
                RequestTimeOut) {
              return RequestTimeOutWidget(
                onPress: () {
                  submittedTicketProvider.getSubmittedTicketData(
                      context, widget.ticketId);
                },
              );
            } else if (submittedTicketProvider.ticketResponseError ==
                ServerException) {
              return ServerExceptionWidget(
                onPress: () {
                  submittedTicketProvider.getSubmittedTicketData(
                      context, widget.ticketId);
                },
              );
            } else {
              return GeneralExceptionWidget(
                onPress: () {
                  submittedTicketProvider.getSubmittedTicketData(
                      context, widget.ticketId);
                },
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
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: 1,
                      itemBuilder: (context, index) {
                        List<TextEditingController> editingControllers =
                            List.generate(1, (_) => TextEditingController());
                        List<submitted_ticket_response.Question>
                            descriptionList = submittedTicketProvider
                                .ticketResponse!.ticketResponse!.questions!
                                .map((question) => question)
                                .toList();
                        return TableForSubmittedTicketData(
                          headingText1: "Standard Inspection Check List - ",
                          headingText2: '',
                          index: index,
                          leadingText: "A.${index + 1}",
                          descriptionList: descriptionList,
                          editingControllers: editingControllers,
                        );
                      },
                    ),
                    SizedBox(height: 15.h),
                    Builder(
                      builder: (context) {
                        // Get the Images object from the provider
                        final images = submittedTicketProvider
                            .ticketResponse?.ticketResponse?.images;

                        if (images == null) {
                          // If images is null, return an empty widget
                          return const SizedBox.shrink();
                        }

                        // Extract the non-null and non-"null" image URLs as a list
                        final validImages = [
                          images.ticketimage1,
                          images.ticketimage2,
                          images.ticketimage3,
                        ]
                            .where((image) =>
                                image != null &&
                                image != "null" &&
                                image.isNotEmpty)
                            .cast<String>()
                            .toList();

                        debugPrint(
                            "Valid images length is ${validImages.length}");

                        // If there are no valid images, return an empty widget
                        if (validImages.isEmpty) {
                          return const SizedBox.shrink();
                        }

                        // Only show the container if there are valid images
                        return Container(
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
                          child: validImages.length == 1
                              ? Container(
                                  height: 240.h,
                                  margin:
                                      const EdgeInsets.symmetric(horizontal: 5),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(8.0),
                                    image: DecorationImage(
                                      image: NetworkImage(validImages[0]),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                )
                              : CarouselSlider.builder(
                                  itemCount: validImages.length,
                                  itemBuilder: (context, index, realIndex) {
                                    return Container(
                                      margin: const EdgeInsets.symmetric(
                                          horizontal: 5),
                                      decoration: BoxDecoration(
                                        borderRadius:
                                            BorderRadius.circular(8.0),
                                        image: DecorationImage(
                                          image: NetworkImage(
                                            validImages[index],
                                          ),
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
                                    autoPlayInterval:
                                        const Duration(seconds: 3),
                                    autoPlayCurve: Curves.easeInOut,
                                    viewportFraction: 0.9,
                                  ),
                                ),
                        );
                      },
                    ),
                    SizedBox(
                      height: 15.h,
                    ),
                    submittedTicketProvider.ticketResponse!.ticketResponse!
                            .technicianRemark!.isNotEmpty
                        ? Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                                "Technician Remark : ${submittedTicketProvider.ticketResponse!.ticketResponse!.technicianRemark ?? ""}"),
                          )
                        : SizedBox(
                            height: 0.h,
                            width: 0.w,
                          ),
                  ],
                ),
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
        ),
      ],
    );
  }
}
