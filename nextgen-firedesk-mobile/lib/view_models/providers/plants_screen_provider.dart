import 'dart:convert';
import 'package:firedesk/data/reponse/status.dart';
import 'package:firedesk/models/data_models/Plants/plant_info.dart';
import 'package:firedesk/models/data_models/Plants/plants_list.dart'
    as plantslist;
import 'package:firedesk/repository/plants/plants_repository.dart';
import 'package:firedesk/view/Layouts/layouts_screen.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PlantsScreenProvider extends ChangeNotifier {
  final PlantsRepository _apiService = PlantsRepository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;
  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  List<String> _plantNames = [];
  List<String> get plantNames => _plantNames;
  set plantNames(List<String> value) {
    _plantNames = value;
    notifyListeners();
  }

  final List<String> _images = [];

  List<String> get images => _images;

  int? _selectedPlant;
  int? get selectedPlant => _selectedPlant;
  set selectedPlant(int? value) {
    _selectedPlant = value;
    notifyListeners();
  }

  PlantInfo? _plantInfo;
  List<plantslist.Plant> get plants => _plants;
  PlantInfo? get plantInfo => _plantInfo;

  set plantInfo(PlantInfo? value) {
    _plantInfo = value;
    notifyListeners();
  }

  set plants(List<plantslist.Plant> value) {
    _plants = value;
    notifyListeners();
  }

  List<plantslist.Plant> _plants = [];
  List<plantslist.Plant> get plantsLocal => _plantsLocal;

  set plantsLocal(List<plantslist.Plant> value) {
    _plantsLocal = value;
    notifyListeners();
  }

  List<plantslist.Plant> _plantsLocal = [];

  List<plantslist.Category?>? _category;
  List<plantslist.Category?>? get category => _category;
  set category(List<plantslist.Category?>? value) {
    _category = value;
    notifyListeners();
  }

  Status _allPlantsStatus = Status.LOADING;
  Status get allPlantsStatus => _allPlantsStatus;
  set allPlantsStatus(Status value) {
    _allPlantsStatus = value;
    notifyListeners();
  }

  dynamic _allPlantsError;
  dynamic get allPlantsError => _allPlantsError;
  set allPlantsError(dynamic value) {
    _allPlantsError = value;
    notifyListeners();
  }

  Status _plantInfoStatus = Status.LOADING;
  Status get plantInfoStatus => _plantInfoStatus;
  set plantInfoStatus(Status value) {
    _plantInfoStatus = value;
    notifyListeners();
  }

  dynamic _plantInfoError;
  dynamic get plantInfoError => _plantInfoError;
  set plantInfoError(dynamic value) {
    _plantInfoError = value;
    notifyListeners();
  }

  Future<void> fetchMyPlants(BuildContext context) async {
    allPlantsStatus = Status.LOADING;
    plants.clear();
    notifyListeners(); // Notify UI immediately about the loading state

    plantNames.clear();
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String technicianId = prefs.getString("technicianId") ?? "";

    try {
      var value = await _apiService.getAllPlants(context, technicianId);
      var jsonResponse = jsonDecode(value.body);
      // print("response i got in my plants is ${jsonResponse.statusCode}");
      plantslist.MyPlants myPlants = plantslist.MyPlants.fromJson(jsonResponse);
      print("my plants length i got is ${myPlants.plants!.length}");
      category = myPlants.category;
      if (kDebugMode) {
        debugPrint("category name is ${category![0]!.categoryName}");
      }

      List<plantslist.Plant> plantsList = myPlants.plants ?? [];

      for (var plant in plantsList) {
        plantNames.add(plant.plantName ?? "");
      }

      plants = plantsList;
      selectedPlant = plantsList.isNotEmpty ? 0 : null;

      if (kDebugMode) {
        debugPrint("selected plant index is $selectedPlant");
      }
      if (kDebugMode) {
        debugPrint("Number of plants fetched: ${plants.length}");
        debugPrint("Plant names: $plantNames");
      }
      allPlantsStatus = Status.COMPLETED;
    } catch (error, stackTrace) {
      print("catch error in my plants and the error is ${error.toString()}");
      allPlantsStatus = Status.ERROR;
      allPlantsError = error.runtimeType;
    } finally {
      notifyListeners();
    }
  }

  final List<ChartData> categoriesData = [];

  final List<ChartData2> subCategoriesData = [];

  final List<ChartData> ticketData = [];

  final List<ChartData> serviceData = [];

  Future<void> fetchPlantInfo(BuildContext context, String plantId) async {
    plantInfoStatus = Status.LOADING;
    ticketData.clear();
    serviceData.clear();
    categoriesData.clear();
    subCategoriesData.clear();

    _apiService.getPlantInfo(context, plantId).then((value) {
      var jsonResponse = jsonDecode(value.body);
      PlantInfo plantInfos = PlantInfo.fromJson(jsonResponse);
      plantInfo = plantInfos;

      if (kDebugMode) {
        debugPrint("Successfully assigned the data to the model");
        debugPrint("Added images to the list, length is ${_images.length}");
      }

      if (plantInfo != null) {
        ticketData
            .add(ChartData("Completed", plantInfo!.completedTicketsCount ?? 0));
        ticketData
            .add(ChartData("Pending", plantInfo!.pendingTicketsCount ?? 0));
        serviceData
            .add(ChartData("Completed", plantInfo!.completedServiceCount ?? 0));
        serviceData
            .add(ChartData("Pending", plantInfo!.pendingServiceCount ?? 0));
        for (var item in plantInfo!.categorys!) {
          if (kDebugMode) {
            debugPrint("came for plant info categories loop");
          }
          categoriesData.add(ChartData(
            item.categoryName ?? "",
            item.count ?? 0,
          ));
        }

        final categories = plantInfo!.categorys ?? [];

        print("came from plant info categories loop ${categories.length}");

        for (var category in categories) {
          final categoryName = category.categoryName ?? "Unknown";

          if (category.healthStatusCounts != null) {
            final healthStatusCounts = category.healthStatusCounts!;

            subCategoriesData.addAll([
              ChartData2(categoryName, 'Healthy',
                  healthStatusCounts.healthy?.toDouble() ?? 0),
              ChartData2(categoryName, 'Need Attention',
                  healthStatusCounts.attentionRequired?.toDouble() ?? 0),
              ChartData2(categoryName, 'Not Working',
                  healthStatusCounts.notWorking?.toDouble() ?? 0),
            ]);
          }
        }
      }

      plantInfoStatus = Status.COMPLETED;
    }).onError((error, stackTrace) {
      plantInfoStatus = Status.ERROR;
      plantInfoError = error.runtimeType;
      if (kDebugMode) {
        debugPrint("Error occurred while getting the asset info: $error");
      }
      throw Exception(error.toString());
    });
  }
}
