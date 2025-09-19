import 'package:firedesk/data/app_exceptions.dart';
import 'package:firedesk/data/reponse/status.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/components/general_exception_widget.dart';
import 'package:firedesk/res/components/internet_exception.dart';
import 'package:firedesk/res/components/request_timeout.dart';
import 'package:firedesk/res/components/server_exception_widget.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/view/image_view.dart';
import 'package:firedesk/view_models/providers/plants_screen_provider.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class LayOutsScreen extends StatefulWidget {
  final String plantId;
  const LayOutsScreen({super.key, required this.plantId});
  @override
  State<LayOutsScreen> createState() => _LayOutsScreenState();
}

class _LayOutsScreenState extends State<LayOutsScreen> {
  // final TooltipBehavior _tooltip = TooltipBehavior(enable: true);

  @override
  void initState() {
    super.initState();
    if (kDebugMode) {
      debugPrint("LayOutsScreen id is ${widget.plantId}");
    }

    WidgetsBinding.instance.addPostFrameCallback(
      (timeStamp) async {
        final provider =
            Provider.of<PlantsScreenProvider>(context, listen: false);
        provider.fetchPlantInfo(context, widget.plantId);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (kDebugMode) {
      debugPrint("came to build state");
    }
    return Scaffold(
      backgroundColor: Colors.grey[100]!,
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(45.h),
        child: Material(
          elevation: 2,
          child: AppBar(
            backgroundColor: basicColor,
            leading: GestureDetector(
              onTap: () {
                Navigator.pop(context);
              },
              child: const Icon(
                Icons.arrow_back,
                color: Colors.white,
              ),
            ),
            // automaticallyImplyLeading: false,
            title: Text(
              "Plant Details",
              style: appBarTextSTyle,
            ),
            centerTitle: true,
          ),
        ),
      ),
      body: Consumer<PlantsScreenProvider>(
        builder: (context, plantProvider, _) {
          if (kDebugMode) {
            debugPrint("came to builder state");
          }
          switch (plantProvider.plantInfoStatus) {
            case Status.LOADING:
              return const ShimmerLoadingWidget();
            case Status.ERROR:
              if (kDebugMode) {
                debugPrint("error is ${plantProvider.plantInfoError}");
              }
              if (plantProvider.plantInfoError == InternetException) {
                return InterNetExceptionWidget(
                  onPress: () {
                    plantProvider.fetchPlantInfo(context, widget.plantId);
                  },
                );
              } else if (plantProvider.plantInfoError == RequestTimeOut) {
                return RequestTimeOutWidget(
                  onPress: () {
                    plantProvider.fetchPlantInfo(context, widget.plantId);
                  },
                );
              } else if (plantProvider.plantInfoError == ServerException) {
                return ServerExceptionWidget(
                  onPress: () {
                    plantProvider.fetchPlantInfo(context, widget.plantId);
                  },
                );
              } else {
                return GeneralExceptionWidget(
                  onPress: () {
                    plantProvider.fetchPlantInfo(context, widget.plantId);
                  },
                );
              }
            case Status.COMPLETED:
              return SingleChildScrollView(
                child: Column(
                  children: [
                    // Stack(
                    //   children: [
                    //     Container(
                    //       color: Colors.grey.withOpacity(0.3),
                    //       child: plantProvider.plantInfo!.plant!.plantImage ==
                    //               null
                    //           ? const SizedBox()
                    //           : Image.network(
                    //               plantProvider.plantInfo!.plant!.plantImage!,
                    //               fit: BoxFit.fill,
                    //               height: 280.h,
                    //               width: double.infinity,
                    //             ),
                    //     ),
                    //     Positioned(
                    //       top: 20.h,
                    //       child: IconButton(
                    //         onPressed: () {
                    //           Navigator.pop(context);
                    //         },
                    //         icon: Container(
                    //           padding: const EdgeInsets.symmetric(
                    //               horizontal: 5, vertical: 3),
                    //           decoration: BoxDecoration(
                    //             color: Colors.grey.withOpacity(0.7),
                    //             borderRadius: BorderRadius.circular(8),
                    //           ),
                    //           child: const Icon(
                    //             Icons.arrow_back_ios,
                    //             color: Colors.white,
                    //           ),
                    //         ),
                    //       ),
                    //     )
                    //   ],
                    // ),
                    SizedBox(
                      height: 20.h,
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 20.w),
                          padding: EdgeInsets.symmetric(
                              horizontal: 10.w, vertical: 8.h),
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12.withOpacity(0.1),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const CircleAvatar(
                                    backgroundColor: Colors.white,
                                    radius: 24.0,
                                    child: Icon(
                                      Icons.real_estate_agent,
                                      color: Colors.black,
                                      size: 24.0,
                                    ),
                                  ),
                                  SizedBox(width: 10.w),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Expanded(
                                              child: Text(
                                                "${plantProvider.plantInfo!.plant!.plantName}",
                                                style: TextStyle(
                                                  fontSize: 14.sp,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.black,
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                            const SizedBox(
                                              width: 10,
                                            ),
                                            plantProvider.plantInfo!.plant!
                                                        .status ==
                                                    "Active"
                                                ? const CircleAvatar(
                                                    radius: 7,
                                                    backgroundColor:
                                                        Colors.green,
                                                  )
                                                : const CircleAvatar(
                                                    radius: 7,
                                                    backgroundColor:
                                                        Colors.green,
                                                  ),
                                          ],
                                        ),
                                        SizedBox(height: 4.h),
                                        Text(
                                          "Plant Id : ${plantProvider.plantInfo!.plant!.plantId}",
                                          style: TextStyle(
                                            fontSize: 14.sp,
                                            fontWeight: FontWeight.bold,
                                            color: greyFontColor,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        SizedBox(height: 4.h),
                                        Row(
                                          children: [
                                            const Icon(
                                              Icons.location_on,
                                              color: Colors.grey,
                                            ),
                                            const SizedBox(
                                              width: 5,
                                            ),
                                            Expanded(
                                              child: Text(
                                                "${plantProvider.plantInfo!.plant!.address},${plantProvider.plantInfo!.plant!.cityId!.cityName}",
                                                style: TextStyle(
                                                  fontSize: 14.sp,
                                                  color: Colors.black54,
                                                ),
                                                maxLines: 2,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        SizedBox(height: 20.h),
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 20.w),
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Padding(
                            padding: EdgeInsets.symmetric(
                                horizontal: 20.w,
                                vertical:
                                    16.h), // Padding for the entire container
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.person,
                                      color: Colors.black,
                                      size: 24.0,
                                    ),
                                    SizedBox(width: 8.w),
                                    Text(
                                      "Manager",
                                      style: TextStyle(
                                        fontSize: 18.sp,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.black,
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(
                                  width: 115.w,
                                  child: const Divider(
                                    indent: 3,
                                    endIndent: 3,
                                    color: Colors.grey,
                                    thickness: 2,
                                    height: 20,
                                  ),
                                ),
                                SizedBox(height: 5.h),
                                Padding(
                                  padding:
                                      EdgeInsets.symmetric(horizontal: 5.w),
                                  child: Column(
                                    children: [
                                      InfoRow(
                                        name:
                                            "${plantProvider.plantInfo!.plant!.managerId!.userId!.name}",
                                        icon: Icons.person,
                                      ),
                                      SizedBox(height: 12.h),
                                      InfoRow(
                                        name:
                                            "${plantProvider.plantInfo!.plant!.managerId!.userId!.phone}",
                                        icon: Icons.phone,
                                      ),
                                      SizedBox(height: 12.h),
                                      InfoRow(
                                        name:
                                            "${plantProvider.plantInfo!.plant!.managerId!.userId!.email}",
                                        icon: Icons.email,
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 20.h,
                        ),
                        SizedBox(
                          height: 230.h,
                          child: SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: [
                                SizedBox(
                                  width: 15.w,
                                ),
                                Container(
                                  margin: const EdgeInsets.symmetric(
                                      horizontal: 8.0),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8.0),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(8),
                                    boxShadow: const [
                                      BoxShadow(
                                        color: Colors.grey,
                                        blurRadius: 1,
                                        offset: Offset(0, 1),
                                      )
                                    ],
                                  ),
                                  child: SizedBox(
                                    width: 300.w,
                                    child: SfCircularChart(
                                      title: const ChartTitle(
                                          text: 'Data Representation (in %)'),
                                      legend: const Legend(
                                        isVisible: true,
                                        position: LegendPosition.right,
                                        orientation:
                                            LegendItemOrientation.vertical,
                                      ),
                                      series: <PieSeries<ChartData, String>>[
                                        PieSeries<ChartData, String>(
                                          dataSource:
                                              plantProvider.categoriesData,
                                          xValueMapper: (ChartData data, _) =>
                                              data.category,
                                          yValueMapper: (ChartData data, _) =>
                                              data.percentage,
                                          pointColorMapper:
                                              (ChartData data, _) {
                                            switch (data.category) {
                                              case 'Fire Hydrant':
                                                return const Color(0xff003161);
                                              case 'Fire Extinguishers':
                                                return const Color(0xffE07B39);
                                              default:
                                                return const Color(0xff3C552D);
                                            }
                                          },
                                          dataLabelSettings:
                                              const DataLabelSettings(
                                                  isVisible: true),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                Container(
                                  margin: const EdgeInsets.symmetric(
                                      horizontal: 8.0),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8.0),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(8),
                                    boxShadow: const [
                                      BoxShadow(
                                        color: Colors.grey,
                                        blurRadius: 1,
                                        offset: Offset(0, 1),
                                      )
                                    ],
                                  ),
                                  child: SizedBox(
                                    width: 360.w,
                                    child: SfCartesianChart(
                                      primaryXAxis: const CategoryAxis(),
                                      primaryYAxis: const NumericAxis(
                                        minimum: 0,
                                        maximum:
                                            40, // Adjust dynamically if needed
                                        interval: 10,
                                      ),
                                      tooltipBehavior:
                                          TooltipBehavior(enable: true),
                                      legend: const Legend(
                                        isVisible: true,
                                        position: LegendPosition.bottom,
                                      ),
                                      series: <CartesianSeries<ChartData2,
                                          String>>[
                                        ColumnSeries<ChartData2, String>(
                                          dataSource: plantProvider
                                              .subCategoriesData
                                              .where((item) =>
                                                  item.status == 'Healthy')
                                              .toList(),
                                          xValueMapper: (ChartData2 data, _) =>
                                              data.category,
                                          yValueMapper: (ChartData2 data, _) =>
                                              data.value,
                                          name: 'Healthy',
                                          color: const Color(0xff003161),
                                        ),
                                        ColumnSeries<ChartData2, String>(
                                          dataSource: plantProvider
                                              .subCategoriesData
                                              .where((item) =>
                                                  item.status ==
                                                  'Need Attention')
                                              .toList(),
                                          xValueMapper: (ChartData2 data, _) =>
                                              data.category,
                                          yValueMapper: (ChartData2 data, _) =>
                                              data.value,
                                          name: 'Need Attention',
                                          color: const Color(0xffE07B39),
                                        ),
                                        ColumnSeries<ChartData2, String>(
                                          dataSource: plantProvider
                                              .subCategoriesData
                                              .where((item) =>
                                                  item.status == 'Not Working')
                                              .toList(),
                                          xValueMapper: (ChartData2 data, _) =>
                                              data.category,
                                          yValueMapper: (ChartData2 data, _) =>
                                              data.value,
                                          name: 'Not Working',
                                          color: const Color(0xff3C552D),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                Container(
                                  margin: const EdgeInsets.symmetric(
                                      horizontal: 8.0),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8.0),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(8),
                                    boxShadow: const [
                                      BoxShadow(
                                        color: Colors.grey,
                                        blurRadius: 1,
                                        offset: Offset(0, 1),
                                      )
                                    ],
                                  ),
                                  child: SizedBox(
                                    width: 300,
                                    child: SfCircularChart(
                                      title: const ChartTitle(
                                          text: 'Ticket Status (in %)'),
                                      legend: const Legend(
                                        isVisible: true,
                                        position: LegendPosition.right,
                                        orientation:
                                            LegendItemOrientation.vertical,
                                      ),
                                      series: <PieSeries<ChartData, String>>[
                                        PieSeries<ChartData, String>(
                                          dataSource: plantProvider.ticketData,
                                          xValueMapper: (ChartData data, _) =>
                                              data.category,
                                          yValueMapper: (ChartData data, _) =>
                                              data.percentage,
                                          pointColorMapper:
                                              (ChartData data, _) {
                                            switch (data.category) {
                                              case 'Completed':
                                                return const Color(0xff003161);
                                              case 'Pending':
                                                return const Color(0xffE07B39);
                                              default:
                                                return const Color(0xff3C552D);
                                            }
                                          },
                                          dataLabelSettings:
                                              const DataLabelSettings(
                                            isVisible: true,
                                            labelPosition:
                                                ChartDataLabelPosition.outside,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                Container(
                                  margin: const EdgeInsets.symmetric(
                                      horizontal: 8.0),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8.0),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(8),
                                    boxShadow: const [
                                      BoxShadow(
                                        color: Colors.grey,
                                        blurRadius: 1,
                                        offset: Offset(0, 1),
                                      ),
                                    ],
                                  ),
                                  child: SizedBox(
                                    width: 300,
                                    child: SfCircularChart(
                                      title: const ChartTitle(
                                          text: 'Service Status (in %)'),
                                      legend: const Legend(
                                        isVisible: true,
                                        position: LegendPosition.right,
                                        orientation:
                                            LegendItemOrientation.vertical,
                                      ),
                                      series: <PieSeries<ChartData, String>>[
                                        PieSeries<ChartData, String>(
                                          dataSource: plantProvider.serviceData,
                                          xValueMapper: (ChartData data, _) =>
                                              data.category,
                                          yValueMapper: (ChartData data, _) =>
                                              data.percentage,
                                          pointColorMapper:
                                              (ChartData data, _) {
                                            switch (data.category) {
                                              case 'Completed':
                                                return const Color(0xff003161);
                                              case 'Pending':
                                                return const Color(0xffE07B39);
                                              default:
                                                return const Color(0xff3C552D);
                                            }
                                          },
                                          dataLabelSettings:
                                              const DataLabelSettings(
                                            isVisible: true,
                                            labelPosition:
                                                ChartDataLabelPosition.outside,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 20.h,
                        ),
                        SizedBox(
                          height: 165.h,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount:
                                plantProvider.plantInfo!.plant!.layouts!.length,
                            padding: EdgeInsets.symmetric(
                                horizontal: 20.w, vertical: 10.h),
                            itemBuilder: (context, index) {
                              final item = plantProvider
                                  .plantInfo!.plant!.layouts![index];

                              return GestureDetector(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => ImageViewScreen2(
                                        imageUrl: item.layoutImage!,
                                        name: item.layoutName,
                                      ),
                                    ),
                                  );
                                },
                                child: Padding(
                                  padding: EdgeInsets.only(right: 15.w),
                                  child: Container(
                                    width: 150.w,
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: const [
                                        BoxShadow(
                                          color: Colors.black26,
                                          blurRadius: 1,
                                          offset: Offset(0, 1),
                                        ),
                                      ],
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        // Image at the top
                                        ClipRRect(
                                          borderRadius: const BorderRadius.only(
                                            topLeft: Radius.circular(12),
                                            topRight: Radius.circular(12),
                                          ), // Rounded corners for the image container
                                          child: Image.network(
                                            item.layoutImage!, // Layout image
                                            height: 110
                                                .h, // Adjusted height for the image
                                            width: double
                                                .infinity, // Full width for the image
                                            fit: BoxFit
                                                .cover, // Ensures the image covers the entire area
                                          ),
                                        ),
                                        SizedBox(
                                            height: 5
                                                .h), // Increased space between image and text
                                        // Item name below the image
                                        Padding(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 10.w),
                                          child: Text(
                                            item.layoutName!, // Layout name
                                            style: TextStyle(
                                              fontSize: 16
                                                  .sp, // Larger font size for better readability
                                              fontWeight: FontWeight
                                                  .w600, // Semi-bold for more emphasis
                                              color: Colors
                                                  .black87, // Slightly muted text color
                                            ),
                                            textAlign: TextAlign
                                                .center, // Center align the text
                                            maxLines: 1, // Prevent overflow
                                            overflow: TextOverflow
                                                .ellipsis, // Ellipsis if text is too long
                                          ),
                                        ),
                                        SizedBox(
                                            height: 5
                                                .h), // Additional space below the name
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        )

                        // LayOutContainerList(),
                      ],
                    ),
                  ],
                ),
              );
            default:
              return const ShimmerLoadingWidget();
          }
        },
      ),
    );
  }
}

class ChartData2 {
  final String category;
  final String status;
  final double value;

  ChartData2(this.category, this.status, this.value);
}

// Define the data model
class ChartData {
  final String category;
  final int percentage;

  ChartData(this.category, this.percentage);
}

class InfoRow extends StatelessWidget {
  final String name;
  final IconData icon;
  const InfoRow({
    super.key,
    required this.name,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          backgroundColor: Colors.grey[200],
          radius: 20.0,
          child: Icon(
            icon,
            color: Colors.grey[600],
            size: 20.0,
          ),
        ),
        SizedBox(width: 12.w),
        Expanded(
          child: Text(
            name,
            style: TextStyle(
              fontSize: 14.sp,
              color: Colors.grey[700],
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}

class ShimmerLoadingWidget extends StatelessWidget {
  const ShimmerLoadingWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[200]!,
      child: SingleChildScrollView(
        child: Column(
          children: [
            // Shimmer for Image and Back Button
            Stack(
              children: [
                Container(
                  color: Colors.grey.withOpacity(0.9),
                  height: 280.h,
                  width: double.infinity,
                ),
                Positioned(
                    top: 20.h,
                    child: IconButton(
                        onPressed: () {},
                        icon: Icon(
                          Icons.arrow_back,
                          color: Colors.grey[300],
                        )))
              ],
            ),
            SizedBox(height: 20.h),

            // Shimmer for Plant Info Section
            Container(
              margin: EdgeInsets.symmetric(horizontal: 20.w),
              padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 8.h),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.grey[300],
                        radius: 24.0,
                      ),
                      SizedBox(width: 10.w),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              height: 16.h,
                              width: 100.w,
                              color: Colors.grey[300],
                            ),
                            SizedBox(height: 4.h),
                            Container(
                              height: 14.h,
                              width: 150.w,
                              color: Colors.grey[300],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16.h),

                  // Shimmer for Status Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        height: 14.h,
                        width: 50.w,
                        color: Colors.grey[300],
                      ),
                      Container(
                        height: 24.h,
                        width: 80.w,
                        color: Colors.grey[300],
                      ),
                    ],
                  ),
                ],
              ),
            ),

            SizedBox(height: 20.h),

            // Shimmer for Manager Info Section
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.person,
                        color: Colors.grey[300],
                        size: 24.0,
                      ),
                      SizedBox(width: 8.w),
                      Container(
                        height: 18.h,
                        width: 100.w,
                        color: Colors.grey[300],
                      ),
                    ],
                  ),
                  SizedBox(height: 8.h),
                  Container(
                    height: 2.h,
                    width: 115.w,
                    color: Colors.grey[300],
                  ),
                  SizedBox(height: 16.h),

                  // Shimmer for Manager Info Rows
                  const InfoShimmer(),
                  SizedBox(height: 12.h),
                  const InfoShimmer(),
                  SizedBox(height: 12.h),
                  const InfoShimmer(),
                ],
              ),
            ),

            SizedBox(height: 20.h),

            // Shimmer for Layout List
            SizedBox(
              height: 160.h,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 5,
                padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 10.h),
                itemBuilder: (context, index) {
                  return Padding(
                    padding: EdgeInsets.only(right: 10.w),
                    child: Container(
                      width: 120.w,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          Container(
                            height: 108.h,
                            width: double.infinity,
                            color: Colors.grey[300],
                          ),
                          SizedBox(height: 3.h),
                          Container(
                            height: 14.h,
                            width: 100.w,
                            color: Colors.grey[300],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class InfoShimmer extends StatelessWidget {
  const InfoShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          backgroundColor: Colors.grey[300],
          radius: 20.0,
        ),
        SizedBox(width: 12.w),
        Expanded(
          child: Container(
            height: 14.h,
            color: Colors.grey[300],
          ),
        ),
      ],
    );
  }
}

// Widget layoutContainer(String imagePath, String layoutName, int id) {
//   return Container(
//     decoration: BoxDecoration(
//       color: Colors.white,
//       borderRadius: const BorderRadius.all(Radius.circular(8)),
//       boxShadow: [
//         BoxShadow(
//           color: Colors.black.withOpacity(0.1),
//           spreadRadius: 2,
//           blurRadius: 2,
//           offset: const Offset(0, 3),
//         ),
//       ],
//     ),
//     child: Column(
//       children: [
//         Padding(
//           padding: EdgeInsets.symmetric(
//             horizontal: 10.w,
//             vertical: 5.h,
//           ),
//           child: Row(
//             mainAxisAlignment: MainAxisAlignment.spaceBetween,
//             children: [
//               Row(
//                 children: [
//                   CircleAvatar(
//                     radius: 16.r,
//                     backgroundImage: AssetImage(imagePath),
//                   ),
//                   SizedBox(width: 12.w),
//                   Text(layoutName, style: normalTextSTyle1),
//                 ],
//               ),
//               Text("Id : $id", style: normalTextSTyle1),
//             ],
//           ),
//         ),
//         const SizedBox(height: 10),
//         Container(
//           height: 200.h,
//           width: 360.w,
//           decoration: BoxDecoration(
//             color: Colors.white,
//             borderRadius: BorderRadius.circular(8.0),
//             image: DecorationImage(
//               image: AssetImage(imagePath),
//               fit: BoxFit.cover,
//             ),
//           ),
//         ),
//       ],
//     ),
//   );
// }

// class LayOutContainerList extends StatelessWidget {
//   final List<Map<String, String>> plants = List.generate(
//     10,
//     (index) => {
//       "imagePath": 'assets/images/layout.jpg',
//       "layout name": 'Layout Name',
//       "id": 'Id: $index',
//     },
//   );

//   LayOutContainerList({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Expanded(
//       child: ListView.builder(
//         itemCount: plants.length,
//         itemBuilder: (context, index) {
//           final plant = plants[index];
//           return Container(
//             height: 260.0.h,
//             margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
//             child: layoutContainer(
//                 "assets/images/layout.jpg", 'Layout Name', index),
//           );
//         },
//       ),
//     );
//   }
// }
