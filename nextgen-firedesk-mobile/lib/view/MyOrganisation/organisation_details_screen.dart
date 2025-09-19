import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/view_models/providers/organisation_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';

class OraganisationDetails extends StatefulWidget {
  const OraganisationDetails({super.key});

  @override
  State<OraganisationDetails> createState() => _OraganisationDetailsState();
}

class _OraganisationDetailsState extends State<OraganisationDetails> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      final provider =
          Provider.of<OrganisationProvider>(context, listen: false);
      provider.fetchOrganisationInfo(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<OrganisationProvider>(
        builder: (context, organisationsProvider, _) {
      return Scaffold(
          backgroundColor: Colors.white,
          appBar: PreferredSize(
            preferredSize: Size.fromHeight(45.h),
            child: Material(
              elevation: 2,
              child: AppBar(
                leading: IconButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    icon: const Icon(
                      Icons.arrow_back,
                      color: Colors.white,
                    )),
                backgroundColor: basicColor,
                automaticallyImplyLeading: false,
                title: Text(
                  "My Organisation",
                  style: appBarTextSTyle,
                ),
                centerTitle: true,
              ),
            ),
          ),
          body: organisationsProvider.isLoading
              ? const Center(
                  child: CircularProgressIndicator(
                  color: Colors.blue,
                ))
              : SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: 8.h),
                      (organisationsProvider.organisationInfo!.organization![0]
                                  .userId!.profile !=
                              null)
                          ? Center(
                              child: Padding(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 10.w, vertical: 15.h),
                                child: CircleAvatar(
                                  radius: 100.0.r,
                                  backgroundColor: basicColor.withOpacity(0.8),
                                  backgroundImage: NetworkImage(
                                    "${organisationsProvider.organisationInfo!.organization![0].userId!.profile}",
                                  ),
                                ),
                              ),
                            )
                          : Center(
                              child: Padding(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 10.w, vertical: 15.h,
                                ),
                                child: CircleAvatar(
                                  radius: 100.0.r,
                                  backgroundColor: Colors.grey.withOpacity(0.1),
                                  // backgroundImage:
                                  //     NetworkImage(techniCian2!.userId!.profile ?? ""),
                                  child: const Center(
                                    child: Icon(
                                      Icons.corporate_fare,
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
                            SizedBox(height: 20.0.h),
                            Gap(20.h),
                            Padding(
                              padding: EdgeInsets.symmetric(horizontal: 10.w),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  buildProfileRow(
                                      icon: Icons.corporate_fare,
                                      // label: "Phone",
                                      value: organisationsProvider
                                              .organisationInfo!
                                              .organization![0]
                                              .userId!
                                              .name ??
                                          ''),
                                  Gap(3.h),
                                  const Divider(
                                    color: Colors.grey,
                                    thickness: 0.8,
                                  ),
                                  Gap(3.h),
                                  buildProfileRow(
                                      icon: Icons.corporate_fare,
                                      // label: "Email",
                                      value: organisationsProvider
                                              .organisationInfo!
                                              .organization![0]
                                              .userId!
                                              .loginId ??
                                          ''),
                                  Gap(3.h),
                                  const Divider(
                                    color: Colors.grey,
                                    thickness: 0.8,
                                  ),
                                  Gap(3.h),
                                  buildProfileRow(
                                      icon: Icons.location_on,
                                      // label: "Address",
                                      value: organisationsProvider
                                              .organisationInfo!
                                              .organization![0]
                                              .address ??
                                          ""),
                                  Gap(3.h),
                                  const Divider(
                                    color: Colors.grey,
                                    thickness: 0.8,
                                  ),
                                  Gap(3.h),
                                  buildProfileRow(
                                      icon: Icons.location_on,
                                      // label: "City",
                                      value: organisationsProvider
                                              .organisationInfo!
                                              .organization![0]
                                              .cityId!
                                              .cityName ??
                                          ""),
                                  Gap(3.h),
                                  const Divider(
                                    color: Colors.grey,
                                    thickness: 0.8,
                                  ),
                                  Gap(3.h),
                                  buildProfileRow(
                                    icon: Icons.phone,
                                    // label: "Contact No",
                                    value: organisationsProvider
                                            .organisationInfo!
                                            .organization![0]
                                            .userId!
                                            .phone ??
                                        "",
                                  ),
                                  Gap(3.h),
                                  const Divider(
                                    color: Colors.grey,
                                    thickness: 0.8,
                                  ),
                                  Gap(3.h),
                                  buildProfileRow(
                                      icon: Icons.email,
                                      // label: "Email Id",
                                      value: organisationsProvider
                                              .organisationInfo!
                                              .organization![0]
                                              .userId!
                                              .email ??
                                          ""),
                                  Gap(3.h),
                                  const Divider(
                                    color: Colors.grey,
                                    thickness: 0.8,
                                  ),
                                  Gap(3.h),
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
                ));
    });
  }

  Widget buildProfileRow({
    required IconData icon,
    required String value,
  }) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 0.h),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Container(
            width: 30.w,
            height: 30.w,
            padding: EdgeInsets.all(6.w),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: darkGreyColor.withOpacity(0.1), // Slightly lighter color
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 3, // Reduced blur radius for subtle effect
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Icon(
              icon,
              size: 18.sp, // Slightly smaller icon size
              color: Colors.grey.shade700, // Slightly darker icon color
            ),
          ),
          SizedBox(width: 12.w), // Reduced spacing between icon and text

          // Value Text Styling
          Text(
            value,
            style: normalTextSTyle2.copyWith(
              fontWeight: FontWeight.w400,
              fontSize: 14.sp, // Slightly smaller font size
              color: darkGreyColor,
              letterSpacing: 0.3, // Reduced letter spacing
            ),
          ),
        ],
      ),
    );
  }
}

Widget _buildShimmerInfoRow() {
  return Padding(
    padding: EdgeInsets.symmetric(vertical: 6.h),
    child: Row(
      children: [
        CircleAvatar(
          backgroundColor: Colors.grey[300],
          radius: 22.0,
        ),
        SizedBox(width: 10.w),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 16.h,
              width: 100.w,
              color: Colors.grey[300],
            ),
            SizedBox(height: 2.h),
            Container(
              height: 14.h,
              width: 150.w,
              color: Colors.grey[300],
            ),
          ],
        ),
      ],
    ),
  );
}

Widget _buildInfoRow(
    {required IconData icon, required String title, required String value}) {
  return Padding(
    padding: EdgeInsets.symmetric(
        vertical: 6.h), // Reduced padding for compact design
    child: Row(
      children: [
        CircleAvatar(
          backgroundColor:
              darkGreyColor.withOpacity(0.8), // Consistent accent color
          radius: 22.0,
          child: Icon(icon, color: Colors.white, size: 24.0),
        ),
        SizedBox(width: 10.w),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 16.0.sp,
                  fontWeight: FontWeight.w500,
                  color: Colors.black87,
                ),
              ),
              SizedBox(height: 2.h),
              Text(
                value,
                style: TextStyle(
                  fontSize: 14.0.sp,
                  fontWeight: FontWeight.w400,
                  color: Colors.grey[700],
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    ),
  );
}
