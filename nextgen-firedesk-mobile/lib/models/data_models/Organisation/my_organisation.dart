// To parse this JSON data, do
//
//     final myOrganisationInfo = myOrganisationInfoFromJson(jsonString);

import 'dart:convert';

MyOrganisationInfo myOrganisationInfoFromJson(String str) =>
    MyOrganisationInfo.fromJson(json.decode(str));

String myOrganisationInfoToJson(MyOrganisationInfo data) =>
    json.encode(data.toJson());

class MyOrganisationInfo {
  List<Organization>? organization;

  MyOrganisationInfo({
    this.organization,
  });

  factory MyOrganisationInfo.fromJson(Map<String, dynamic> json) =>
      MyOrganisationInfo(
        organization: json["organization"] == null
            ? []
            : List<Organization>.from(
                json["organization"]!.map((x) => Organization.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "organization": organization == null
            ? []
            : List<dynamic>.from(organization!.map((x) => x.toJson())),
      };
}

class Organization {
  String? id;
  UserId? userId;
  CityId? cityId;
  String? industryId;
  String? clientType;
  List<Category>? categories;
  String? gst;
  String? pincode;
  String? address;
  DateTime? createdAt;
  DateTime? updatedAt;
  int? v;
  String? footerImage;
  String? headerImage;

  Organization({
    this.id,
    this.userId,
    this.cityId,
    this.industryId,
    this.clientType,
    this.categories,
    this.gst,
    this.pincode,
    this.address,
    this.createdAt,
    this.updatedAt,
    this.v,
    this.footerImage,
    this.headerImage,
  });

  factory Organization.fromJson(Map<String, dynamic> json) => Organization(
        id: json["_id"],
        userId: json["userId"] == null ? null : UserId.fromJson(json["userId"]),
        cityId: json["cityId"] == null ? null : CityId.fromJson(json["cityId"]),
        industryId: json["industryId"],
        clientType: json["clientType"],
        categories: json["categories"] == null
            ? []
            : List<Category>.from(
                json["categories"]!.map((x) => Category.fromJson(x))),
        gst: json["gst"],
        pincode: json["pincode"],
        address: json["address"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        v: json["__v"],
        footerImage: json["footerImage"],
        headerImage: json["headerImage"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "userId": userId?.toJson(),
        "cityId": cityId?.toJson(),
        "industryId": industryId,
        "clientType": clientType,
        "categories": categories == null
            ? []
            : List<dynamic>.from(categories!.map((x) => x.toJson())),
        "gst": gst,
        "pincode": pincode,
        "address": address,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "__v": v,
        "footerImage": footerImage,
        "headerImage": headerImage,
      };
}

class Category {
  String? categoryId;
  String? id;
  ServiceDetails? serviceDetails;

  Category({
    this.categoryId,
    this.id,
    this.serviceDetails,
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
        categoryId: json["categoryId"],
        id: json["_id"],
        serviceDetails: json["serviceDetails"] == null
            ? null
            : ServiceDetails.fromJson(json["serviceDetails"]),
      );

  Map<String, dynamic> toJson() => {
        "categoryId": categoryId,
        "_id": id,
        "serviceDetails": serviceDetails?.toJson(),
      };
}

class ServiceDetails {
  ServiceFrequency? serviceFrequency;
  DateTime? endDate;
  DateTime? startDate;
  String? id;

  ServiceDetails({
    this.serviceFrequency,
    this.endDate,
    this.startDate,
    this.id,
  });

  factory ServiceDetails.fromJson(Map<String, dynamic> json) => ServiceDetails(
        serviceFrequency: json["serviceFrequency"] == null
            ? null
            : ServiceFrequency.fromJson(json["serviceFrequency"]),
        endDate:
            json["endDate"] == null ? null : DateTime.parse(json["endDate"]),
        startDate: json["startDate"] == null
            ? null
            : DateTime.parse(json["startDate"]),
        id: json["_id"],
      );

  Map<String, dynamic> toJson() => {
        "serviceFrequency": serviceFrequency?.toJson(),
        "endDate": endDate?.toIso8601String(),
        "startDate": startDate?.toIso8601String(),
        "_id": id,
      };
}

class ServiceFrequency {
  String? inspection;
  String? maintenance;
  String? testing;

  ServiceFrequency({
    this.inspection,
    this.maintenance,
    this.testing,
  });

  factory ServiceFrequency.fromJson(Map<String, dynamic> json) =>
      ServiceFrequency(
        inspection: json["inspection"],
        maintenance: json["maintenance"],
        testing: json["testing"],
      );

  Map<String, dynamic> toJson() => {
        "inspection": inspection,
        "maintenance": maintenance,
        "testing": testing,
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

class UserId {
  String? id;
  String? name;
  String? phone;
  String? email;
  String? loginId;
  String? profile;

  UserId({
    this.id,
    this.name,
    this.phone,
    this.email,
    this.loginId,
    this.profile,
  });

  factory UserId.fromJson(Map<String, dynamic> json) => UserId(
        id: json["_id"],
        name: json["name"],
        phone: json["phone"],
        email: json["email"],
        loginId: json["loginID"],
        profile: json["profile"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "phone": phone,
        "email": email,
        "loginID": loginId,
        "profile": profile,
      };
}
