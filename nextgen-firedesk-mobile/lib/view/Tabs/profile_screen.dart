import "package:firedesk/data/app_exceptions.dart";
import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/models/data_models/User/technician_profile_model.dart"
    as technicianprofile;
import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/components/general_exception_widget.dart";
import "package:firedesk/res/components/internet_exception.dart";
import "package:firedesk/res/components/request_timeout.dart";
import "package:firedesk/res/components/server_exception_widget.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/res/styles/text_style.dart";
import "package:firedesk/res/styles/text_styles.dart";
import "package:firedesk/view_models/providers/user_provider.dart";
import "package:firedesk/widgets/dialog/logout_dialog.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:gap/gap.dart";
import "package:provider/provider.dart";
import "package:shimmer/shimmer.dart";

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    // WidgetsBinding.instance.addPostFrameCallback(
    //   (_) {
    //     final provider =
    //         Provider.of<AuthenticationProvider>(context, listen: false);
    //     provider.profileData(context);
    //   },
    // );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthenticationProvider>(
      builder: (context, provider, _) {
        technicianprofile.Technician? techniCian2;
        // if (provider.techniCian2Local == null) {
        techniCian2 = provider.techniCian2;
        // } else {
        // techniCian2 = provider.techniCian2Local;
        // }

        return Scaffold(
          backgroundColor: Colors.white,
          appBar: PreferredSize(
            preferredSize: Size.fromHeight(45.h),
            child: Material(
              elevation: 2,
              child: AppBar(
                backgroundColor: basicColor,
                automaticallyImplyLeading: false,
                title: Text(
                  "Profile",
                  style: appBarTextSTyle,
                ),
                centerTitle: true,
                actions: [
                  IconButton(
                    icon: const Icon(
                      Icons.edit,
                      size: 20,
                      color: Colors.white,
                    ),
                    onPressed: () {
                      Navigator.pushNamed(
                          context, AppRoutes.profileUpdateScreen,
                          arguments: {
                            'email': techniCian2?.userId?.email ?? '',
                            'phone': techniCian2?.userId?.phone ?? '',
                          });
                    },
                  ),
                  IconButton(
                    onPressed: () {
                      showLogoutDialog(context);
                    },
                    icon: const Icon(
                      Icons.logout,
                      size: 20,
                      color: Colors.white,
                    ),
                  )
                ],
              ),
            ),
          ),
          // body: provider.isLoading || techniCian2 == null
          //     ? buildShimmerLoading()
          //     : buildProfileContent(techniCian2),
          body: _returnContents(provider),
        );
      },
    );
  }

  Widget _returnContents(AuthenticationProvider authProvider) {
    switch (authProvider.profileStatus) {
      case Status.LOADING:
        return buildShimmerLoading();
      case Status.ERROR:
        if (authProvider.profileDataError == InternetException) {
          return InterNetExceptionWidget(
            onPress: () {
              authProvider.profileData(context);
            },
          );
        } else if (authProvider.profileDataError == RequestTimeOut) {
          return RequestTimeOutWidget(
            onPress: () {
              authProvider.profileData(context);
            },
          );
        } else if (authProvider.profileDataError == ServerException) {
          return ServerExceptionWidget(
            onPress: () {
              authProvider.profileData(context);
            },
          );
        } else {
          return GeneralExceptionWidget(
            onPress: () {
              authProvider.profileData(context);
            },
          );
        }
      case Status.COMPLETED:
        return buildProfileContent(authProvider.techniCian2);
      default:
        return buildShimmerLoading();
    }
  }

  Widget buildShimmerLoading() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 8.h),
          Center(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 15.h),
              child: Shimmer.fromColors(
                baseColor: Colors.grey[300]!,
                highlightColor: Colors.grey[100]!,
                child: CircleAvatar(
                  radius: 80.0.r,
                  backgroundColor: Colors.grey[300],
                ),
              ),
            ),
          ),
          Gap(40.h),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.0.w),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                buildShimmerLine(),
                buildShimmerLine(width: 200.w),
                SizedBox(height: 20.0.h),
                Gap(20.h),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10.w),
                  child: Column(
                    children: List.generate(
                      5,
                      (index) => Column(
                        children: [
                          Row(
                            children: [
                              Shimmer.fromColors(
                                baseColor: Colors.grey[300]!,
                                highlightColor: Colors.grey[100]!,
                                child: CircleAvatar(
                                  radius: 18.r,
                                  backgroundColor: Colors.grey[300],
                                ),
                              ),
                              SizedBox(width: 20.0.w),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  buildShimmerLine(width: 80.w),
                                  buildShimmerLine(width: 150.w),
                                ],
                              ),
                            ],
                          ),
                          Gap(3.h),
                          const Divider(
                            color: Colors.grey,
                            thickness: 0.8,
                          ),
                          Gap(3.h),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildShimmerLine({double width = double.infinity}) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4.0.h),
      child: Shimmer.fromColors(
        baseColor: Colors.grey[300]!,
        highlightColor: Colors.grey[100]!,
        child: Container(
          height: 10.0.h,
          width: width,
          color: Colors.grey[300],
        ),
      ),
    );
  }

  Widget buildProfileContent(technicianprofile.Technician? techniCian2) {
    return Consumer<AuthenticationProvider>(
        builder: (context, authenticationProvider, _) {
      technicianprofile.Technician? techniCian2;
      if (authenticationProvider.techniCian2Local == null) {
        techniCian2 = authenticationProvider.techniCian2;
      } else {
        techniCian2 = authenticationProvider.techniCian2Local;
      }
      return SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 8.h),
            (techniCian2?.userId?.profile != null)
                ? Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(
                          horizontal: 10.w, vertical: 15.h),
                      child: CircleAvatar(
                        radius: 80.0.r,
                        backgroundColor: basicColor.withOpacity(0.8),
                        backgroundImage: NetworkImage(
                          "${techniCian2?.userId?.profile}",
                        ),
                      ),
                    ),
                  )
                : Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(
                          horizontal: 10.w, vertical: 15.h),
                      child: CircleAvatar(
                        radius: 80.0.r,
                        backgroundColor: Colors.grey.withOpacity(0.1),
                        // backgroundImage:
                        //     NetworkImage(techniCian2!.userId!.profile ?? ""),
                        child: const Center(
                          child: Icon(
                            Icons.person,
                            color: Colors.grey,
                            size: 55,
                          ),
                        ),
                      ),
                    ),
                  ),
            Gap(40.h),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20.0.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    techniCian2?.userId!.name ?? '',
                    style: normalTextSTyle1,
                  ),
                  Text(
                    techniCian2?.venderEmail ?? '',
                    style: normalTextSTyle2,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 20.0.h),
                  Gap(20.h),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 10.w),
                    child: Column(
                      children: [
                        buildProfileRow(
                            icon: Icons.phone,
                            label: "Phone",
                            value: techniCian2?.userId?.phone ?? ''),
                        Gap(3.h),
                        const Divider(
                          color: Colors.grey,
                          thickness: 0.8,
                        ),
                        Gap(3.h),
                        buildProfileRow(
                            icon: Icons.email,
                            label: "Email",
                            value: techniCian2?.userId?.email ?? ''),
                        Gap(3.h),
                        const Divider(
                          color: Colors.grey,
                          thickness: 0.8,
                        ),
                        Gap(3.h),
                        buildProfileRow(
                            icon: Icons.email,
                            label: "Designation",
                            value: "Technician"),
                        Gap(3.h),
                        const Divider(
                          color: Colors.grey,
                          thickness: 0.8,
                        ),
                        Gap(3.h),
                        buildProfileRow(
                            icon: Icons.location_on,
                            label: "Address",
                            value: "Bangalore"),
                        Gap(3.h),
                        const Divider(
                          color: Colors.grey,
                          thickness: 0.8,
                        ),
                        Gap(3.h),
                        buildProfileRow(
                          icon: Icons.corporate_fare,
                          label: "Organisation Name",
                          value: "organisation name",
                        ),
                        Gap(3.h),
                        const Divider(
                          color: Colors.grey,
                          thickness: 0.8,
                        ),
                        SizedBox(
                          height: 20.h,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    });
  }

  // Profile row widget
  Widget buildProfileRow(
      {required IconData icon, required String label, required String value}) {
    return Row(
      children: [
        CircleAvatar(
          radius: 16.r,
          backgroundColor: darkGreyColor.withOpacity(0.6),
          child: Icon(
            icon,
            size: 20.dg,
            color: Colors.white,
          ),
        ),
        SizedBox(width: 20.0.w),
        Text(value, style: mBlackTextStyle.copyWith(color: greyFontColor)),
      ],
    );
  }
}
