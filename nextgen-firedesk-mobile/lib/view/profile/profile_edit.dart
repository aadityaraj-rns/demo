import "dart:io";

import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/res/styles/text_style.dart";
import "package:firedesk/utils/pick_image.dart";
import "package:firedesk/utils/snack_bar_utils.dart";
import "package:firedesk/view_models/providers/bottom_bar_provider.dart";
import "package:firedesk/view_models/providers/user_provider.dart";
import "package:firedesk/widgets/dialog/camera_disabled_dialog.dart";
import "package:firedesk/widgets/widget_utils.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:image_picker/image_picker.dart";
import "package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart";
import "package:permission_handler/permission_handler.dart";
import "package:provider/provider.dart";

class ProfileScreenUpdate extends StatefulWidget {
  final String email;
  final String phone;
  const ProfileScreenUpdate(
      {super.key, required this.email, required this.phone});
  @override
  State<ProfileScreenUpdate> createState() => _ProfileScreenUpdateState();
}

class _ProfileScreenUpdateState extends State<ProfileScreenUpdate> {
  XFile? imagePath1;
  File? image1;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  TextEditingController nameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController phoneController = TextEditingController();

  @override
  void initState() {
    super.initState();
    phoneController.text = widget.phone;
    emailController.text = widget.email;
  }

  bool validateEmail(String email) {
    final RegExp emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return emailRegex.hasMatch(email);
  }

  bool validateName(String name) {
    // Name must not be empty and should have at least 2 characters
    return name.isNotEmpty && name.length > 1;
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthenticationProvider>(
        builder: (context, userProvider, _) {
      return ModalProgressHUD(
        inAsyncCall: userProvider.isLoading,
        progressIndicator: Center(
          child: CircularProgressIndicator(
            color: basicColor,
          ),
        ),
        child: Scaffold(
          backgroundColor: Colors.white,
          appBar: PreferredSize(
            preferredSize: Size.fromHeight(45.h),
            child: Material(
              elevation: 2,
              child: AppBar(
                backgroundColor: basicColor,
                automaticallyImplyLeading: false,
                title: Text(
                  "Profile Update",
                  style: appBarTextSTyle,
                ),
                centerTitle: true,
              ),
            ),
          ),
          body: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 20.w),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    SizedBox(height: 40.h),
                    GestureDetector(
                      onTap: () async {
                        final status = await Permission.camera.request();

                        if (status.isDenied) {
                          SnackBarUtils.toastMessage(
                              "Camera permission is required to update profile image");
                          // Navigator.pop(context);
                          return;
                        }

                        if (status.isPermanentlyDenied) {
                          showCameraDisabledDialog(context);
                        }

                        if (status.isGranted) {
                          imagePath1 = await pickImage(ImageSource.camera);
                          setState(() {
                            image1 = File(imagePath1!.path);
                          });
                        }
                      },
                      child: Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: 10.w,
                            vertical: 15.h,
                          ),
                          child: image1 == null
                              ? CircleAvatar(
                                  radius: 100.0.r,
                                  backgroundColor:
                                      lightGreyColor.withOpacity(0.2),
                                  child: Icon(
                                    Icons.add_a_photo,
                                    size: 65.dg,
                                    color: Colors.white,
                                  ),
                                )
                              : CircleAvatar(
                                  radius: 100.0.r,
                                  backgroundColor: lightGreyColor,
                                  backgroundImage: FileImage(image1!),
                                ),
                        ),
                      ),
                    ),
                    SizedBox(height: 60.h),
                    getDefaultTextFiledWithLabelAndBorder(
                        context, "Add the name", nameController,
                        minLines: 1,
                        leadingIcon: Icons.person, validator: (value) {
                      if (!validateName(value ?? "")) {
                        return "Please enter a valid name";
                      }
                      return null;
                    }, onChanged: (value) {
                      _formKey.currentState?.validate();
                    }),
                    SizedBox(height: 20.h),
                    getDefaultTextFiledWithLabelAndBorder(
                      context,
                      "Add your email",
                      emailController,
                      minLines: 1,
                      leadingIcon: Icons.email,
                      isReadonly: true,
                      validator: (value) {
                        if (!validateEmail(value ?? "")) {
                          return "Please enter a valid email";
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 20.h),
                    getDefaultTextFiledWithLabelAndBorder(
                      context,
                      "Add your phone number",
                      phoneController,
                      isReadonly: true,
                      leadingIcon: Icons.phone,
                    ),
                    SizedBox(height: 150.h),
                    GestureDetector(
                      onTap: () async {
                        if (_formKey.currentState!.validate()) {
                          final provider = Provider.of<AuthenticationProvider>(
                              context,
                              listen: false);
                          await provider.updateProfileData(
                            context,
                            phoneController.text,
                            emailController.text,
                            nameController.text,
                            imagePath1,
                          );
                          final bottomBarProvider =
                              Provider.of<BottomBarProvider>(context,
                                  listen: false);
                          bottomBarProvider.setCurrentIndex = 0;
                          Navigator.popUntil(
                              context,
                              (route) =>
                                  route.settings.name == AppRoutes.bottombar);
                        }
                      },
                      child: Container(
                        height: 50.h,
                        width: 370.w,
                        decoration: BoxDecoration(
                          color: basicColor,
                          borderRadius: BorderRadius.circular(22.h),
                        ),
                        child: const Center(
                          child: Text(
                            "Update Profile",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontFamily: "Poppins",
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
