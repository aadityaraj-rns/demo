// To parse this JSON data, do
//
//     final incompleteTickets = incompleteTicketsFromJson(jsonString);

import 'dart:convert';

IncompleteTickets incompleteTicketsFromJson(String str) =>
    IncompleteTickets.fromJson(json.decode(str));

String incompleteTicketsToJson(IncompleteTickets data) =>
    json.encode(data.toJson());

class IncompleteTickets {
  List<IncompletedTicket>? incompletedTickets;

  IncompleteTickets({
    this.incompletedTickets,
  });

  factory IncompleteTickets.fromJson(Map<String, dynamic> json) =>
      IncompleteTickets(
        incompletedTickets: json["incompletedTickets"] == null
            ? []
            : List<IncompletedTicket>.from(json["incompletedTickets"]!
                .map((x) => IncompletedTicket.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "incompletedTickets": incompletedTickets == null
            ? []
            : List<dynamic>.from(
                incompletedTickets!.map(
                  (x) => x.toJson(),
                ),
              ),
      };
}

class IncompletedTicket {
  String? id;
  String? orgUserId;
  String? plantId;
  List<AssetsId>? assetsId;
  String? taskDescription;
  String? technicianUserId;
  DateTime? targetDate;
  String? completedStatus;
  int? v;

  IncompletedTicket({
    this.id,
    this.orgUserId,
    this.plantId,
    this.assetsId,
    this.taskDescription,
    this.technicianUserId,
    this.targetDate,
    this.completedStatus,
    this.v,
  });

  factory IncompletedTicket.fromJson(Map<String, dynamic> json) =>
      IncompletedTicket(
        id: json["_id"],
        orgUserId: json["orgUserId"],
        plantId: json["plantId"],
        assetsId: json["assetsId"] == null
            ? []
            : List<AssetsId>.from(
                json["assetsId"]!.map((x) => AssetsId.fromJson(x))),
        taskDescription: json["taskDescription"],
        technicianUserId: json["technicianUserId"],
        targetDate: json["targetDate"] == null
            ? null
            : DateTime.parse(json["targetDate"]),
        completedStatus: json["completedStatus"],
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "orgUserId": orgUserId,
        "plantId": plantId,
        "assetsId": assetsId == null
            ? []
            : List<dynamic>.from(assetsId!.map((x) => x.toJson())),
        "taskDescription": taskDescription,
        "technicianUserId": technicianUserId,
        "targetDate": targetDate?.toIso8601String(),
        "completedStatus": completedStatus,
        "__v": v,
      };
}

class AssetsId {
  String? id;
  ProductId? productId;

  AssetsId({
    this.id,
    this.productId,
  });

  factory AssetsId.fromJson(Map<String, dynamic> json) => AssetsId(
        id: json["_id"],
        productId: json["productId"] == null
            ? null
            : ProductId.fromJson(json["productId"]),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "productId": productId?.toJson(),
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
