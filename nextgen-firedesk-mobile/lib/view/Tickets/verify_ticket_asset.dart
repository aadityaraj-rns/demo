import 'dart:math';

import 'package:dio/dio.dart';
import 'package:firedesk/res/api_urls/api_urls.dart';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/utils/snack_bar_utils.dart';
import 'package:firedesk/widgets/dialog/lat_long_update_dialog.dart';
import 'package:firedesk/widgets/dialog/location_disable_dialog.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:geolocator/geolocator.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vibration/vibration.dart';

final GlobalKey qrKey = GlobalKey(debugLabel: 'QRVerify');

class TicketAssetVerifyScreen extends StatefulWidget {
  final String plantId;
  final String ticketId;
  final String assetId;
  final List<String> ticketsQuestionList;
  final String lat;
  final String long;

  const TicketAssetVerifyScreen({
    super.key,
    required this.plantId,
    required this.ticketId,
    required this.assetId,
    required this.ticketsQuestionList,
    required this.lat,
    required this.long,
  });

  @override
  _TicketAssetVerifyScreenState createState() =>
      _TicketAssetVerifyScreenState();
}

class _TicketAssetVerifyScreenState extends State<TicketAssetVerifyScreen> {
  QRViewController? controller;
  bool _isScanning = false;
  final bool _isLoading = false;

  final dio = Dio();

  @override
  void initState() {
    super.initState();
    if (kDebugMode) {
      debugPrint("latitude is ${widget.lat}");
      debugPrint("asset id from previus screen is ${widget.assetId}");
      debugPrint("longitude is ${widget.long}");
    }
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen(
      (scanData) async {
        if (!_isScanning && scanData.code != null) {
          setState(() {
            _isScanning = true;
          });
          controller.pauseCamera();
          String qrData = scanData.code!;
          if (kDebugMode) {
            debugPrint("Scanned QR Code: $qrData");
          }

          final assetId = _extractAssetId(qrData);
          if (kDebugMode) {
            debugPrint("aset id gto from scanner is $assetId");
          }
          if (assetId != null) {
            await _handleVibration();

            if (kDebugMode) {
              debugPrint("Extracted Asset ID: $assetId");
            }

            bool isVerified = await _verifyAsset(assetId);
            if (isVerified) {
              try {
                if (widget.lat.isEmpty ||
                    widget.long.isEmpty ||
                    widget.lat == "null" ||
                    widget.long == "null") {
                  // SnackBarUtils.toastMessage(
                  //     "we got to know that you are doing work in the same location where we installed the asset");
                  Navigator.pushNamed(
                    context,
                    AppRoutes.ticketInspectionFormScreen,
                    arguments: {
                      "ticketsQuestionsList": widget.ticketsQuestionList,
                      "ticketId": widget.ticketId,
                      "plantId": widget.plantId,
                      "assetId": widget.assetId,
                      "geoCheck": "No Lat-Long",
                    },
                  ).then((_) {
                    setState(() {
                      _isScanning = false;
                    });
                  });
                } else {
                  // Proceed with location calculation if lat and long are available
                  Position position = await _determinePosition(context);
                  double currentLat = position.latitude;
                  double currentLong = position.longitude;

                  showLatLongUpdateDialog(context, () async {
                    if (kDebugMode) {
                      debugPrint(
                          "Current Position: latitude=$currentLat, longitude=$currentLong");
                    }

                    SharedPreferences prefs =
                        await SharedPreferences.getInstance();
                    String? accessToken = prefs.getString("accessToken");

                    if (widget.lat == "null" ||
                        widget.lat.isEmpty ||
                        widget.long.isEmpty ||
                        widget.long == "null") {
                      var response = await dio.get(
                        "${ApiUrls.fetchAssetInfoUrl}/$assetId",
                        options: Options(
                          headers: {
                            "Content-Type": "application/json",
                            'Authorization': 'Bearer $accessToken',
                          },
                        ),
                        data: {
                          "lat": currentLat.toString(),
                          "long": currentLong.toString(),
                        },
                      );
                      if (response.statusCode == 200) {
                        if (kDebugMode) {
                          debugPrint(
                              "Successfully got the asset complete info with location");
                          debugPrint(
                              "Successfully assigned the asset info to the model");
                        }
                      } else {
                        if (kDebugMode) {
                          debugPrint(
                              "Error occurred while getting the asset info with location");
                          debugPrint("Error details: ${response.data}");
                          debugPrint(
                              "Error status code: ${response.statusCode}");
                        }
                      }
                    }

                    double distance = (widget.lat == "null" ||
                            widget.lat.isEmpty ||
                            widget.long.isEmpty ||
                            widget.long == "null")
                        ? _calculateDistance(
                            currentLat,
                            currentLong,
                            currentLat,
                            currentLong,
                          )
                        : _calculateDistance(
                            currentLat,
                            currentLong,
                            double.parse(widget.lat),
                            double.parse(widget.long),
                          );
                    const double thresholdDistance = 10;

                    if (distance <= thresholdDistance) {
                      SnackBarUtils.toastMessage(
                          "we got to know that you are doing work in the same location where we installed the asset");
                      Navigator.pushNamed(
                        context,
                        AppRoutes.ticketInspectionFormScreen,
                        arguments: {
                          "ticketsQuestionsList": widget.ticketsQuestionList,
                          "ticketId": widget.ticketId,
                          "plantId": widget.plantId,
                          "assetId": widget.assetId,
                          "geoCheck": "Inside",
                        },
                      ).then((_) {
                        setState(() {
                          _isScanning = false;
                        });
                      });
                    } else {
                      SnackBarUtils.toastMessage(
                          "you are just away from the asset installed location by more than 10 meters");
                      Navigator.pushNamed(
                        context,
                        AppRoutes.ticketInspectionFormScreen,
                        arguments: {
                          "ticketsQuestionsList": widget.ticketsQuestionList,
                          "ticketId": widget.ticketId,
                          "plantId": widget.plantId,
                          "assetId": widget.assetId,
                          "geoCheck": "Outside",
                        },
                      ).then((_) {
                        setState(() {
                          _isScanning = false;
                        });
                      });
                      if (kDebugMode) {
                        debugPrint(
                            "Verification failed: Device is too far from the asset location.");
                      }
                      setState(() {
                        _isScanning = false;
                      });
                    }
                  }, () {
                    Navigator.of(context).pop();
                    Navigator.of(context).pop();
                  });
                }
              } catch (e) {
                if (kDebugMode) {
                  debugPrint("Error fetching location: $e");
                }
                setState(() {
                  _isScanning = false;
                });
              }
            } else {
              if (kDebugMode) {
                debugPrint(
                    "Asset verification failed and you are scanning the different asset");
              }
              setState(() {
                _isScanning = false;
              });
            }
          } else {
            if (kDebugMode) {
              debugPrint("Could not extract Asset ID from scanned data.");
            }
            setState(() {
              _isScanning = false;
            });
          }
        }
      },
    );
  }

