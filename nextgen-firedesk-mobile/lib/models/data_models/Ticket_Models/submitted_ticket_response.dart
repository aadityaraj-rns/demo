// To parse this JSON data, do
//
//     final ticketSubmittedResponse = ticketSubmittedResponseFromJson(jsonString);

import 'dart:convert';

TicketSubmittedResponse ticketSubmittedResponseFromJson(String str) => TicketSubmittedResponse.fromJson(json.decode(str));

String ticketSubmittedResponseToJson(TicketSubmittedResponse data) => json.encode(data.toJson());

class TicketSubmittedResponse {
    TicketResponse? ticketResponse;

    TicketSubmittedResponse({
        this.ticketResponse,
    });

    factory TicketSubmittedResponse.fromJson(Map<String, dynamic> json) => TicketSubmittedResponse(
        ticketResponse: json["ticketResponse"] == null ? null : TicketResponse.fromJson(json["ticketResponse"]),
    );

    Map<String, dynamic> toJson() => {
        "ticketResponse": ticketResponse?.toJson(),
    };
}

class TicketResponse {
    Images? images;
    String? id;
    String? ticketId;
    PlantId? plantId;
    AssetsId? assetsId;
    TechnicianId? technicianId;
    String? status;
    String? technicianRemark;
    List<Question>? questions;
    DateTime? createdAt;
    DateTime? updatedAt;
    int? ticketReportNo;
    int? v;

    TicketResponse({
        this.images,
        this.id,
        this.ticketId,
        this.plantId,
        this.assetsId,
        this.technicianId,
        this.status,
        this.technicianRemark,
        this.questions,
        this.createdAt,
        this.updatedAt,
        this.ticketReportNo,
        this.v,
    });

    factory TicketResponse.fromJson(Map<String, dynamic> json) => TicketResponse(
        images: json["images"] == null ? null : Images.fromJson(json["images"]),
        id: json["_id"],
        ticketId: json["ticketId"],
        plantId: json["plantId"] == null ? null : PlantId.fromJson(json["plantId"]),
        assetsId: json["assetsId"] == null ? null : AssetsId.fromJson(json["assetsId"]),
        technicianId: json["technicianId"] == null ? null : TechnicianId.fromJson(json["technicianId"]),
        status: json["status"],
        technicianRemark: json["technicianRemark"],
        questions: json["questions"] == null ? [] : List<Question>.from(json["questions"]!.map((x) => Question.fromJson(x))),
        createdAt: json["createdAt"] == null ? null : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null ? null : DateTime.parse(json["updatedAt"]),
        ticketReportNo: json["ticketReportNo"],
        v: json["__v"],
    );

    Map<String, dynamic> toJson() => {
        "images": images?.toJson(),
        "_id": id,
        "ticketId": ticketId,
        "plantId": plantId?.toJson(),
        "assetsId": assetsId?.toJson(),
        "technicianId": technicianId?.toJson(),
        "status": status,
        "technicianRemark": technicianRemark,
        "questions": questions == null ? [] : List<dynamic>.from(questions!.map((x) => x.toJson())),
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "ticketReportNo": ticketReportNo,
        "__v": v,
    };
}

class AssetsId {
    String? id;
    String? assetId;
    ProductId? productId;
    String? model;

    AssetsId({
        this.id,
        this.assetId,
        this.productId,
        this.model,
    });

    factory AssetsId.fromJson(Map<String, dynamic> json) => AssetsId(
        id: json["_id"],
        assetId: json["assetId"],
        productId: json["productId"] == null ? null : ProductId.fromJson(json["productId"]),
        model: json["model"],
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "assetId": assetId,
        "productId": productId?.toJson(),
        "model": model,
    };
}

class ProductId {
    String? id;
    String? description;

    ProductId({
        this.id,
        this.description,
    });

    factory ProductId.fromJson(Map<String, dynamic> json) => ProductId(
        id: json["_id"],
        description: json["description"],
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "description": description,
    };
}

class Images {
    String? ticketimage1;
    String? ticketimage2;
    String? ticketimage3;

    Images({
        this.ticketimage1,
        this.ticketimage2,
        this.ticketimage3,
    });

    factory Images.fromJson(Map<String, dynamic> json) => Images(
        ticketimage1: json["ticketimage1"],
        ticketimage2: json["ticketimage2"],
        ticketimage3: json["ticketimage3"],
    );

    Map<String, dynamic> toJson() => {
        "ticketimage1": ticketimage1,
        "ticketimage2": ticketimage2,
        "ticketimage3": ticketimage3,
    };
}

class PlantId {
    String? id;
    String? plantName;
    String? address;

    PlantId({
        this.id,
        this.plantName,
        this.address,
    });

    factory PlantId.fromJson(Map<String, dynamic> json) => PlantId(
        id: json["_id"],
        plantName: json["plantName"],
        address: json["address"],
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "plantName": plantName,
        "address": address,
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

class TechnicianId {
    String? id;
    String? name;

    TechnicianId({
        this.id,
        this.name,
    });

    factory TechnicianId.fromJson(Map<String, dynamic> json) => TechnicianId(
        id: json["_id"],
        name: json["name"],
    );

    Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
    };
}
