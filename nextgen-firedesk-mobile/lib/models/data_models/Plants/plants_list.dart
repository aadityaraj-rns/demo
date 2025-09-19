import 'dart:convert';

MyPlants myPlantsFromJson(String str) => MyPlants.fromJson(json.decode(str));

String myPlantsToJson(MyPlants data) => json.encode(data.toJson());

class MyPlants {
  List<Plant>? plants;
  List<Category>? category;

  MyPlants({
    this.plants,
    this.category,
  });

  factory MyPlants.fromJson(Map<String, dynamic> json) => MyPlants(
        plants: json["plants"] == null
            ? []
            : List<Plant>.from(json["plants"]!.map((x) => Plant.fromJson(x))),
         category: json["category"] == null
            ? []
            : List<Category>.from(json["category"]!.map((x) => Category.fromJson(x))),

      );

  Map<String, dynamic> toJson() => {
        "plants": plants == null
            ? []
            : List<dynamic>.from(plants!.map((x) => x.toJson())),
       "category": category == null
            ? []
            : List<dynamic>.from(category!.map((x) => x.toJson())),
      };
}

class Category {
  String? id;
  String? categoryName;

  Category({
    this.id,
    this.categoryName,
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
        id: json["_id"],
        categoryName: json["categoryName"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "categoryName": categoryName,
      };
}

class Plant {
  String? id;
  OrgUserId? orgUserId;
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
        orgUserId: json["orgUserId"] == null
            ? null
            : OrgUserId.fromJson(
                json["orgUserId"],
              ),
        plantName: json["plantName"],
        address: json["address"],
        cityId: json["cityId"] == null ? null : CityId.fromJson(json["cityId"]),
        managerId: json["managerId"] == null
            ? null
            : ManagerId.fromJson(
                json["managerId"],
              ),
        plantImage: json["plantImage"],
        layouts: json["layouts"] == null
            ? []
            : List<Layout>.from(
                json["layouts"]!.map(
                  (x) => Layout.fromJson(x),
                ),
              ),
        status: json["status"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(
                json["createdAt"],
              ),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(
                json["updatedAt"],
              ),
        plantId: json["plantId"].toString(),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "orgUserId": orgUserId?.toJson(),
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
        "plantId": plantId.toString(),
        "__v": v,
      };
}

class CityId {
  String? id;
  StateId? stateId;
  String? cityName;

  CityId({
    this.id,
    this.stateId,
    this.cityName,
  });

  factory CityId.fromJson(Map<String, dynamic> json) => CityId(
        id: json["_id"],
        stateId:
            json["stateId"] == null ? null : StateId.fromJson(json["stateId"]),
        cityName: json["cityName"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "stateId": stateId?.toJson(),
        "cityName": cityName,
      };
}

class StateId {
  String? id;
  String? stateName;

  StateId({
    this.id,
    this.stateName,
  });

  factory StateId.fromJson(Map<String, dynamic> json) => StateId(
        id: json["_id"],
        stateName: json["stateName"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "stateName": stateName,
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

class OrgUserId {
  String? id;
  String? name;

  OrgUserId({
    this.id,
    this.name,
  });

  factory OrgUserId.fromJson(Map<String, dynamic> json) => OrgUserId(
        id: json["_id"],
        name: json["name"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
      };
}
