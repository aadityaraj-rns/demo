// To parse this JSON data, do
//
//     final technicianProfile = technicianProfileFromJson(jsonString);

import 'dart:convert';

TechnicianProfile technicianProfileFromJson(String str) =>
    TechnicianProfile.fromJson(json.decode(str));

String technicianProfileToJson(TechnicianProfile data) =>
    json.encode(data.toJson());

class TechnicianProfile {
  Technician? technician;

  TechnicianProfile({
    this.technician,
  });

  factory TechnicianProfile.fromJson(Map<String, dynamic> json) =>
      TechnicianProfile(
        technician: json["technician"] == null
            ? null
            : Technician.fromJson(json["technician"]),
      );

  Map<String, dynamic> toJson() => {
        "technician": technician?.toJson(),
      };
}

class Technician {
  String? id;
  UserId? userId;
  String? orgId;
  List<String>? plantId;
  String? cityId;
  List<String>? categoryId;
  String? technicianType;
  DateTime? createdAt;
  DateTime? updatedAt;
  int? v;
  String? venderAddress;
  String? venderEmail;
  String? venderName;
  String? venderNumber;

  Technician({
    this.id,
    this.userId,
    this.orgId,
    this.plantId,
    this.cityId,
    this.categoryId,
    this.technicianType,
    this.createdAt,
    this.updatedAt,
    this.v,
    this.venderAddress,
    this.venderEmail,
    this.venderName,
    this.venderNumber,
  });

  factory Technician.fromJson(Map<String, dynamic> json) => Technician(
        id: json["_id"],
        userId: json["userId"] == null ? null : UserId.fromJson(json["userId"]),
        orgId: json["orgId"],
        plantId: json["plantId"] == null
            ? []
            : List<String>.from(json["plantId"]!.map((x) => x)),
        cityId: json["cityId"],
        categoryId: json["categoryId"] == null
            ? []
            : List<String>.from(json["categoryId"]!.map((x) => x)),
        technicianType: json["technicianType"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        v: json["__v"],
        venderAddress: json["venderAddress"],
        venderEmail: json["venderEmail"],
        venderName: json["venderName"],
        venderNumber: json["venderNumber"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "userId": userId?.toJson(),
        "orgId": orgId,
        "plantId":
            plantId == null ? [] : List<dynamic>.from(plantId!.map((x) => x)),
        "cityId": cityId,
        "categoryId": categoryId == null ? [] : List<String>.from(categoryId!.map((x) => x)),
        "technicianType": technicianType,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "__v": v,
        "venderAddress": venderAddress,
        "venderEmail": venderEmail,
        "venderName": venderName,
        "venderNumber": venderNumber,
      };
}

class UserId {
  String? id;
  String? name;
  String? phone;
  String? email;
  String? profile;

  UserId({
    this.id,
    this.name,
    this.phone,
    this.email,
    this.profile,
  });

  factory UserId.fromJson(Map<String, dynamic> json) => UserId(
        id: json["_id"],
        name: json["name"],
        phone: json["phone"],
        email: json["email"],
        profile: json['profile'],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "phone": phone,
        "email": email,
        "profile": profile,
      };
}
