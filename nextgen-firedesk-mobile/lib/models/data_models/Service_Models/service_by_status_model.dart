// To parse this JSON data, do
//
//     final servicesByStatusModel = servicesByStatusModelFromJson(jsonString);

import 'dart:convert';

ServicesByStatusModel servicesByStatusModelFromJson(String str) =>
    ServicesByStatusModel.fromJson(json.decode(str));

String servicesByStatusModelToJson(ServicesByStatusModel data) =>
    json.encode(data.toJson());

class ServicesByStatusModel {
  List<Service>? services;

  ServicesByStatusModel({
    this.services,
  });

  factory ServicesByStatusModel.fromJson(Map<String, dynamic> json) =>
      ServicesByStatusModel(
        services: json["services"] == null
            ? []
            : List<Service>.from(
                json["services"]!.map((x) => Service.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "services": services == null
            ? []
            : List<dynamic>.from(services!.map((x) => x.toJson())),
      };
}

class Service {
  String? id;
  bool? individualService;
  CategoryId? categoryId;
  List<AssetsId>? assetsId;
  String? serviceType;
  String? serviceFrequency;
  DateTime? date;
  DateTime? expireDate;
  SubmittedFormId? submittedFormId;
  GroupServiceId? groupServiceId;

  Service({
    this.id,
    this.individualService,
    this.categoryId,
    this.assetsId,
    this.serviceType,
    this.serviceFrequency,
    this.date,
    this.expireDate,
    this.submittedFormId,
    this.groupServiceId,
  });

  factory Service.fromJson(Map<String, dynamic> json) => Service(
        id: json["_id"],
        individualService: json["individualService"],
        categoryId: json["categoryId"] == null
            ? null
            : CategoryId.fromJson(json["categoryId"]),
        assetsId: json["assetsId"] == null
            ? []
            : List<AssetsId>.from(
                json["assetsId"]!.map((x) => AssetsId.fromJson(x))),
        serviceType: json["serviceType"],
        serviceFrequency: json["serviceFrequency"],
        date: json["date"] == null ? null : DateTime.parse(json["date"]),
        expireDate: json["expireDate"] == null
            ? null
            : DateTime.parse(json["expireDate"]),
        submittedFormId: json["submittedFormId"] == null
            ? null
            : SubmittedFormId.fromJson(json["submittedFormId"]),
        groupServiceId: json["groupServiceId"] == null
            ? null
            : GroupServiceId.fromJson(json["groupServiceId"]),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "individualService": individualService,
        "categoryId": categoryId?.toJson(),
        "assetsId": assetsId == null
            ? []
            : List<dynamic>.from(assetsId!.map((x) => x.toJson())),
        "serviceType": serviceType,
        "serviceFrequency": serviceFrequency,
        "date": date?.toIso8601String(),
        "expireDate": expireDate?.toIso8601String(),
        "submittedFormId": submittedFormId?.toJson(),
        "groupServiceId": groupServiceId,
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
  String? building;
  ProductId? productId;
  String? type;
  String? location;

  AssetsId({
    this.id,
    this.assetId,
    this.building,
    this.productId,
    this.type,
    this.location,
  });

  factory AssetsId.fromJson(Map<String, dynamic> json) => AssetsId(
        id: json["_id"],
        assetId: json["assetId"],
        building: json["building"],
        productId: json["productId"] == null
            ? null
            : ProductId.fromJson(json["productId"]),
        type: json["type"],
        location: json["location"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "assetId": assetId,
        "building": building,
        "productId": productId?.toJson(),
        "type": type,
        "location": location,
      };
}

class ProductId {
  String? id;
  String? productName;

  ProductId({
    this.id,
    this.productName,
  });

  factory ProductId.fromJson(Map<String, dynamic> json) => ProductId(
        id: json["_id"],
        productName: json["productName"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "productName": productName,
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

class SubmittedFormId {
  String? id;
  String? serviceTicketId;
  String? geoCheck;
  String? reportNo;
  String? sectionName;
  List<Question>? questions;
  List<dynamic>? images;
  String? status;
  List<dynamic>? rejectedLogs;
  DateTime? createdAt;
  DateTime? updatedAt;
  String? managerRemark;
  int? v;

  SubmittedFormId({
    this.id,
    this.serviceTicketId,
    this.geoCheck,
    this.reportNo,
    this.sectionName,
    this.questions,
    this.images,
    this.status,
    this.rejectedLogs,
    this.createdAt,
    this.updatedAt,
    this.managerRemark,
    this.v,
  });

  factory SubmittedFormId.fromJson(Map<String, dynamic> json) =>
      SubmittedFormId(
        id: json["_id"],
        serviceTicketId: json["serviceTicketId"],
        geoCheck: json["geoCheck"],
        reportNo: json["reportNo"],
        sectionName: json["sectionName"],
        questions: json["questions"] == null
            ? []
            : List<Question>.from(
                json["questions"]!.map((x) => Question.fromJson(x))),
        images: json["images"] == null
            ? []
            : List<dynamic>.from(json["images"]!.map((x) => x)),
        status: json["status"],
        rejectedLogs: json["rejectedLogs"] == null
            ? []
            : List<dynamic>.from(json["rejectedLogs"]!.map((x) => x)),
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        managerRemark: json['managerRemark'] ?? "",
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "serviceTicketId": serviceTicketId,
        "geoCheck": geoCheck,
        "reportNo": reportNo,
        "sectionName": sectionName,
        "questions": questions == null
            ? []
            : List<dynamic>.from(questions!.map((x) => x.toJson())),
        "images":
            images == null ? [] : List<dynamic>.from(images!.map((x) => x)),
        "status": status,
        "rejectedLogs": rejectedLogs == null
            ? []
            : List<dynamic>.from(rejectedLogs!.map((x) => x)),
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "managerRemark":managerRemark,
        "__v": v,
      };
}

class Question {
  String? question;
  String? answer;
  String? note;

  Question({
    this.question,
    this.answer,
    this.note,
  });

  factory Question.fromJson(Map<String, dynamic> json) => Question(
        question: json["question"],
        answer: json["answer"],
        note: json["note"],
      );

  Map<String, dynamic> toJson() => {
        "question": question,
        "answer": answer,
        "note": note,
      };
}
