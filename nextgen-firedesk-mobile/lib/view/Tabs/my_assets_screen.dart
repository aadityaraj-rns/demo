import "package:firedesk/data/app_exceptions.dart";
import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/models/data_models/MyAsset_Models/myassets_model.dart";
import "package:firedesk/res/colors/colors.dart";
import "package:firedesk/res/components/general_exception_widget.dart";
import "package:firedesk/res/components/internet_exception.dart";
import "package:firedesk/res/components/request_timeout.dart";
import "package:firedesk/res/components/server_exception_widget.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/res/styles/text_style.dart";
import "package:firedesk/view_models/providers/asset_list_provider.dart";
import "package:firedesk/widgets/date_formatter.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:lottie/lottie.dart";
import "package:provider/provider.dart";
import "package:shimmer/shimmer.dart";

class MyAssetsScreen extends StatefulWidget {
  const MyAssetsScreen({super.key});
  @override
  State<MyAssetsScreen> createState() => _MyAssetsScreenState();
}

class _MyAssetsScreenState extends State<MyAssetsScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final ScrollController _searchScrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) {
        final assetsProvider =
            Provider.of<AssetInfoProvider>(context, listen: false);
        assetsProvider.currentPage = 1;
        assetsProvider.isSearchBarEnabled = false;
        assetsProvider.searchedAssets.clear();
        // assetsProvider.myAssets.clear();
        // assetsProvider.fetchMyAssets(context);
        _searchController.addListener(() {
          if (_searchController.text.isEmpty) {
            assetsProvider.isSearchBarEnabled = false;
            assetsProvider.searchedAssets.clear();
          }
        });
        _scrollController.addListener(() {
          if (_scrollController.position.atEdge &&
              assetsProvider.isSearchBarEnabled == false) {
            bool isBottom = _scrollController.position.pixels ==
                _scrollController.position.maxScrollExtent;
            if (isBottom) {
              assetsProvider.incrementPage(context);
            }
          }
        });

