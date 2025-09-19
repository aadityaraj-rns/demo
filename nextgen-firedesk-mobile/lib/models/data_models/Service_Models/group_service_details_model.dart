// To parse this JSON data, do
//
//     final groupServiceDetails = groupServiceDetailsFromJson(jsonString);

import 'dart:convert';

GroupServiceDetails groupServiceDetailsFromJson(String str) =>
    GroupServiceDetails.fromJson(json.decode(str));

String groupServiceDetailsToJson(GroupServiceDetails data) =>
    json.encode(data.toJson());

class GroupServiceDetails {
  String? groupId;
  String? groupName;
  String? groupDescription;
  List<Asset>? assets;
  OrgUserId? orgUserId;
  PlantId? plantId;
  String? qrCodeUrl;
  Next? nextInspection;
  Next? nextTesting;
  Next? nextMaintenence;

  GroupServiceDetails({
    this.groupId,
    this.groupName,
    this.groupDescription,
    this.assets,
    this.orgUserId,
    this.plantId,
    this.qrCodeUrl,
    this.nextInspection,
    this.nextTesting,
    this.nextMaintenence,
  });

  factory GroupServiceDetails.fromJson(Map<String, dynamic> json) =>
      GroupServiceDetails(
        groupId: json["groupId"],
        groupName: json["groupName"],
        groupDescription: json["groupDescription"],
        assets: json["assets"] == null
            ? []
            : List<Asset>.from(json["assets"]!.map((x) => Asset.fromJson(x))),
        orgUserId: json["orgUserId"] == null
            ? null
            : OrgUserId.fromJson(json["orgUserId"]),
        plantId:
            json["plantId"] == null ? null : PlantId.fromJson(json["plantId"]),
        qrCodeUrl: json["qrCodeUrl"],
        nextInspection: json["nextInspection"] == null
            ? null
            : Next.fromJson(json["nextInspection"]),
        nextTesting: json["nextTesting"] == null
            ? null
            : Next.fromJson(json["nextTesting"]),
        nextMaintenence: json["nextMaintenance"] == null ? null : Next.fromJson(json["nextMaintenance"]),
      );

  Map<String, dynamic> toJson() => {
        "groupId": groupId,
        "groupName": groupName,
        "groupDescription": groupDescription,
        "assets": assets == null
            ? []
            : List<dynamic>.from(assets!.map((x) => x.toJson())),
        "orgUserId": orgUserId?.toJson(),
        "plantId": plantId?.toJson(),
        "qrCodeUrl": qrCodeUrl,
        "nextInspection": nextInspection?.toJson(),
        "nextTesting": nextTesting?.toJson(),
        "nextMaintenence": nextMaintenence,
      };
}

class Asset {
  String? id;
  String? assetId;
  PlantId? plantId;
  String? building;
  OrgUserId? orgUserId;
  String? qrCodeUrl;
  String? lat;
  String? long;

  Asset({
    this.id,
    this.assetId,
    this.plantId,
    this.building,
    this.orgUserId,
    this.qrCodeUrl,
    this.lat,
    this.long,
  });

  factory Asset.fromJson(Map<String, dynamic> json) => Asset(
        id: json["_id"],
        assetId: json["assetId"],
        plantId:
            json["plantId"] == null ? null : PlantId.fromJson(json["plantId"]),
        building: json["building"],
        orgUserId: json["orgUserId"] == null
            ? null
            : OrgUserId.fromJson(json["orgUserId"]),
        qrCodeUrl: json["qrCodeUrl"],
        lat: json["lat"],
        long: json["long"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "assetId": assetId,
        "plantId": plantId?.toJson(),
        "building": building,
        "orgUserId": orgUserId?.toJson(),
        "qrCodeUrl": qrCodeUrl,
        "lat": lat,
        "long": long,
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

class Next {
  String? id;
  DateTime? date;

  Next({
    this.id,
    this.date,
  });

  factory Next.fromJson(Map<String, dynamic> json) => Next(
        id: json["_id"],
        date: json["date"] == null ? null : DateTime.parse(json["date"]),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "date": date?.toIso8601String(),
      };
}
