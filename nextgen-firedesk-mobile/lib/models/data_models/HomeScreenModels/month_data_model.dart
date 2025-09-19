import 'dart:convert';

List<MonthServicesAndTickets> monthServicesAndTicketsFromJson(String str) =>
    List<MonthServicesAndTickets>.from(
        json.decode(str).map((x) => MonthServicesAndTickets.fromJson(x)));

String monthServicesAndTicketsToJson(List<MonthServicesAndTickets> data) =>
    json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class MonthServicesAndTickets {
  DateTime date;
  List<Ticket> tickets;
  List<ServiceData> serviceDatas;
  int title;

  MonthServicesAndTickets({
    required this.date,
    required this.tickets,
    required this.serviceDatas,
    required this.title,
  });

  factory MonthServicesAndTickets.fromJson(Map<String, dynamic> json) =>
      MonthServicesAndTickets(
        date: DateTime.parse(json["date"]),
        tickets:
            List<Ticket>.from(json["tickets"].map((x) => Ticket.fromJson(x))),
        serviceDatas: List<ServiceData>.from(
            json["serviceDatas"].map((x) => ServiceData.fromJson(x))),
        title: json["title"],
      );

  Map<String, dynamic> toJson() => {
        "date":
            "${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}",
        "tickets": List<dynamic>.from(tickets.map((x) => x.toJson())),
        "serviceDatas": List<dynamic>.from(serviceDatas.map((x) => x.toJson())),
        "title": title,
      };
}

class ServiceData {
  String? id;
  bool individualService;
  String? categoryId;
  String? orgUserId;
  PlantId plantId;
  List<ServiceDataAssetsId> assetsId;
  String? serviceType;
  String? serviceFrequency;
  DateTime date;
  DateTime expireDate;
  String? completedStatus;
  int v;
  DateTime createdAt;
  DateTime updatedAt;
  GroupServiceId? groupServiceId;

  ServiceData({
    required this.id,
    required this.individualService,
    this.categoryId,
    required this.orgUserId,
    required this.plantId,
    required this.assetsId,
    required this.serviceType,
    required this.serviceFrequency,
    required this.date,
    required this.expireDate,
    required this.completedStatus,
    required this.v,
    required this.createdAt,
    required this.updatedAt,
    this.groupServiceId,
  });

  factory ServiceData.fromJson(Map<String, dynamic> json) => ServiceData(
        id: json["_id"] ?? "",
        individualService: json["individualService"] ?? "",
        categoryId: json["categoryId"],
        orgUserId: json["orgUserId"] ?? "", // Provide empty string if null
        plantId: PlantId.fromJson(json["plantId"]),
        assetsId: List<ServiceDataAssetsId>.from(
            json["assetsId"].map((x) => ServiceDataAssetsId.fromJson(x))),
        serviceType: json["serviceType"] ?? "",
        serviceFrequency: json["serviceFrequency"] ?? "",
        date: DateTime.parse(json["date"]),
        expireDate: DateTime.parse(json["expireDate"]),
        completedStatus: json["completedStatus"] ?? "",
        v: json["__v"],
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        groupServiceId: json["groupServiceId"] == null
            ? null
            : GroupServiceId.fromJson(json["groupServiceId"]),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "individualService": individualService,
        "categoryId": categoryId,
        "orgUserId": orgUserId,
        "plantId": plantId.toJson(),
        "assetsId": List<dynamic>.from(assetsId.map((x) => x.toJson())),
        "serviceType": serviceType,
        "serviceFrequency": serviceFrequency,
        "date": date.toIso8601String(),
        "expireDate": expireDate.toIso8601String(),
        "completedStatus": completedStatus,
        "__v": v,
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "groupServiceId": groupServiceId?.toJson(),
      };
}



class ServiceDataAssetsId {
  String? id;
  String? assetId;
  ProductId productId;
  String? building;
  String? type;
  String? location;

  ServiceDataAssetsId({
    required this.id,
    required this.assetId,
    required this.productId,
    required this.building,
    required this.type,
    required this.location,
  });

  factory ServiceDataAssetsId.fromJson(Map<String, dynamic> json) =>
      ServiceDataAssetsId(
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
        "type":type,
        "location":location,
        "building":building
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
  String id;
  String? ticketId;
  String? orgUserId;
  String? plantId;
  List<TicketAssetsId> assetsId;
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
        id: json["_id"],
        ticketId: json["ticketId"] ?? "",
        orgUserId: json["orgUserId"] ?? "",
        plantId: json["plantId"] ?? "",
        assetsId: List<TicketAssetsId>.from(
            json["assetsId"].map((x) => TicketAssetsId.fromJson(x))),
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

class TicketAssetsId {
  String id;
  String assetId;
  String building;
  String location;

  TicketAssetsId({
    required this.id,
    required this.assetId,
    required this.building,
    required this.location,
  });

  factory TicketAssetsId.fromJson(Map<String, dynamic> json) => TicketAssetsId(
        id: json["_id"],
        assetId: json["assetId"],
        building: json["building"],
        location: json["location"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "assetId": assetId,
        "building": building,
        "location": location,
      };
}
