// To parse this JSON data, do
//
//     final dayServicesAndTickets = dayServicesAndTicketsFromJson(jsonString);

import 'dart:convert';

DayServicesAndTickets dayServicesAndTicketsFromJson(String str) =>
    DayServicesAndTickets.fromJson(json.decode(str));

String dayServicesAndTicketsToJson(DayServicesAndTickets data) =>
    json.encode(data.toJson());

class DayServicesAndTickets {
  final List<Service> services;
  final List<Ticket> tickets;

  DayServicesAndTickets({
    required this.services,
    required this.tickets,
  });

  factory DayServicesAndTickets.fromJson(Map<String, dynamic> json) =>
      DayServicesAndTickets(
        services: (json["services"] as List<dynamic>?)
                ?.map((x) => Service.fromJson(x))
                .toList() ??
            [],
        tickets: (json["tickets"] as List<dynamic>?)
                ?.map((x) => Ticket.fromJson(x))
                .toList() ??
            [],
      );

  Map<String, dynamic> toJson() => {
        "services": services.map((x) => x.toJson()).toList(),
        "tickets": tickets.map((x) => x.toJson()).toList(),
      };
}

class Service {
  final String? id;
  final bool? individualService;
  final String? categoryId;
  final String? orgUserId;
  final PlantId? plantId;
  final List<AssetsId> assetsId;
  final String? serviceType;
  final String? serviceFrequency;
  final DateTime? date;
  final DateTime? expireDate;
  final String? completedStatus;
  final int? v;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  GroupServiceId? groupServiceId;

  Service({
    this.id,
    this.individualService,
    this.categoryId,
    this.orgUserId,
    this.plantId,
    required this.assetsId,
    this.serviceType,
    this.serviceFrequency,
    this.date,
    this.expireDate,
    this.completedStatus,
    this.v,
    this.createdAt,
    this.updatedAt,
    this.groupServiceId,
  });

  factory Service.fromJson(Map<String, dynamic> json) => Service(
        id: json["_id"] as String?,
        individualService: json["individualService"] as bool?,
        categoryId: json["categoryId"] as String?,
        orgUserId: json["orgUserId"] as String?,
        plantId:
            json["plantId"] != null ? PlantId.fromJson(json["plantId"]) : null,
        assetsId: (json["assetsId"] as List<dynamic>?)
                ?.map((x) => AssetsId.fromJson(x))
                .toList() ??
            [],
        serviceType: json["serviceType"] as String?,
        serviceFrequency: json["serviceFrequency"] as String?,
        date: json["date"] != null ? DateTime.tryParse(json["date"]) : null,
        expireDate: json["expireDate"] != null
            ? DateTime.tryParse(json["expireDate"])
            : null,
        completedStatus: json["completedStatus"] as String?,
        v: json["__v"] as int?,
        createdAt: json["createdAt"] != null
            ? DateTime.tryParse(json["createdAt"])
            : null,
        updatedAt: json["updatedAt"] != null
            ? DateTime.tryParse(json["updatedAt"])
            : null,
        groupServiceId: json["groupServiceId"] == null
            ? null
            : GroupServiceId.fromJson(json["groupServiceId"]),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "individualService": individualService,
        "categoryId": categoryId,
        "orgUserId": orgUserId,
        "plantId": plantId?.toJson(),
        "assetsId": assetsId.map((x) => x.toJson()).toList(),
        "serviceType": serviceType,
        "serviceFrequency": serviceFrequency,
        "date": date?.toIso8601String(),
        "expireDate": expireDate?.toIso8601String(),
        "completedStatus": completedStatus,
        "__v": v,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "groupServiceId": groupServiceId?.toJson(),
      };
}

class GroupServiceId {
  String? id;
  String? groupId;
  String? groupName;

  GroupServiceId({
    required this.id,
    required this.groupId,
    required this.groupName,
  });

  factory GroupServiceId.fromJson(Map<String, dynamic> json) => GroupServiceId(
        id: json["_id"] ?? "",
        groupId: json["groupId"] ?? "",
        groupName: json["groupName"] ?? "",
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "groupId": groupId,
        "groupName": groupName,
      };
}

class AssetsId {
  String? id;
  String? assetId;
  ProductId productId;
  String? building;
  String? type;
  String? location;

  AssetsId({
    required this.id,
    required this.assetId,
    required this.productId,
    required this.building,
    required this.type,
    required this.location,
  });

  factory AssetsId.fromJson(Map<String, dynamic> json) => AssetsId(
        id: json["_id"] ?? "",
        assetId: json["assetId"] ?? "",
        productId: ProductId.fromJson(json["productId"]),
        building: json["building"] ?? "",
        type: json["type"] ?? "",
        location: json["location"] ?? "",
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "assetId": assetId,
        "productId": productId.toJson(),
        "type": type,
        "location": location,
        "building": building
      };
}

class ProductId {
  String? id;
  String? productName;
  String? description;

  ProductId({
    required this.id,
    required this.productName,
    required this.description,
  });

  factory ProductId.fromJson(Map<String, dynamic> json) => ProductId(
        id: json["_id"] ?? "",
        productName: json["productName"] ?? "",
        description: json["description"] ?? "",
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "productName": productName,
        "description": description,
      };
}

class PlantId {
  String? id;
  String? plantName;

  PlantId({
    required this.id,
    required this.plantName,
  });

  factory PlantId.fromJson(Map<String, dynamic> json) => PlantId(
        id: json["_id"] ?? "",
        plantName: json["plantName"] ?? "",
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "plantName": plantName,
      };
}

class Ticket {
  String? id;
  String? ticketId;
  String? orgUserId;
  String? plantId;
  List<AssetsId> assetsId;
  List<String> taskNames;
  String? taskDescription;
  DateTime targetDate;
  String? ticketType;
  String? completedStatus;
  DateTime createdAt;
  DateTime updatedAt;
  int v;

  Ticket({
    required this.id,
    required this.ticketId,
    required this.orgUserId,
    required this.plantId,
    required this.assetsId,
    required this.taskNames,
    required this.taskDescription,
    required this.targetDate,
    required this.ticketType,
    required this.completedStatus,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Ticket.fromJson(Map<String, dynamic> json) => Ticket(
        id: json["_id"] ?? "",
        ticketId: json["ticketId"] ?? "",
        orgUserId: json["orgUserId"] ?? "",
        plantId: json["plantId"] ?? "",
        assetsId: List<AssetsId>.from(
            json["assetsId"].map((x) => AssetsId.fromJson(x))),
        taskNames: List<String>.from(json["taskNames"].map((x) => x)),
        taskDescription: json["taskDescription"] ?? "",
        targetDate: DateTime.parse(json["targetDate"]),
        ticketType: json["ticketType"] ?? "",
        completedStatus: json["completedStatus"] ?? "",
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "ticketId": ticketId,
        "orgUserId": orgUserId,
        "plantId": plantId,
        "assetsId": List<dynamic>.from(assetsId.map((x) => x.toJson())),
        "taskNames": List<dynamic>.from(taskNames.map((x) => x)),
        "taskDescription": taskDescription,
        "targetDate": targetDate.toIso8601String(),
        "ticketType": ticketType,
        "completedStatus": completedStatus,
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "__v": v,
      };
}
