// To parse this JSON data, do
//
//     final myAssets = myAssetsFromJson(jsonString);

import 'dart:convert';

MyAssets myAssetsFromJson(String str) => MyAssets.fromJson(json.decode(str));

String myAssetsToJson(MyAssets data) => json.encode(data.toJson());

class MyAssets {
  List<MyAsset>? myAssets;

  MyAssets({
    this.myAssets,
  });

  factory MyAssets.fromJson(Map<String, dynamic> json) => MyAssets(
        myAssets: json["myAssets"] == null
            ? []
            : List<MyAsset>.from(
                json["myAssets"]!.map((x) => MyAsset.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "myAssets": myAssets == null
            ? []
            : List<dynamic>.from(myAssets!.map((x) => x.toJson())),
      };
}
// To parse this JSON data, do
//
//     final myAsset = myAssetFromJson(jsonString);

MyAsset myAssetFromJson(String str) => MyAsset.fromJson(json.decode(str));

String myAssetToJson(MyAsset data) => json.encode(data.toJson());

class MyAsset {
  String? id;
  PlantId? plantId;
  String? building;
  ProductId? productId;
  String? orgUserId;
  // TechnicianUserId? technicianUserId;
  String? model;
  String? slNo;
  String? pressureRating;
  String? pressureUnit;
  String? moc;
  String? approval;
  String? fireClass;
  DateTime? manufacturingDate;
  DateTime? installDate;
  String? suctionSize;
  String? head;
  String? rpm;
  String? mocOfImpeller;
  String? fuelCapacity;
  String? flowInLpm;
  String? housePower;
  String? healthStatus;
  String? tag;
  String? status;
  String? qrCodeUrl;
  String? location;
  String? assetId;
  DateTime? createdAt;
  ServiceDates? serviceDates;

  MyAsset({
    this.id,
    this.plantId,
    this.building,
    this.productId,
    this.orgUserId,
    // this.technicianUserId,
    this.model,
    this.slNo,
    this.pressureRating,
    this.pressureUnit,
    this.moc,
    this.approval,
    this.fireClass,
    this.manufacturingDate,
    this.installDate,
    this.suctionSize,
    this.head,
    this.rpm,
    this.mocOfImpeller,
    this.fuelCapacity,
    this.flowInLpm,
    this.housePower,
    this.healthStatus,
    this.tag,
    this.status,
    this.qrCodeUrl,
    this.location,
    this.assetId,
    this.createdAt,
    this.serviceDates,
  });

  factory MyAsset.fromJson(Map<String, dynamic> json) => MyAsset(
        id: json["_id"],
        plantId:
            json["plantId"] == null ? null : PlantId.fromJson(json["plantId"]),
        building: json["building"],
        productId: json["productId"] == null
            ? null
            : ProductId.fromJson(json["productId"]),
        orgUserId: json["orgUserId"],
        // technicianUserId: json["technicianUserId"] == null
        //     ? null
        //     : TechnicianUserId.fromJson(json["technicianUserId"]),
        model: json["model"],
        slNo: json["slNo"],
        pressureRating: json["pressureRating"],
        pressureUnit: json["pressureUnit"],
        moc: json["moc"],
        approval: json["approval"],
        fireClass: json["fireClass"],
        manufacturingDate: json["manufacturingDate"] == null
            ? null
            : DateTime.parse(json["manufacturingDate"]),
        installDate: json["installDate"] == null
            ? null
            : DateTime.parse(json["installDate"]),
        suctionSize: json["suctionSize"],
        head: json["head"],
        rpm: json["rpm"],
        mocOfImpeller: json["mocOfImpeller"],
        fuelCapacity: json["fuelCapacity"],
        flowInLpm: json["flowInLpm"],
        location: json['location'],
        housePower: json["housePower"],
        healthStatus: json["healthStatus"],
        tag: json["tag"],
        status: json["status"],
        qrCodeUrl: json["qrCodeUrl"],
        assetId: json["assetId"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        serviceDates: json['serviceDates'] == null
            ? null
            : ServiceDates.fromJson(json['serviceDates'],
        ),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "plantId": plantId?.toJson(),
        "building": building,
        "productId": productId?.toJson(),
        "orgUserId": orgUserId,
        // "technicianUserId": technicianUserId?.toJson(),
        "model": model,
        "slNo": slNo,
        "pressureRating": pressureRating,
        "pressureUnit": pressureUnit,
        "moc": moc,
        "approval": approval,
        "fireClass": fireClass,
        "manufacturingDate": manufacturingDate?.toIso8601String(),
        "installDate": installDate?.toIso8601String(),
        "suctionSize": suctionSize,
        "head": head,
        "rpm": rpm,
        "mocOfImpeller": mocOfImpeller,
        "fuelCapacity": fuelCapacity,
        "flowInLpm": flowInLpm,
        "housePower": housePower,
        "healthStatus": healthStatus,
        "tag": tag,
        "status": status,
        "qrCodeUrl": qrCodeUrl,
        "location": location,
        "assetId": assetId,
        "createdAt": createdAt?.toIso8601String(),
        "serviceDates": serviceDates?.toJson(),
      };
}

class PlantId {
  String? id;
  String? orgUserId;
  String? plantName;
  String? address;
  String? cityId;
  String? managerId;
  String? plantImage;
  List<Layout>? layouts;
  String? status;
  DateTime? createdAt;
  DateTime? updatedAt;
  int? v;

  PlantId({
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
    this.v,
  });

  factory PlantId.fromJson(Map<String, dynamic> json) => PlantId(
        id: json["_id"],
        orgUserId: json["orgUserId"],
        plantName: json["plantName"],
        address: json["address"],
        cityId: json["cityId"],
        managerId: json["managerId"],
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
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "orgUserId": orgUserId,
        "plantName": plantName,
        "address": address,
        "cityId": cityId,
        "managerId": managerId,
        "plantImage": plantImage,
        "layouts": layouts == null
            ? []
            : List<dynamic>.from(layouts!.map((x) => x.toJson())),
        "status": status,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "__v": v,
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

class ProductId {
  String? id;
  String? categoryId;
  String? productName;
  String? description;
  String? type;
  String? testFrequency;
  String? capacity;
  String? manufacturerName;
  String? image1;
  String? image2;
  String? status;
  DateTime? createdAt;
  DateTime? updatedAt;
  int? v;

  ProductId({
    this.id,
    this.categoryId,
    this.productName,
    this.description,
    this.type,
    this.testFrequency,
    this.capacity,
    this.manufacturerName,
    this.image1,
    this.image2,
    this.status,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory ProductId.fromJson(Map<String, dynamic> json) => ProductId(
        id: json["_id"],
        categoryId: json["categoryId"],
        productName: json["productName"],
        description: json["description"],
        type: json["type"],
        testFrequency: json["testFrequency"],
        capacity: json["capacity"],
        manufacturerName: json["manufacturerName"],
        image1: json["image1"],
        image2: json["image2"],
        status: json["status"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "categoryId": categoryId,
        "productName": productName,
        "description": description,
        "type": type,
        "testFrequency": testFrequency,
        "capacity": capacity,
        "manufacturerName": manufacturerName,
        "image1": image1,
        "image2": image2,
        "status": status,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "__v": v,
      };
}

class TechnicianUserId {
  String? id;
  String? userType;
  String? name;
  String? phone;
  String? email;
  String? status;
  DateTime? createdAt;
  DateTime? updatedAt;
  int? v;

  TechnicianUserId({
    this.id,
    this.userType,
    this.name,
    this.phone,
    this.email,
    this.status,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory TechnicianUserId.fromJson(Map<String, dynamic> json) =>
      TechnicianUserId(
        id: json["_id"],
        userType: json["userType"],
        name: json["name"],
        phone: json["phone"],
        email: json["email"],
        status: json["status"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "userType": userType,
        "name": name,
        "phone": phone,
        "email": email,
        "status": status,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "__v": v,
      };
}

ServiceDates serviceDatesFromJson(String str) =>
    ServiceDates.fromJson(json.decode(str));

String serviceDatesToJson(ServiceDates data) => json.encode(data.toJson());

class ServiceDates {
  TServiceDates? lastServiceDates;
  TServiceDates? nextServiceDates;

  ServiceDates({
    this.lastServiceDates,
    this.nextServiceDates,
  });

  factory ServiceDates.fromJson(Map<String, dynamic> json) => ServiceDates(
        lastServiceDates: json["lastServiceDates"] == null
            ? null
            : TServiceDates.fromJson(json["lastServiceDates"]),
        nextServiceDates: json["nextServiceDates"] == null
            ? null
            : TServiceDates.fromJson(json["nextServiceDates"]),
      );

  Map<String, dynamic> toJson() => {
        "lastServiceDates": lastServiceDates?.toJson(),
        "nextServiceDates": nextServiceDates?.toJson(),
      };
}

class TServiceDates {
  DateTime? inspection;
  DateTime? testing;
  DateTime? maintenance;
  String? id;

  TServiceDates({
    this.inspection,
    this.testing,
    this.maintenance,
    this.id,
  });

  factory TServiceDates.fromJson(Map<String, dynamic> json) => TServiceDates(
        inspection: json["inspection"] == null
            ? null
            : DateTime.parse(json["inspection"]),
        testing:
            json["testing"] == null ? null : DateTime.parse(json["testing"]),
        maintenance: json["maintenance"] == null
            ? null
            : DateTime.parse(json["maintenance"]),
        id: json["_id"],
      );

  Map<String, dynamic> toJson() => {
        "inspection": inspection?.toIso8601String(),
        "testing": testing?.toIso8601String(),
        "maintenance": maintenance?.toIso8601String(),
        "_id": id,
      };
}
