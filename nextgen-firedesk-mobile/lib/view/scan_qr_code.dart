import 'dart:async';
import 'package:firedesk/res/colors/colors.dart';
import 'package:firedesk/res/routes/app_routes.dart';
import 'package:firedesk/res/styles/text_style.dart';
import 'package:firedesk/utils/snack_bar_utils.dart';
import 'package:firedesk/view_models/providers/asset_list_provider.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:vibration/vibration.dart';

final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');

class FullScreenScanner extends StatefulWidget {
  final bool cameFromAssetDetailsScreen;
  final bool cameFromRejectedService;
  final String geoCheck;
  final bool comingFromServiceDetail;
  final String serviceFormId;
  final String assetId;

  const FullScreenScanner({
    super.key,
    required this.cameFromAssetDetailsScreen,
    required this.cameFromRejectedService,
    required this.geoCheck,
    required this.comingFromServiceDetail,
    required this.serviceFormId,
    required this.assetId,
  });
  @override
  _FullScreenScannerState createState() => _FullScreenScannerState();
}

class _FullScreenScannerState extends State<FullScreenScanner> {
  QRViewController? controller;
  bool _isScanning = false;
  final bool _isLoading = false;
  String? scannedId;
  late StreamSubscription _scanSubscription;

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  void _onQRViewCreated(QRViewController controller) {
    if (kDebugMode) {
      debugPrint("came inside the qr code scanning function");
    }
    this.controller = controller;

    _scanSubscription = controller.scannedDataStream.listen(
      (scanData) async {
        if (!_isScanning && scanData.code != null) {
          setState(() {
            _isScanning = true;
          });
          String qrData = scanData.code!;
          if (kDebugMode) {
            debugPrint("Scanned QR Code: $qrData");
          }

          try {
            final assetId = _extractAssetId(qrData);
            print("assetId after extracting is $assetId");
            if (assetId != null) {
              final bool hasCustomVibration =
                  await Vibration.hasCustomVibrationsSupport();
              if (hasCustomVibration == true) {
                Vibration.vibrate(duration: 300);
              } else {
                Vibration.vibrate();
                await Future.delayed(const Duration(milliseconds: 300));
                Vibration.vibrate();
              }
              if (kDebugMode) {
                debugPrint("Extracted Asset ID: $assetId");
              }

              if (widget.comingFromServiceDetail ||
                  widget.cameFromAssetDetailsScreen) {
                verifyAndNavigate(
                    scannedAssetId: assetId, assetId: widget.assetId);
              } else {
                Navigator.pushReplacementNamed(context, AppRoutes.assetdetail,
                    arguments: {"assetId": assetId, "cameFromScanner": true});
              }
            } else {
              if (kDebugMode) {
                debugPrint("Could not extract Asset ID from scanned data.");
              }
            }
          } catch (e) {
            if (kDebugMode) {
              debugPrint("Error handling scanned data: $e");
            }
          } finally {
            controller.pauseCamera();
            _scanSubscription.cancel();
            setState(() {
              _isScanning = false;
            });
          }
        }
      },
    );
  }

  void verifyAndNavigate(
      {required String scannedAssetId, required String assetId}) {
    if (scannedAssetId == assetId) {
      Navigator.pushNamed(context, AppRoutes.inspectionFormScreen, arguments: {
        "serviceFormId": widget.serviceFormId,
        "cameFromRejectedService": widget.cameFromRejectedService,
        "geoCheck": widget.geoCheck,
        "cameFromAssetDetails": widget.cameFromAssetDetailsScreen,
      });
    } else {
      SnackBarUtils.toastMessage(
          "Asset did not matched,please scan the correct one");
      Navigator.pop(context);
    }
  }

  String? _extractAssetId(String qrData) {
    print("qr code response data is $qrData");
    final regex = RegExp(r'Asset ID: (\w+)');
    final match = regex.firstMatch(qrData);
    if (match != null && match.groupCount >= 1) {
      if (kDebugMode) {
        debugPrint("Matched Asset ID: ${match.group(1)}");
      }
      return match.group(1);
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AssetInfoProvider>(
        builder: (context, assetInforProvider, _) {
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
                "Scan QR Code",
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
                borderColor: Colors.yellow,
                borderRadius: 10,
                borderLength: 30,
                borderWidth: 5,
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
    });
  }
}
