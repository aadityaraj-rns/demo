import 'dart:convert';

List<DueServices> dueServicesFromJson(String str) => List<DueServices>.from(
    json.decode(str).map((x) => DueServices.fromJson(x)));

String dueServicesToJson(List<DueServices> data) =>
    json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class DueServices {
  String? id;
  bool? individualService;
  CategoryId? categoryId;
  List<AssetsId>? assetsId;
  String? serviceType;
  String? serviceFrequency;
  DateTime? date;
  DateTime? expireDate;
  GroupServiceId? groupServiceId;

  DueServices({
    this.id,
    this.individualService,
    this.categoryId,
    this.assetsId,
    this.serviceType,
    this.serviceFrequency,
    this.date,
    this.expireDate,
    this.groupServiceId,
  });

  factory DueServices.fromJson(Map<String, dynamic> json) => DueServices(
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
        "groupServiceId":groupServiceId,
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
