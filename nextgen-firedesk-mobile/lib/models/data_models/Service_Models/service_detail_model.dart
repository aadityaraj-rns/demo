// To parse this JSON data, do
//
//     final serviceDetails = serviceDetailsFromJson(jsonString);

import 'dart:convert';

ServiceDetails serviceDetailsFromJson(String str) => ServiceDetails.fromJson(json.decode(str));

String serviceDetailsToJson(ServiceDetails data) => json.encode(data.toJson());

class ServiceDetails {
    String? id;
    bool? individualService;
    String? categoryId;
    String? orgUserId;
    String? plantId;
    List<AssetsId>? assetsId;
    String? serviceType;
    String? serviceFrequency;
    DateTime? date;
    DateTime? expireDate;
    String? completedStatus;
    int? v;
    DateTime? createdAt;
    DateTime? updatedAt;

    ServiceDetails({
        this.id,
        this.individualService,
        this.categoryId,
        this.orgUserId,
        this.plantId,
        this.assetsId,
        this.serviceType,
        this.serviceFrequency,
        this.date,
        this.expireDate,
        this.completedStatus,
        this.v,
        this.createdAt,
        this.updatedAt,
    });

    factory ServiceDetails.fromJson(Map<String, dynamic> json) => ServiceDetails(
        id: json["_id"],
        individualService: json["individualService"],
        categoryId: json["categoryId"].toString(),
        orgUserId: json["orgUserId"],
        plantId: json["plantId"].toString(),
        assetsId: json["assetsId"] == null ? [] : List<AssetsId>.from(json["assetsId"]!.map((x) => AssetsId.fromJson(x))),
        serviceType: json["serviceType"],
        serviceFrequency: json["serviceFrequency"],
        date: json["date"] == null ? null : DateTime.parse(json["date"]),
        expireDate: json["expireDate"] == null ? null : DateTime.parse(json["expireDate"]),
        completedStatus: json["completedStatus"],
        v: json["__v"],
        createdAt: json["createdAt"] == null ? null : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null ? null : DateTime.parse(json["updatedAt"]),
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "individualService": individualService,
        "categoryId": categoryId,
        "orgUserId": orgUserId,
        "plantId": plantId,
        "assetsId": assetsId == null ? [] : List<dynamic>.from(assetsId!.map((x) => x.toJson())),
        "serviceType": serviceType,
        "serviceFrequency": serviceFrequency,
        "date": date?.toIso8601String(),
        "expireDate": expireDate?.toIso8601String(),
        "completedStatus": completedStatus,
        "__v": v,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
    };
}

class AssetsId {
    String? id;
    String? assetId;
    String? building;
    String? location;
    String? lat;
    String? long;

    AssetsId({
        this.id,
        this.assetId,
        this.building,
        this.location,
        this.lat,
        this.long,
    });

    factory AssetsId.fromJson(Map<String, dynamic> json) => AssetsId(
        id: json["_id"],
        assetId: json["assetId"],
        building: json["building"],
        location: json["location"],
        lat: json['lat'],
        long: json['long'],
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "assetId": assetId,
        "building": building,
        "location": location,
        "lat":lat,
        "long":long,
    };
}

class CategoryId {
    String? id;
    String? categoryName;

    CategoryId({
        this.id,
        this.categoryName,
    });

    factory CategoryId.fromJson(Map<String, dynamic> json) => CategoryId(
        id: json["_id"],
        categoryName: json["categoryName"],
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "categoryName": categoryName,
    };
}

class PlantId {
    String? id;
    String? plantName;

    PlantId({
        this.id,
        this.plantName,
    });

    factory PlantId.fromJson(Map<String, dynamic> json) => PlantId(
        id: json["_id"],
        plantName: json["plantName"],
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "plantName": plantName,
    };
}
