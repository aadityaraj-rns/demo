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
  bool? auth;
  String? accessToken;
  String? refreshToken;

  TechnicianProfile({
    this.technician,
    this.auth,
    this.accessToken,
    this.refreshToken,
  });

  factory TechnicianProfile.fromJson(Map<String, dynamic> json) =>
      TechnicianProfile(
        technician:
            json["technician"] == null
                ? null
                : Technician.fromJson(json["technician"]),
        auth: json["auth"],
        accessToken: json["accessToken"],
        refreshToken: json["refreshToken"],
      );

  Map<String, dynamic> toJson() => {
    "technician": technician?.toJson(),
    "auth": auth,
    "accessToken": accessToken,
    "refreshToken": refreshToken,
  };
}

class Technician {
  String? id;
  String? userType;
  String? name;
  String? phone;
  String? email;
  String? address;
  String? designation;
  String? organisationname;

  Technician({
    this.id,
    this.userType,
    this.name,
    this.phone,
    this.email,
    this.address,
    this.designation,
    this.organisationname,
  });

  factory Technician.fromJson(Map<String, dynamic> json) => Technician(
    id: json["_id"],
    userType: json["userType"],
    name: json["name"],
    phone: json["phone"],
    email: json["email"],
    address: json["address"],
    designation: json["designation"],
    organisationname: json["organisationname"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "userType": userType,
    "name": name,
    "phone": phone,
    "email": email,
    "address": address,
    "designation": designation,
    "organisationname": organisationname,
  };
}
