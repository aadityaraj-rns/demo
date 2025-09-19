import 'dart:io';

import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/utils/snack_bar_utils.dart';
import 'package:firedesk/view_models/providers/service_detail_screen_provider.dart';
import 'package:firedesk/widgets/widget_utils.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:provider/provider.dart';

class ServiceFormImageUpdate extends StatefulWidget {
  final String updateImageId;
  const ServiceFormImageUpdate({super.key, required this.updateImageId});
  @override
  _ServiceFormImageUpdateState createState() => _ServiceFormImageUpdateState();
}

class _ServiceFormImageUpdateState extends State<ServiceFormImageUpdate> {
  XFile? imagePath1;
  XFile? imagePath2;
  XFile? imagePath3;
  TextEditingController remarksController = TextEditingController();

  Future<XFile?> pickImage(ImageSource source) async {
    final ImagePicker picker = ImagePicker();
    return await picker.pickImage(source: source);
  }

  @override
  void initState() {
    super.initState();
    print("submitted service form id is ${widget.updateImageId}");
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ServiceDetailScreenProvider>(
        builder: (context, serviceDetailProvider, _) {
      return PopScope(
        canPop: false,
        // onPopInvoked: (didPop) {
        //   if (!didPop) {
        //     // _onWillPop();
        //   }
        // },
        child: ModalProgressHUD(
          inAsyncCall: serviceDetailProvider.statusUpdateLoading,
          progressIndicator: CircularProgressIndicator(
            color: basicColor,
          ),
          child: Scaffold(
            backgroundColor: Colors.white,
            appBar: AppBar(
              automaticallyImplyLeading: false,
              backgroundColor: basicColor,
              title: Text(
                "Inspection  Form",
                style: appBarTextSTyle,
              ),
              centerTitle: true,
            ),
            body: SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 10.w),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          height: 20.h,
                        ),
                        Text(
                          "Required Image *",
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
                                        image:
                                            FileImage(File(imagePath1!.path)),
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
                          "Optional Images ",
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
                                              image: FileImage(
                                                  File(imagePath2!.path)),
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
                                              image: FileImage(
                                                  File(imagePath3!.path)),
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
                          height: 10.h,
                        ),
                      ],
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(vertical: 20.h),
                      child: GestureDetector(
                        onTap: () async {
                          if (kDebugMode) {
                            debugPrint("clicked on the container");
                          }
                          final provider =
                              Provider.of<ServiceDetailScreenProvider>(context,
                                  listen: false);
                          if (kDebugMode) {
                            debugPrint(
                                "image update id is ${widget.updateImageId}");
                          }
                          if (imagePath1 != null) {
                            await provider.uploadImages(
                              image1: imagePath1!,
                              image2: imagePath2,
                              image3: imagePath3,
                              responseId: widget.updateImageId,
                              remark: remarksController.text,
                            );

                            Navigator.pushNamed(
                                context, AppRoutes.approvalPendingScreen,
                                arguments: {"index": 0});
                          } else {
                            // ScaffoldMessenger.of(context).showSnackBar(
                            //   const SnackBar(
                            //     content: Text(
                            //         "First Image is required make sure you uploaded that image before submitting"),
                            //     duration: Duration(seconds: 3),
                            //   ),
                            // );
                            SnackBarUtils.toastMessage(
                                "First Image is required make sure you uploaded that image before submitting");
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
                              "Upload Images",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18.sp,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ),
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
