// To parse this JSON data, do
//
//     final submittedServiceInfo = submittedServiceInfoFromJson(jsonString);

import 'dart:convert';

SubmittedServiceInfo submittedServiceInfoFromJson(String str) => SubmittedServiceInfo.fromJson(json.decode(str));

String submittedServiceInfoToJson(SubmittedServiceInfo data) => json.encode(data.toJson());

class SubmittedServiceInfo {
    String? id;
    ServiceTicketId? serviceTicketId;
    String? geoCheck;
    String? reportNo;
    String? sectionName;
    List<Question>? questions;
    List<dynamic>? images;
    String? status;
    DateTime? createdAt;
    DateTime? updatedAt;
    int? v;

    SubmittedServiceInfo({
        this.id,
        this.serviceTicketId,
        this.geoCheck,
        this.reportNo,
        this.sectionName,
        this.questions,
        this.images,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.v,
    });

    factory SubmittedServiceInfo.fromJson(Map<String, dynamic> json) => SubmittedServiceInfo(
        id: json["_id"],
        serviceTicketId: json["serviceTicketId"] == null ? null : ServiceTicketId.fromJson(json["serviceTicketId"]),
        geoCheck: json["geoCheck"],
        reportNo: json["reportNo"],
        sectionName: json["sectionName"],
        questions: json["questions"] == null ? [] : List<Question>.from(json["questions"]!.map((x) => Question.fromJson(x))),
        images: json["images"] == null ? [] : List<dynamic>.from(json["images"]!.map((x) => x)),
        status: json["status"],
        createdAt: json["createdAt"] == null ? null : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null ? null : DateTime.parse(json["updatedAt"]),
        v: json["__v"],
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "serviceTicketId": serviceTicketId?.toJson(),
        "geoCheck": geoCheck,
        "reportNo": reportNo,
        "sectionName": sectionName,
        "questions": questions == null ? [] : List<dynamic>.from(questions!.map((x) => x.toJson())),
        "images": images == null ? [] : List<dynamic>.from(images!.map((x) => x)),
        "status": status,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
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

class ServiceTicketId {
    String? id;
    String? plantId;
    List<String>? assetsId;
    String? serviceType;
    String? serviceFrequency;

    ServiceTicketId({
        this.id,
        this.plantId,
        this.assetsId,
        this.serviceType,
        this.serviceFrequency,
    });

    factory ServiceTicketId.fromJson(Map<String, dynamic> json) => ServiceTicketId(
        id: json["_id"],
        plantId: json["plantId"],
        assetsId: json["assetsId"] == null ? [] : List<String>.from(json["assetsId"]!.map((x) => x)),
        serviceType: json["serviceType"],
        serviceFrequency: json["serviceFrequency"],
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "plantId": plantId,
        "assetsId": assetsId == null ? [] : List<dynamic>.from(assetsId!.map((x) => x)),
        "serviceType": serviceType,
        "serviceFrequency": serviceFrequency,
    };
}
