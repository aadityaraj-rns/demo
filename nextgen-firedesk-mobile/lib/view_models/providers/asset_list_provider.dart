import "dart:convert";

import "package:dio/dio.dart";
import "package:firedesk/data/app_exceptions.dart";
import "package:firedesk/data/reponse/status.dart";
import "package:firedesk/models/data_models/MyAsset_Models/asset_info_model.dart";
import "package:firedesk/models/data_models/MyAsset_Models/myassets_model.dart";
import "package:firedesk/models/data_models/MyAsset_Models/update_location_asset_model.dart";
import "package:firedesk/models/data_models/Service_Models/group_service_details_model.dart";
import "package:firedesk/repository/assets/my_assets_repository.dart";
import "package:firedesk/res/api_urls/api_urls.dart";
import "package:firedesk/res/routes/app_routes.dart";
import "package:firedesk/utils/auth_manager.dart";
import "package:firedesk/utils/snack_bar_utils.dart";
import "package:firedesk/widgets/dialog/lat_long_update_dialog.dart";
import "package:firedesk/widgets/dialog/location_disable_dialog.dart";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:geolocator/geolocator.dart";

class AssetInfoProvider with ChangeNotifier {
  final MyAssetsRepository _apiService = MyAssetsRepository();

  bool _isSearchBarEnabled = false;

  final dio = Dio();

  int _currentPage = 1;
  int get currentPage => _currentPage;
  set currentPage(int value) {
    _currentPage = value;
    notifyListeners();
  }

  void incrementPage(context) {
    currentPage++;
    fetchMyAssets(context);
  }

  int _currentPageForSearch = 1;
  int get currentPageForSearch => _currentPageForSearch;
  set currentPageForSearch(int value) {
    _currentPageForSearch = value;
    notifyListeners();
  }

  void incrementPageForSearch(context) {
    currentPageForSearch++;
    fetchMyAssets(context);
  }

  final int _limit = 5;
  int get limit => _limit;

  bool _isLoading = false;
  bool _isSearchingAssetsLoading = false;
  bool get isSearchingAssetsLoading => _isSearchingAssetsLoading;
  set isSearchingAssetsLoading(bool value) {
    _isSearchingAssetsLoading = value;
    notifyListeners();
  }

  bool _loadingMore = false;
  bool get loadingMore => _loadingMore;
  set loadingMore(bool value) {
    _loadingMore = value;
    notifyListeners();
  }

  bool _searchAssetsLoading = false;
  bool get searchAssetsLoading => _searchAssetsLoading;
  set searchAssetsLoading(bool value) {
    _searchAssetsLoading = value;
    notifyListeners();
  }

  bool _searchAssetsLoadingMore = false;
  bool get searchAssetsLoadingMore => _searchAssetsLoadingMore;
  set searchAssetsLoadingMore(bool value) {
    _searchAssetsLoadingMore = value;
    notifyListeners();
  }

  List<MyAsset> _myAssets = [];
  // List<MyAsset> _myAssetsLocal = [];
  GroupServiceDetails? _assetInfo;

  List<MyAsset> _searchedAssets = [];
  List<MyAsset> get searchedAssets => _searchedAssets;
  set searchedAssets(List<MyAsset> value) {
    _searchedAssets = value;
    notifyListeners();
  }

  bool get isSearchBarEnabled => _isSearchBarEnabled;
  bool get isLoading => _isLoading;
  GroupServiceDetails? get assetInfo => _assetInfo;
  List<MyAsset> get myAssets => _myAssets;
  // List<MyAsset> get myAssetsLocal => _myAssetsLocal;

  set isSearchBarEnabled(bool value) {
    _isSearchBarEnabled = value;
    notifyListeners();
  }

  set setMyAssets(List<MyAsset> value) {
    _myAssets = value;
    notifyListeners();
  }