        _searchScrollController.addListener(
          () {
            if (_searchScrollController.position.atEdge &&
                assetsProvider.isSearchBarEnabled == true) {
              bool isBottom = _searchScrollController.position.pixels ==
                  _searchScrollController.position.maxScrollExtent;
              if (isBottom) {
                assetsProvider.incrementPageForSearch(context);
                assetsProvider.fetchSearchedMyAssets(
                    context, _searchController.text);
              }
            }
          },
        );
      },
    );
  }

  @override
  void dispose() {
    super.dispose();
    _searchController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AssetInfoProvider>(
      builder: (context, assetsProvider, _) {
        if (kDebugMode) {
          debugPrint(
              "came inside build function and loading value is ${assetsProvider.isLoading}");
        }
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
                  "My Assets",
                  style: appBarTextSTyle,
                ),
                centerTitle: true,
              ),
            ),
          ),
          body: SafeArea(
            child: Column(
              children: [
                SizedBox(
                  height: 10.h,
                ),
                Container(
                  margin: EdgeInsets.symmetric(horizontal: 10.w),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(22.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.1),
                        spreadRadius: 1,
                        blurRadius: 2,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search...',
                      hintStyle: TextStyle(color: Colors.grey[500]),
                      contentPadding: const EdgeInsets.symmetric(
                          vertical: 12, horizontal: 16),
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12.0),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12.0),
                        borderSide:
                            const BorderSide(color: Colors.grey, width: 1.5),
                      ),
                      suffixIcon: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            onPressed: () {
                              assetsProvider.isSearchBarEnabled = false;
                              _searchController.clear();
                              assetsProvider.searchedAssets.clear();
                            },
                            icon: Icon(
                              Icons.close,
                              color: darkGreyColor,
                            ),
                          ),
                          const SizedBox(width: 10),
                          SizedBox(
                            height: kMinInteractiveDimension,
                            child: GestureDetector(
                              onTap: () {
                                assetsProvider.isSearchBarEnabled = true;
                                assetsProvider.fetchSearchedMyAssets(
                                    context, _searchController.text);
                              },
                              child: Container(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 15),
                                decoration: const BoxDecoration(
                                  color: Colors.blue,
                                  borderRadius: BorderRadius.only(
                                    bottomRight: Radius.circular(12.0),
                                    topRight: Radius.circular(12.0),
                                  ),
                                ),
                                child: const Center(
                                  child: Text(
                                    "Search",
                                    style: TextStyle(
                                      color: Colors.white,
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
                SizedBox(
                  height: 10.h,
                ),
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.w),
                    child: assetsProvider.isSearchBarEnabled
                        ? buildSearchAssetsListView()
                        : buildAssetsListView(),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget buildAssetsListView() {
    return Consumer<AssetInfoProvider>(
      builder: (context, assetsProvider, _) {
        switch (assetsProvider.fetchAssetsStatus) {
          case Status.LOADING:
            return ListView.builder(
              itemCount: 5,
              itemBuilder: (context, index) {
                return buildShimmerNewAssetCard();
              },
            );

          case Status.ERROR:
            if (assetsProvider.fetchAssetsError == InternetException) {
              return InterNetExceptionWidget(
                onPress: () {
                  assetsProvider.fetchMyAssets(context);
                },
              );
            } else if (assetsProvider.fetchAssetsError == RequestTimeOut) {
              return RequestTimeOutWidget(
                onPress: () {
                  assetsProvider.fetchMyAssets(context);
                },
              );
            } else if (assetsProvider.fetchAssetsError == ServerException) {
              return ServerExceptionWidget(
                onPress: () {
                  assetsProvider.fetchMyAssets(context);
                },
              );
            } else {
              return GeneralExceptionWidget(
                onPress: () {
                  assetsProvider.fetchMyAssets(context);
                },
              );
            }

          case Status.COMPLETED:
            if (assetsProvider.myAssets.isEmpty) {
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Lottie.asset(
                    "assets/jsons/firedesk_empty.json",
                    height: 200.h,
                    width: 300.w,
                  ),
                  SizedBox(height: 5.h),
                  Text(
                    "No Assets Found",
                    style:
                        TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 10.h),
                ],
              );
            }
            return ListView.builder(
              controller: _scrollController,
              itemCount: assetsProvider.myAssets.length +
                  (assetsProvider.loadingMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == assetsProvider.myAssets.length) {
                  return const Center(
                    child: CircularProgressIndicator(
                      color: Colors.blueAccent,
                    ),
                  );
                }
                MyAsset asset = assetsProvider.myAssets[index];

                print(
                    "next inspection service date is ${asset.serviceDates!.nextServiceDates!.inspection.toString()}");
                return GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, AppRoutes.assetdetail,
                        arguments: {
                          "assetId": asset.id,
                          "cameFromScanner": false,
                        });
                  },
                  child: newAssetCard(
                    imagePath: asset.productId!.image1 ?? "",
                    assetId: asset.assetId ?? "",
                    building: asset.building ?? "",
                    lastServiceDate: [
                      asset.serviceDates!.lastServiceDates!.inspection == null
                          ? "Inspection - NA"
                          : "Insepction - ${customDateFormatter(asset.serviceDates!.lastServiceDates!.inspection.toString())}",
                      asset.serviceDates!.lastServiceDates!.maintenance == null
                          ? "Maintainance - NA"
                          : "Maintainance - ${customDateFormatter(asset.serviceDates!.lastServiceDates!.maintenance.toString())}",
                      asset.serviceDates!.lastServiceDates!.testing == null
                          ? "Testing - NA"
                          : "Testing - ${customDateFormatter(asset.serviceDates!.lastServiceDates!.testing.toString())}"
                    ],
                    nextServiceDate: [
                      asset.serviceDates!.nextServiceDates!.inspection == null
                          ? "Inspection - NA"
                          : "Inspection - ${customDateFormatter(asset.serviceDates!.nextServiceDates!.inspection.toString())}",
                      asset.serviceDates!.nextServiceDates!.maintenance == null
                          ? "Maintainance - NA"
                          : "Maintainance - ${customDateFormatter(asset.serviceDates!.nextServiceDates!.maintenance.toString())}",
                      asset.serviceDates!.nextServiceDates!.testing == null
                          ? "Testing - NA"
                          : "Testing - ${customDateFormatter(asset.serviceDates!.nextServiceDates!.testing.toString())}"
                    ],
                    type: asset.productId!.type ?? "NA",
                    location: asset.location ?? "NA",
                    healthStatus: asset.healthStatus ?? "NA",
                    assetName: asset.productId!.productName ?? "NA",
                     capacity: asset.productId!.capacity ?? "NA",
                  ),
                );
              },
            );
          default:
            // Fallback case
            return ListView.builder(
              itemCount: 5,
              itemBuilder: (context, index) {
                return buildShimmerNewAssetCard();
              },
            );
        }
      },
    );
  }

  Widget buildSearchAssetsListView() {
    return Consumer<AssetInfoProvider>(
      builder: (context, assetsProvider, _) {
        switch (assetsProvider.fetchSearchedAssetsStatus) {
          case Status.LOADING:
            return ListView.builder(
              itemCount: 5,
              itemBuilder: (context, index) {
                return buildShimmerNewAssetCard();
              },
            );

          case Status.ERROR:
            if (assetsProvider.fetchSearchedAssetsError == InternetException) {
              return InterNetExceptionWidget(
                onPress: () {
                  assetsProvider.fetchSearchedMyAssets(
                      context, _searchController.text);
                },
              );
            } else if (assetsProvider.fetchSearchedAssetsError ==
                RequestTimeOut) {
              return RequestTimeOutWidget(
                onPress: () {
                  assetsProvider.fetchSearchedMyAssets(
                      context, _searchController.text);
                },
              );
            } else if (assetsProvider.fetchSearchedAssetsError ==
                ServerException) {
              return ServerExceptionWidget(
                onPress: () {
                  assetsProvider.fetchSearchedMyAssets(
                      context, _searchController.text);
                },
              );
            } else {
              return GeneralExceptionWidget(
                onPress: () {
                  assetsProvider.fetchSearchedMyAssets(
                      context, _searchController.text);
                },
              );
            }

          case Status.COMPLETED:
            // Show the assets list if data is successfully loaded
            if (assetsProvider.searchedAssets.isEmpty) {
              // Show "No Assets Found" if the list is empty
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Lottie.asset(
                    "assets/jsons/firedesk_empty.json",
                    height: 200.h,
                    width: 300.w,
                  ),
                  SizedBox(height: 5.h),
                  Text(
                    "No Assets Found",
                    style:
                        TextStyle(fontSize: 20.sp, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 10.h),
                ],
              );
            }

            // Render the searched assets list
            return ListView.builder(
              controller: _searchScrollController,
              itemCount: assetsProvider.searchedAssets.length +
                  (assetsProvider.searchAssetsLoadingMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == assetsProvider.searchedAssets.length) {
                  // Show a "loading more" indicator at the bottom
                  return const Center(
                    child: CircularProgressIndicator(
                      color: Colors.blueAccent,
                    ),
                  );
                }
                MyAsset asset = assetsProvider.searchedAssets[index];

                print(
                    "next service inspection date is ${asset.serviceDates!.nextServiceDates!.inspection}");
                return GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, AppRoutes.assetdetail,
                        arguments: {
                          "assetId": asset.id,
                          "cameFromScanner": false
                        });
                  },
                  child: newAssetCard(
                    imagePath: asset.productId!.image1 ?? "",
                    assetId: asset.assetId ?? "",
                    building: asset.building ?? "",
                    lastServiceDate: [
                      asset.serviceDates!.lastServiceDates!.inspection == null
                          ? "Inspection - NA"
                          : "Insepction - ${customDateFormatter(asset.serviceDates!.lastServiceDates!.inspection.toString())}",
                      asset.serviceDates!.lastServiceDates!.maintenance == null
                          ? "Maintainance - NA"
                          : "Maintainance - ${customDateFormatter(asset.serviceDates!.lastServiceDates!.maintenance.toString())}",
                      asset.serviceDates!.lastServiceDates!.testing == null
                          ? "Testing - NA"
                          : "Testing - ${customDateFormatter(asset.serviceDates!.lastServiceDates!.testing.toString())}"
                    ],
                    nextServiceDate: [
                      asset.serviceDates!.nextServiceDates!.inspection == null
                          ? "Inspection - NA"
                          : "Insepction - ${customDateFormatter(asset.serviceDates!.nextServiceDates!.inspection.toString())}",
                      asset.serviceDates!.nextServiceDates!.maintenance == null
                          ? "Maintainance - NA"
                          : "Maintainance - ${customDateFormatter(asset.serviceDates!.nextServiceDates!.maintenance.toString())}",
                      asset.serviceDates!.nextServiceDates!.testing == null
                          ? "Testing - NA"
                          : "Testing - ${customDateFormatter(asset.serviceDates!.nextServiceDates!.testing.toString())}"
                    ],
                    type: asset.productId!.type ?? "NA",
                    location: asset.plantId!.address ?? "NA",
                    healthStatus: asset.healthStatus ?? "NA",
                    assetName: asset.productId!.productName ?? "NA",
                    capacity: asset.productId!.capacity ?? "NA",
                  ),
                );
              },
            );
          default:
            return const Center(
              child: Text("Unexpected status. Please try again."),
            );
        }
      },
    );
  }

  Widget newAssetCard({
    required String imagePath,
    required String assetId,
    required String building,
    required List<String> lastServiceDate,
    required List<String> nextServiceDate,
    required String type,
    required String location,
    required String healthStatus,
    required String assetName,
    required String capacity,
  }) {
    return Card(
      color: Colors.white,
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      margin: EdgeInsets.symmetric(vertical: 5.h, horizontal: 0.w),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 5.h),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 100.w,
                  height: 100.h,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.blueGrey.withAlpha(20)),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: imagePath.isEmpty
                        ? Image.asset(
                            'assets/images/fire-extinguisher.png', // <-- your fallback asset image
                            fit: BoxFit.contain,
                          )
                        : Image.network(
                            imagePath,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Image.asset(
                                'assets/images/fire-extinguisher.png', // <-- fallback asset on error
                                fit: BoxFit.cover,
                              );
                            },
                          ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              assetId,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: Colors.blueGrey[800],
                              ),
                            ),
                          ),
                          Row(
                            children: [
                              CircleAvatar(
                                backgroundColor: healthStatus == 'Healthy'
                                    ? Colors.green[700]
                                    : healthStatus == 'AttentionRequired'
                                        ? basicColor
                                        : Colors.red[700],
                                radius: 6,
                              ),
                              SizedBox(
                                width: 2.w,
                              ),
                              Text(
                                healthStatus == 'Healthy'
                                    ? "Healthy"
                                    : healthStatus == 'AttentionRequired'
                                        ? "Attention Required"
                                        : "Not Working",
                                style: TextStyle(
                                    color: healthStatus == 'Healthy'
                                        ? Colors.green[700]
                                        : healthStatus == 'AttentionRequired'
                                            ? basicColor
                                            : Colors.red[700],
                                    fontSize: 14.sp,
                                    fontWeight: FontWeight.w500,
                                    overflow: TextOverflow.ellipsis),
                              )
                            ],
                          ),
                        ],
                      ),
                      Text(
                        type.isNotEmpty ? "$assetName,$type" : assetName,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Colors.blueGrey[800],
                        ),
                      ),
                      SizedBox(
                        height: 4.h,
                      ),
                      Row(
                        children: [
                          Icon(
                            Icons.home,
                            color: Colors.blueGrey[600],
                            size: 15,
                          ),
                          SizedBox(
                            width: 5.w,
                          ),
                          Expanded(
                            child: Text(
                              building,
                              style: TextStyle(
                                fontSize: 13.sp,
                                fontWeight: FontWeight.w500,
                                color: Colors.blueGrey[600],
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(
                        height: 3.h,
                      ),
                      Row(
                        children: [
                          Icon(Icons.location_on,
                              color: Colors.blueGrey[300], size: 16),
                          SizedBox(width: 5.w),
                          Expanded(
                            child: Text(
                              location,
                              style: TextStyle(
                                fontSize: 12.sp,
                                fontWeight: FontWeight.w400,
                                color: Colors.blueGrey[600],
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(
                        height: 3.h,
                      ),
                      Row(
                        children: [
                          // Icon(Icons.freq,
                          //     color: Colors.blueGrey[300], size: 16),
                          Icon(
                            Icons.storage, // Best fit for data/storage capacity
                            size: 20.sp,
                            color: Colors.blueGrey[100],
                          ),
                          SizedBox(width: 5.w),
                          Expanded(
                            child: Text(
                              capacity,
                              style: TextStyle(
                                fontSize: 12.sp,
                                fontWeight: FontWeight.w400,
                                color: Colors.blueGrey[600],
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: 5.h),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                NonSelectableDropdown(
                  items: lastServiceDate,
                  hintText: "Last Service Dates",
                ),
                NonSelectableDropdown(
                  items: nextServiceDate,
                  hintText: "Next Service Dates",
                )
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget buildShimmerNewAssetCard() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 1.w, vertical: 3.h),
      child: Container(
        height: 185.h,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              spreadRadius: 2,
              blurRadius: 2,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 5.h),
          child: Column(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Image shimmer
                  Shimmer.fromColors(
                    baseColor: Colors.grey[300]!,
                    highlightColor: Colors.grey[100]!,
                    child: Container(
                      width: 100.w,
                      height: 100.h,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // ID shimmer
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Shimmer.fromColors(
                              baseColor: Colors.grey[300]!,
                              highlightColor: Colors.grey[100]!,
                              child: Container(
                                height: 20.h,
                                width: 100.w,
                                color: Colors.white,
                              ),
                            ),
                            CircleAvatar(
                              backgroundColor: Colors.grey[300],
                              radius: 6,
                            ),
                          ],
                        ),
                        SizedBox(height: 5.h),
                        // Building shimmer
                        Row(
                          children: [
                            Icon(Icons.home, color: Colors.grey[300], size: 15),
                            SizedBox(width: 5.w),
                            Shimmer.fromColors(
                              baseColor: Colors.grey[300]!,
                              highlightColor: Colors.grey[100]!,
                              child: Container(
                                height: 15.h,
                                width: 120.w,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 5.h),
                        // Location shimmer
                        Row(
                          children: [
                            Icon(Icons.location_on,
                                color: Colors.grey[300], size: 16),
                            SizedBox(width: 5.w),
                            Expanded(
                              child: Shimmer.fromColors(
                                baseColor: Colors.grey[300]!,
                                highlightColor: Colors.grey[100]!,
                                child: Container(
                                  height: 15.h,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(Icons.calendar_today,
                                color: Colors.grey[300], size: 16),
                            const SizedBox(width: 4),
                            Shimmer.fromColors(
                              baseColor: Colors.grey[300]!,
                              highlightColor: Colors.grey[100]!,
                              child: Container(
                                height: 15.h,
                                width: 150.w,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 4.h),
                        // Next Service Date shimmer
                        Row(
                          children: [
                            Icon(Icons.calendar_today,
                                color: Colors.grey[300], size: 16),
                            const SizedBox(width: 4),
                            Shimmer.fromColors(
                              baseColor: Colors.grey[300]!,
                              highlightColor: Colors.grey[100]!,
                              child: Container(
                                height: 15.h,
                                width: 150.w,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 5.h),
              Container(
                color: Colors.grey[50],
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Shimmer.fromColors(
                      baseColor: Colors.grey[300]!,
                      highlightColor: Colors.grey[100]!,
                      child: Chip(
                        label: Container(
                          height: 10.h,
                          width: 100.w,
                          color: Colors.white,
                        ),
                        backgroundColor: Colors.grey[300],
                      ),
                    ),
                    SizedBox(width: 10.w),
                    Shimmer.fromColors(
                      baseColor: Colors.grey[300]!,
                      highlightColor: Colors.grey[100]!,
                      child: Chip(
                        label: Container(
                          height: 10.h,
                          width: 100.w,
                          color: Colors.white,
                        ),
                        backgroundColor: Colors.grey[300],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildBigAssetCard(MyAsset asset) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
      child: GestureDetector(
        onTap: () {
          Navigator.pushNamed(context, AppRoutes.assetdetail,
              arguments: {"assetId": asset.id, "cameFromScanner": false});
        },
        child: Container(
          height: 280.h,
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(8.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                spreadRadius: 2,
                blurRadius: 2,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Stack(
            children: [
              Container(
                height: 240.h,
                width: 380.w,
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8.0),
                  image: DecorationImage(
                    image: NetworkImage("${asset.productId!.image1}"),
                    fit: BoxFit.fill,
                  ),
                ),
              ),
              Positioned(
                top: 220.h,
                left: 0,
                right: 0,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        spreadRadius: 2,
                        blurRadius: 2,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Padding(
                        padding: EdgeInsets.symmetric(
                            horizontal: 5.w, vertical: 10.h),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "${asset.productId!.productName}",
                              style: const TextStyle(
                                color: Colors.black,
                                fontWeight: FontWeight.w600,
                                fontSize: 14,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              "${asset.building}",
                              style: TextStyle(
                                color: Colors.grey,
                                fontWeight: FontWeight.w500,
                                fontSize: 12.sp,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.symmetric(
                            horizontal: 5.w, vertical: 10.h),
                        child: Column(
                          children: [
                            RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: "MFD: ",
                                    style: TextStyle(
                                      color: Colors.green,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 14.sp,
                                    ),
                                  ),
                                  TextSpan(
                                    text: customDateFormatter(
                                        asset.installDate.toString()),
                                    style: TextStyle(
                                      color: Colors.grey,
                                      fontWeight: FontWeight.w500,
                                      fontSize: 14.sp,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: "EXD: ",
                                    style: TextStyle(
                                      color: Colors.red,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 14.sp,
                                    ),
                                  ),
                                  TextSpan(
                                    text: customDateFormatter(
                                        asset.createdAt.toString()),
                                    style: TextStyle(
                                      color: Colors.grey,
                                      fontWeight: FontWeight.w500,
                                      fontSize: 14.sp,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
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
    );
  }

  Widget buildShimmerLine({double width = double.infinity}) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 2.0.h),
      child: Shimmer.fromColors(
        baseColor: Colors.grey[300]!,
        highlightColor: Colors.grey[100]!,
        child: Container(
          height: 14.0.h,
          width: width,
          color: Colors.grey[300],
        ),
      ),
    );
  }

  Widget buildAssetCard(MyAsset asset) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, AppRoutes.assetdetail,
            arguments: {"assetId": asset.id, "cameFromScanner": false});
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 1,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              height: 160.h,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8.0),
                image: DecorationImage(
                  image: NetworkImage("${asset.productId!.image1}"),
                  fit: BoxFit.fill,
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 5.w, vertical: 4.h),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "${asset.productId!.productName}",
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.w600,
                      fontSize: 12.sp,
                    ),
                  ),
                  Text(
                    "${asset.building}",
                    style: TextStyle(
                      color: Colors.grey,
                      fontWeight: FontWeight.w500,
                      fontSize: 12.sp,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 3.h),
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: "MFD: ",
                          style: TextStyle(
                            color: Colors.green,
                            fontWeight: FontWeight.w600,
                            fontSize: 14.sp,
                          ),
                        ),
                        TextSpan(
                          text:
                              customDateFormatter(asset.installDate.toString()),
                          style: TextStyle(
                            color: Colors.grey,
                            fontWeight: FontWeight.w500,
                            fontSize: 14.sp,
                          ),
                        ),
                      ],
                    ),
                  ),
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: "EXD: ",
                          style: TextStyle(
                            color: Colors.red,
                            fontWeight: FontWeight.w600,
                            fontSize: 14.sp,
                          ),
                        ),
                        TextSpan(
                          text: customDateFormatter(asset.createdAt.toString()),
                          style: TextStyle(
                            color: Colors.grey, // Light grey color for the date
                            fontWeight: FontWeight
                                .w500, // Lighter font weight for the date
                            fontSize: 14.sp, // Keep the same font size
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget buildShimmerAssetCard() {
    return GestureDetector(
      onTap: () {},
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 1,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              height: 160.h,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8.0),
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 5.w, vertical: 4.h),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  buildShimmerLine(width: 150.w),
                  SizedBox(height: 1.h),
                  buildShimmerLine(width: 150.w),
                  SizedBox(height: 1.h),
                  buildShimmerLine(width: 150.w),
                  SizedBox(height: 1.h),
                  buildShimmerLine(width: 150.w),
                  SizedBox(height: 1.h),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class NonSelectableDropdown extends StatefulWidget {
  final List<String> items;
  final String hintText;

  const NonSelectableDropdown({
    super.key,
    required this.items,
    required this.hintText,
  });

  @override
  State<NonSelectableDropdown> createState() => _NonSelectableDropdownState();
}

class _NonSelectableDropdownState extends State<NonSelectableDropdown> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _isExpanded = !_isExpanded;
        });
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 3.h),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: Colors.grey[300]!,
            width: 1.0,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GestureDetector(
              onTap: () {
                setState(() {
                  _isExpanded = !_isExpanded;
                });
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    widget.hintText,
                    style: const TextStyle(
                      color: Colors.black,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Icon(
                    _isExpanded
                        ? Icons.keyboard_arrow_up
                        : Icons.keyboard_arrow_down,
                    color: Colors.grey[600],
                  ),
                ],
              ),
            ),
            if (_isExpanded)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: widget.items.map((item) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4.0),
                    child: GestureDetector(
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("This dropdown is non-selectable."),
                          ),
                        );
                      },
                      child: Text(
                        item,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
          ],
        ),
      ),
    );
  }
}
