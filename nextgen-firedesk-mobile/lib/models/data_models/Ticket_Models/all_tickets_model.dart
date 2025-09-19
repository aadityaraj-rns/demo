// To parse this JSON data, do
//
//     final ticketsByStatus = ticketsByStatusFromJson(jsonString);

import 'dart:convert';

TicketsByStatus ticketsByStatusFromJson(String str) =>
    TicketsByStatus.fromJson(json.decode(str));

String ticketsByStatusToJson(TicketsByStatus data) =>
    json.encode(data.toJson());

class TicketsByStatus {
  List<Ticket>? tickets;

  TicketsByStatus({
    this.tickets,
  });

  factory TicketsByStatus.fromJson(Map<String, dynamic> json) =>
      TicketsByStatus(
        tickets: json["tickets"] == null
            ? []
            : List<Ticket>.from(
                json["tickets"]!.map((x) => Ticket.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "tickets": tickets == null
            ? []
            : List<dynamic>.from(tickets!.map((x) => x.toJson())),
      };
}

class Ticket {
  String? id;
  String? orgUserId;
  String? plantId;
  String? assetsId;
  String? assetId;
  String? ticketId;
  AssetDetails? assetDetails;
  TicketResponse? ticketResponse;
  Technician? technician;
  List<String>? taskNames;
  String? taskDescription;
  DateTime? targetDate;
  String? ticketType;
  String? completedStatus;

  Ticket({
    this.id,
    this.orgUserId,
    this.plantId,
    this.assetsId,
    this.assetId,
    this.ticketId,
    this.assetDetails,
    this.ticketResponse,
    this.technician,
    this.taskNames,
    this.taskDescription,
    this.targetDate,
    this.ticketType,
    this.completedStatus,
  });

  factory Ticket.fromJson(Map<String, dynamic> json) => Ticket(
        id: json["_id"],
        orgUserId: json["orgUserId"],
        plantId: json["plantId"],
        assetsId: json["assetsId"],
        assetId: json['assetId'].toString(),
        ticketId: json['ticketId'].toString(),
        assetDetails: json["assetDetails"] == null
            ? null
            : AssetDetails.fromJson(json["assetDetails"]),
        ticketResponse: json["ticketResponse"] == null
            ? null
            : TicketResponse.fromJson(json["ticketResponse"]),
        technician: json["technician"] == null
            ? null
            : Technician.fromJson(json["technician"]),
        taskNames: json["taskNames"] == null
            ? []
            : List<String>.from(json["taskNames"]!.map((x) => x)),
        taskDescription: json["taskDescription"],
        targetDate: json["targetDate"] == null
            ? null
            : DateTime.parse(json["targetDate"]),
        ticketType: json["ticketType"],
        completedStatus: json["completedStatus"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "orgUserId": orgUserId,
        "plantId": plantId,
        "assetsId": assetsId,
        "assetId": assetId,
        "ticketId": ticketId,
        "assetDetails": assetDetails?.toJson(),
        "ticketResponse": ticketResponse?.toJson(),
        "technician": technician?.toJson(),
        "taskNames": taskNames == null
            ? []
            : List<dynamic>.from(taskNames!.map((x) => x)),
        "taskDescription": taskDescription,
        "targetDate": targetDate?.toIso8601String(),
        "ticketType": ticketType,
        "completedStatus": completedStatus,
      };
}

class AssetDetails {
  String? model;
  String? slNo;
  String? moc;
  String? fuelCapacity;
  String? healthStatus;
  String? tag;
  DateTime? nextServiceDate;
  String? lat;
  String? long;

  AssetDetails({
    this.model,
    this.slNo,
    this.moc,
    this.fuelCapacity,
    this.healthStatus,
    this.tag,
    this.nextServiceDate,
    this.lat,
    this.long,
  });

  factory AssetDetails.fromJson(Map<String, dynamic> json) => AssetDetails(
        model: json["model"],
        slNo: json["slNo"],
        moc: json["moc"],
        fuelCapacity: json["fuelCapacity"],
        healthStatus: json["healthStatus"],
        tag: json["tag"],
        nextServiceDate: json["nextServiceDate"] == null
            ? null
            : DateTime.parse(
                json["nextServiceDate"],
              ),
        lat: json['lat'],
        long: json['long'],
      );

  Map<String, dynamic> toJson() => {
        "model": model,
        "slNo": slNo,
        "moc": moc,
        "fuelCapacity": fuelCapacity,
        "healthStatus": healthStatus,
        "tag": tag,
        "nextServiceDate": nextServiceDate?.toIso8601String(),
        "lat": lat,
        "long": long,
      };
}

class Technician {
  String? id;
  String? name;

  Technician({
    this.id,
    this.name,
  });

  factory Technician.fromJson(Map<String, dynamic> json) => Technician(
        id: json["_id"],
        name: json["name"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
      };
}

TicketResponse ticketResponseFromJson(String str) =>
    TicketResponse.fromJson(json.decode(str));

String ticketResponseToJson(TicketResponse data) => json.encode(data.toJson());

class TicketResponse {
  String? id;
  String? status;
  String? technicianRemarks;
  List<Question>? questions;
  String? managerRemark;

  TicketResponse({
    this.id,
    this.status,
    this.technicianRemarks,
    this.questions,
    this.managerRemark,
  });

  factory TicketResponse.fromJson(Map<String, dynamic> json) => TicketResponse(
        id: json['_id'],
        status: json["status"],
        technicianRemarks: json["technicianRemarks"],
        questions: json["questions"] == null
            ? []
            : List<Question>.from(
                json["questions"]!.map((x) => Question.fromJson(x))),
        managerRemark: json["managerRemark"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "status": status,
        "technicianRemarks": technicianRemarks,
        "questions": questions == null
            ? []
            : List<dynamic>.from(questions!.map((x) => x.toJson())),
        "managerRemark": managerRemark,
      };
}

class Question {
  String? question;
  String? answer;
  String? note;
  String? id;

  Question({
    this.question,
    this.answer,
    this.note,
    this.id,
  });

  factory Question.fromJson(Map<String, dynamic> json) => Question(
        question: json["question"],
        answer: json["answer"],
        note: json["note"],
        id: json["_id"],
      );

  Map<String, dynamic> toJson() => {
        "question": question,
        "answer": answer,
        "note": note,
        "_id": id,
      };
}
