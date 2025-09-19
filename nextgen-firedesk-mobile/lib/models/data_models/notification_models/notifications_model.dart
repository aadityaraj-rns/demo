// To parse this JSON data, do
//
//     final notifications = notificationsFromJson(jsonString);

import 'dart:convert';

List<Notifications> notificationsFromJson(String str) =>
    List<Notifications>.from(
        json.decode(str).map((x) => Notifications.fromJson(x)));

String notificationsToJson(List<Notifications> data) =>
    json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class Notifications {
  String? id;
  String? userId;
  String? title;
  String? message;
  DateTime? createdAt;
  DateTime? updatedAt;
  bool read;

  Notifications({
    this.id,
    this.userId,
    this.title,
    this.message,
    this.createdAt,
    this.updatedAt,
    required this.read,
  });

  factory Notifications.fromJson(Map<String, dynamic> json) => Notifications(
        id: json["_id"],
        userId: json["userId"],
        title: json["title"],
        message: json["message"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.tryParse(json["createdAt"]) ??
                DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.tryParse(json["updatedAt"]) ??
                DateTime.parse(json["updatedAt"]),
          read: json["read"] == null
            ? null : json["read"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "userId": userId,
        "title": title,
        "message": message,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "read":read,
      };
}