  Future<bool> _verifyAsset(String assetId) async {
    if (kDebugMode) {
      debugPrint("asset verified successfully");
      debugPrint("asset id matched value is ${assetId == widget.assetId}");
    }
    if (assetId != widget.assetId) {
      SnackBarUtils.toastMessage(
          "asset verification not matched make sure you are scanning the correct asset");
      Navigator.pop(context);
    }
    return widget.assetId == assetId;
  }

  Future<void> _handleVibration() async {
    final bool? hasCustomVibration =
        await Vibration.hasCustomVibrationsSupport();
    if (hasCustomVibration == true) {
      Vibration.vibrate(duration: 300);
    } else {
      Vibration.vibrate();
      await Future.delayed(const Duration(milliseconds: 300));
      Vibration.vibrate();
    }
  }

  Future<Position> _determinePosition(BuildContext context) async {
    bool serviceEnabled;
    LocationPermission permission;

    // Check if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
       showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
        Navigator.of(context).pop();
      }, () async {
        Navigator.of(context).pop();
        Navigator.of(context).pop();
        await Geolocator.openLocationSettings();
      });
      return Future.error('Location services are disabled.');
    }

    // Check the current permission status
    permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      // Request location permission
      permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied) {
        Navigator.of(context).pop();
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      // Handle permanently denied permission
      showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
        Navigator.of(context).pop();
      }, () async {
        Navigator.of(context).pop();
        Navigator.of(context).pop();
        await Geolocator.openAppSettings();
      });
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    // Permissions are granted, fetch the location
    return await Geolocator.getCurrentPosition();
  }

// Function to calculate distance between two lat/long pairs using Haversine formula
  double _calculateDistance(
      double lat1, double lon1, double lat2, double lon2) {
    const double radiusEarth = 6371000; // Radius of Earth in meters
    double dLat = _toRadians(lat2 - lat1);
    double dLon = _toRadians(lon2 - lon1);

    double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(_toRadians(lat1)) *
            cos(_toRadians(lat2)) *
            sin(dLon / 2) *
            sin(dLon / 2);

    double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return radiusEarth * c;
  }

// Function to convert degrees to radians
  double _toRadians(double degree) {
    return degree * pi / 180;
  }

  String? _extractAssetId(String qrData) {
    final regex = RegExp(r'Asset ID: (\w+)');
    final match = regex.firstMatch(qrData);
    if (match != null && match.groupCount >= 1) {
      return match.group(1);
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(45.h),
        child: Material(
          color: Colors.transparent,
          elevation: 2,
          child: AppBar(
            iconTheme: const IconThemeData(
              color: Colors.white,
            ),
            backgroundColor: basicColor,
            title: Text(
              "Verify Asset",
              style: appBarTextSTyle,
            ),
            centerTitle: true,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(0.0),
                bottomRight: Radius.circular(0.0),
              ),
            ),
          ),
        ),
      ),
      body: Stack(
        children: [
          QRView(
            key: qrKey,
            onQRViewCreated: _onQRViewCreated,
            overlay: QrScannerOverlayShape(
              borderColor: basicColor,
              borderRadius: 10,
              borderLength: 30,
              borderWidth: 10,
              cutOutSize: 300,
            ),
          ),
          if (_isLoading)
            const Positioned.fill(
              child: Center(
                child: CircularProgressIndicator(),
              ),
            ),
        ],
      ),
    );
  }
}
