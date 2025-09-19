// To parse this JSON data, do
//
//     final plantInfo = plantInfoFromJson(jsonString);

import 'dart:convert';

PlantInfo plantInfoFromJson(String str) => PlantInfo.fromJson(json.decode(str));

String plantInfoToJson(PlantInfo data) => json.encode(data.toJson());

class PlantInfo {
  Plant? plant;
  List<Category>? categorys;
  int? completedServiceCount;
  int? pendingServiceCount;
  int? completedTicketsCount;
  int? pendingTicketsCount;

  PlantInfo({
    this.plant,
    this.categorys,
    this.completedServiceCount,
    this.pendingServiceCount,
    this.completedTicketsCount,
    this.pendingTicketsCount,
  });

  factory PlantInfo.fromJson(Map<String, dynamic> json) => PlantInfo(
        plant: json["plant"] == null ? null : Plant.fromJson(json["plant"]),
        categorys: json["categorys"] == null
            ? []
            : List<Category>.from(
                json["categorys"]!.map((x) => Category.fromJson(x))),
        completedServiceCount: json["completedServiceCount"],
        pendingServiceCount: json["pendingServiceCount"],
        completedTicketsCount: json["completedTicketsCount"],
        pendingTicketsCount: json["pendingTicketsCount"],
      );

  Map<String, dynamic> toJson() => {
        "plant": plant?.toJson(),
        "categorys": categorys == null
            ? []
            : List<dynamic>.from(categorys!.map((x) => x.toJson())),
        "completedServiceCount": completedServiceCount,
        "pendingServiceCount": pendingServiceCount,
        "completedTicketsCount": completedTicketsCount,
        "pendingTicketsCount": pendingTicketsCount,
      };
}

class Category {
  String? categoryName;
  int? count;
  HealthStatusCounts? healthStatusCounts;

  Category({
    this.categoryName,
    this.count,
    this.healthStatusCounts,
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
        categoryName: json["categoryName"],
        count: json["count"],
        healthStatusCounts: json["healthStatusCounts"] == null
            ? null
            : HealthStatusCounts.fromJson(json["healthStatusCounts"]),
      );

  Map<String, dynamic> toJson() => {
        "categoryName": categoryName,
        "count": count,
        "healthStatusCounts": healthStatusCounts?.toJson(),
      };
}

class HealthStatusCounts {
  int? healthy;
  int? attentionRequired;
  int? notWorking;

  HealthStatusCounts({
    this.healthy,
    this.attentionRequired,
    this.notWorking,
  });

  factory HealthStatusCounts.fromJson(Map<String, dynamic> json) =>
      HealthStatusCounts(
        healthy: json["Healthy"],
        attentionRequired: json["AttentionRequired"],
        notWorking: json["NotWorking"],
      );

  Map<String, dynamic> toJson() => {
        "Healthy": healthy,
        "AttentionRequired": attentionRequired,
        "NotWorking": notWorking,
      };
}

class Plant {
  String? id;
  String? orgUserId;
  String? plantName;
  String? address;
  CityId? cityId;
  ManagerId? managerId;
  String? plantImage;
  List<Layout>? layouts;
  String? status;
  DateTime? createdAt;
  DateTime? updatedAt;
  String? plantId;
  int? v;

  Plant({
    this.id,
    this.orgUserId,
    this.plantName,
    this.address,
    this.cityId,
    this.managerId,
    this.plantImage,
    this.layouts,
    this.status,
    this.createdAt,
    this.updatedAt,
    this.plantId,
    this.v,
  });

  factory Plant.fromJson(Map<String, dynamic> json) => Plant(
        id: json["_id"],
        orgUserId: json["orgUserId"],
        plantName: json["plantName"],
        address: json["address"],
        cityId: json["cityId"] == null ? null : CityId.fromJson(json["cityId"]),
        managerId: json["managerId"] == null
            ? null
            : ManagerId.fromJson(json["managerId"]),
        plantImage: json["plantImage"],
        layouts: json["layouts"] == null
            ? []
            : List<Layout>.from(
                json["layouts"]!.map((x) => Layout.fromJson(x))),
        status: json["status"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        plantId: json['plantId'].toString(),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "orgUserId": orgUserId,
        "plantName": plantName,
        "address": address,
        "cityId": cityId?.toJson(),
        "managerId": managerId?.toJson(),
        "plantImage": plantImage,
        "layouts": layouts == null
            ? []
            : List<dynamic>.from(layouts!.map((x) => x.toJson())),
        "status": status,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "plantId": plantId,
        "__v": v,
      };
}

class CityId {
  String? id;
  String? cityName;

  CityId({
    this.id,
    this.cityName,
  });

  factory CityId.fromJson(Map<String, dynamic> json) => CityId(
        id: json["_id"],
        cityName: json["cityName"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "cityName": cityName,
      };
}

class Layout {
  String? layoutName;
  String? layoutImage;
  String? id;

  Layout({
    this.layoutName,
    this.layoutImage,
    this.id,
  });

  factory Layout.fromJson(Map<String, dynamic> json) => Layout(
        layoutName: json["layoutName"],
        layoutImage: json["layoutImage"],
        id: json["_id"],
      );

  Map<String, dynamic> toJson() => {
        "layoutName": layoutName,
        "layoutImage": layoutImage,
        "_id": id,
      };
}

class ManagerId {
  String? id;
  UserId? userId;

  ManagerId({
    this.id,
    this.userId,
  });

  factory ManagerId.fromJson(Map<String, dynamic> json) => ManagerId(
        id: json["_id"],
        userId: json["userId"] == null ? null : UserId.fromJson(json["userId"]),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "userId": userId?.toJson(),
      };
}

class UserId {
  String? id;
  String? name;
  String? phone;
  String? email;

  UserId({
    this.id,
    this.name,
    this.phone,
    this.email,
  });

  factory UserId.fromJson(Map<String, dynamic> json) => UserId(
        id: json["_id"],
        name: json["name"],
        phone: json["phone"],
        email: json["email"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "phone": phone,
        "email": email,
      };
}