  set setMyAssetInfo(GroupServiceDetails? newAssetInfo) {
    _assetInfo = newAssetInfo;
    notifyListeners();
  }

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void updateLatLong(String lat,String long){
    if (kDebugMode) {
      debugPrint("updating lat long in asset info provider");
    }
    if (_assetInfo != null && _assetInfo!.assets != null && _assetInfo!.assets!.isNotEmpty) {
      _assetInfo!.assets![0].lat = lat;
      _assetInfo!.assets![0].long = long;
      notifyListeners();
    } else {
      if (kDebugMode) {
        debugPrint("Asset info or assets list is null or empty");
      }
    }
  }

  Future<Position> _determinePosition(BuildContext context) async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
        Navigator.of(context)
            .popUntil(ModalRoute.withName(AppRoutes.bottombar));
      }, () async {
        Navigator.of(context).pop();
        Navigator.of(context)
            .popUntil(ModalRoute.withName(AppRoutes.bottombar));
        await Geolocator.openLocationSettings();
      });
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied) {
        Navigator.of(context)
            .popUntil(ModalRoute.withName(AppRoutes.bottombar));
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      if (kDebugMode) {
        debugPrint("calling LocationPermission.deniedForever method");
      }
      showLocationDisabledDialog(context,(){
        Navigator.of(context).pop();
        Navigator.of(context)
            .popUntil(ModalRoute.withName(AppRoutes.bottombar));
      }, () async {
        Navigator.of(context).pop();
        Navigator.of(context)
            .popUntil(ModalRoute.withName(AppRoutes.bottombar));
        await Geolocator.openAppSettings();
      });
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    // showLatLongUpdateDialog(context, ,onCancel onOpenSettings)

    return await Geolocator.getCurrentPosition();
  }

  dynamic _fetchAssetInfoError;
  dynamic get fetchAssetInfoError => _fetchAssetInfoError;
  set fetchAssetInfoError(dynamic value) {
    _fetchAssetInfoError = value;
    notifyListeners();
  }

  Status _fetchAssetInfoStatus = Status.LOADING;
  Status get fetchAssetInfoStatus => _fetchAssetInfoStatus;
  set fetchAssetInfoStatus(Status value) {
    _fetchAssetInfoStatus = value;
    notifyListeners();
  }

  String _errorText = '';
  String get errorText => _errorText;
  set errorText(String value) {
    _errorText = value;
    notifyListeners();
  }

  Future<void> fetchAssetInfo(BuildContext context, String assetId) async {
    fetchAssetInfoStatus = Status.LOADING;
    if (kDebugMode) {
      debugPrint("came to call fetch asset info api");
    }
    isLoading = true;
    setMyAssetInfo = null;
    if (kDebugMode) {
      debugPrint("Asset ID is $assetId");
    }

    String url = "${ApiUrls.fetchAssetInfoByScannerIdUrl}/$assetId";

    if (kDebugMode) {
      debugPrint("Making API call to: $url");
    }

    _apiService.getAssetInfo(context, url, {}).then((value) {
      print("got asset info and adding to model");
      final jsonResponse = jsonDecode(value.body);
      print("groupId got in details info is ${jsonResponse['groupId']}");
      // if (jsonResponse['groupId'] != null) {

      // } else {
        print("jsonResponse type is ${jsonResponse.runtimeType}");
        GroupServiceDetails assetInfo = GroupServiceDetails.fromJson(jsonResponse);
        setMyAssetInfo = assetInfo;
        fetchAssetInfoStatus = Status.COMPLETED;
        print("assigning to assetInfo is done");
      // }
    }).onError(
      (error, stackTrace) async {
        print(
            "error while fetching the asset details and error is ${error.toString()}");
        if (kDebugMode) {
          debugPrint(
              "first time error occured and updating the lat long and calling it again");
        }
        if (error.runtimeType == LatLongException) {
          fetchAssetInfoStatus = Status.LOADING;
          Position position = await _determinePosition(context);

          showLatLongUpdateDialog(context, () {
            String latitude = position.latitude.toString();
            String longitude = position.longitude.toString();
            Map<String, dynamic> data = {
              "lat": latitude,
              "long": longitude,
            };

            if (kDebugMode) {
              debugPrint("latitude is $latitude");
              debugPrint("longitude is $longitude");
            }

            _apiService.getAssetInfo(context, url, data).then(
              (value) {
                final jsonResponse = jsonDecode(value.body);
                GroupServiceDetails assetInfo = GroupServiceDetails.fromJson(jsonResponse);
                setMyAssetInfo = assetInfo;
                fetchAssetInfoStatus = Status.COMPLETED;

                SnackBarUtils.toastMessage(
                    "Asset Location is updated successfully to this latitude and longitude");
              },
            ).onError(
              (error, stackTrace) {
                if (kDebugMode) {
                  debugPrint(
                      "second time also error occured and its type is ${error.runtimeType} and data is  $error");
                }
                fetchAssetInfoStatus = Status.ERROR;
                errorText = error.toString();
                fetchAssetInfoError = error.runtimeType;
              },
            );
          }, () {
            Navigator.of(context)
                .popUntil(ModalRoute.withName(AppRoutes.bottombar));
          });
        } else {
          fetchAssetInfoStatus = Status.ERROR;
          errorText = error.toString();
          fetchAssetInfoError = error.runtimeType;
        }
      },
    );
  }

  bool _locationUpdateLoading = false;
  bool get locationUpdateLoading => _locationUpdateLoading;
  set locationUpdateLoading(bool value) {
    _locationUpdateLoading = value;
    notifyListeners();
  }

  Future<void> determinePositionAndUpdateLocation(
    BuildContext context,
  ) async {
    locationUpdateLoading = true;
    bool serviceEnabled;
    LocationPermission permission;
    print("asset info is ${assetInfo!.assets![0].id}");
    // Check if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
      }, () async {
        Navigator.of(context).pop();
        await Geolocator.openLocationSettings();
      });
      locationUpdateLoading = false;
      print("gps location services are not enabled");
      return Future.error('Location services are disabled.');
    }

    // Check the current permission status
    permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      // Request location permission
      permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied) {
        Navigator.of(context).pop();
        locationUpdateLoading = false;
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      showLocationDisabledDialog(context, () {
        Navigator.of(context).pop();
      }, () async {
        Navigator.of(context).pop();
        await Geolocator.openAppSettings();
      });
      locationUpdateLoading = false;
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    Position position = await Geolocator.getCurrentPosition();

    debugPrint(
        "Permissions are granted and the location is ${position.latitude} and ${position.longitude} and asset id is ${assetInfo!.assets![0].id}");

    Map<String, dynamic> data = {
      "lat": position.latitude.toString(),
      "long": position.longitude.toString(),
      "assetId": assetInfo!.assets![0!].id.toString(),
    };

    await _apiService
        .updateAssetInfo(context, ApiUrls.updateLocationUrl, data)
        .then((value) {
      updateLatLong(position.latitude.toString(), position.longitude.toString());    
      // final jsonResponse = jsonDecode(value.body);
      // UpdateLocationAssetDetails assetInfo =
      //     UpdateLocationAssetDetails.fromJson(jsonResponse);
      // _assetInfo!.assets[0]!.lat = assetInfo.asset!.lat;
      // _assetInfo!.asset!.long = assetInfo.asset!.long;
      notifyListeners();
      fetchAssetInfoStatus = Status.COMPLETED;
      SnackBarUtils.toastMessage(
          "asset location is updated successfully");

      locationUpdateLoading = false;
    }).onError((error, stackTrace) {
      if (kDebugMode) {
        debugPrint("$error");
      }
      SnackBarUtils.toastMessage(error.toString());
    }).whenComplete(() {
      locationUpdateLoading = false;
    });
  }

  dynamic _fetchAssetsError;
  dynamic get fetchAssetsError => _fetchAssetsError;
  set fetchAssetsError(dynamic value) {
    _fetchAssetsError = value;
    notifyListeners();
  }

  Status _fetchAssetsStatus = Status.LOADING;
  Status get fetchAssetsStatus => _fetchAssetsStatus;
  set fetchAssetsStatus(Status value) {
    _fetchAssetsStatus = value;
    notifyListeners();
  }

  dynamic _fetchSearchedAssetsError;
  dynamic get fetchSearchedAssetsError => _fetchSearchedAssetsError;
  set fetchSearchedAssetsError(dynamic value) {
    _fetchSearchedAssetsError = value;
    notifyListeners();
  }

  Status _fetchSearchedAssetsStatus = Status.LOADING;
  Status get fetchSearchedAssetsStatus => _fetchSearchedAssetsStatus;
  set fetchSearchedAssetsStatus(Status value) {
    _fetchSearchedAssetsStatus = value;
    notifyListeners();
  }

  Future<void> fetchMyAssets(BuildContext context) async {
    if (kDebugMode) {
      debugPrint("current page is $currentPage");
    }
    if (currentPage == 1) {
      fetchAssetsStatus = Status.LOADING;
      isLoading = true;
    } else {
      loadingMore = true;
    }

    final technicianId = await AuthManager().getTechnicianId();
    debugPrint("technician id is $technicianId");
    String url = "${ApiUrls.fetchmyassetsUrl}?limit=$limit&page=$currentPage";

    debugPrint("url is $url");

    await _apiService.getAssets(context, url).then((value) {
      debugPrint("response is 200");

      final jsonResponse = jsonDecode(value.body);
      MyAssets myAssets1 = MyAssets.fromJson(jsonResponse);

      if (currentPage == 1) {
        setMyAssets = myAssets1.myAssets ?? [];
      } else {
        debugPrint(
            "added assets list and length is ${myAssets1.myAssets!.length}");
        myAssets.addAll(myAssets1.myAssets ?? []);
        debugPrint("added assets list and length is ${myAssets.length}");
      }
      if (kDebugMode) {
        debugPrint("Length of assets: ${myAssets.length}");
      }
      fetchAssetsStatus = Status.COMPLETED;
    }).onError((error, stackTrace) {
      debugPrint("error is ${error.toString()}");
      // Handle error
      fetchAssetsStatus = Status.ERROR;
      fetchAssetsError = error.runtimeType;
    }).whenComplete(() {
      isLoading = false;
      loadingMore = false;
    });
  }

  Future<void> fetchSearchedMyAssets(
      BuildContext context, String searchQuery) async {
    if (currentPageForSearch == 1) {
      fetchSearchedAssetsStatus = Status.LOADING;
      searchAssetsLoading = true;
    } else {
      searchAssetsLoadingMore = true;
    }

    if (kDebugMode) {
      debugPrint("Fetching searched assets with query: $searchQuery");
    }
    String url =
        "${ApiUrls.fetchmyassetsUrl}?limit=$limit&page=$currentPageForSearch&search=$searchQuery";

    print("url is $url");

    _apiService.getSearchedAssets(context, url).then((value) {
      if (kDebugMode) {
        debugPrint("Successfully fetched the list of searched assets");
      }

      final jsonResponse = jsonDecode(value.body);
      MyAssets myAssets1 = MyAssets.fromJson(jsonResponse);

      if (currentPageForSearch == 1) {
        // Replace the list for the first page
        searchedAssets = myAssets1.myAssets ?? [];
      } else {
        // Append new items for subsequent pages
        searchedAssets.addAll(myAssets1.myAssets ?? []);
      }
      if (kDebugMode) {
        debugPrint("Length of searched assets: ${searchedAssets.length}");
      }
      fetchSearchedAssetsStatus = Status.COMPLETED;
    }).onError((error, stackTrace) {
      // Handle error
      fetchSearchedAssetsStatus = Status.ERROR;
      fetchSearchedAssetsError = error.runtimeType;
    }).whenComplete(() {
      searchAssetsLoading = false;
    });
  }
}
