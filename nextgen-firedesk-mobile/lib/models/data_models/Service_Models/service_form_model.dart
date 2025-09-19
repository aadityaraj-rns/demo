import 'dart:convert';

ServiceForm serviceFormFromJson(String str) =>
    ServiceForm.fromJson(json.decode(str));

String serviceFormToJson(ServiceForm data) => json.encode(data.toJson());

class ServiceForm{
  Form? form;
  String? formName;
  String? formId;

  ServiceForm({
    this.form,
    this.formName,
    this.formId,
  });

  factory ServiceForm.fromJson(Map<String, dynamic> json) => ServiceForm(
        form: json["form"] == null ? null : Form.fromJson(json["form"]),
        formName: json["formName"],
        formId: json["serviceTicketId"],
      );

  Map<String, dynamic> toJson() => {
        "form": form?.toJson(),
        "formName": formName,
        "formId": formId,
      };
}

class Form {
  String? name;
  List<Question>? questions;
  String? id;
  String? testFrequency;
  String? serviceType;

  Form({
    this.name,
    this.questions,
    this.id,
    this.testFrequency,
    this.serviceType,
  });

  factory Form.fromJson(Map<String, dynamic> json) => Form(
        name: json["name"],
        questions: json["questions"] == null
            ? []
            : List<Question>.from(
                json["questions"]!.map((x) => Question.fromJson(x))),
        id: json["_id"],
        testFrequency: json["testFrequency"],
        serviceType: json["serviceType"],
      );

  Map<String, dynamic> toJson() => {
        "name": name,
        "questions": questions == null
            ? []
            : List<dynamic>.from(questions!.map((x) => x.toJson())),
        "_id": id,
        "testFrequency": testFrequency,
        "serviceType": serviceType,
      };
}

class Question {
  String? id;
  String? question;

  Question({
    this.id,
    this.question,
  });

  factory Question.fromJson(Map<String, dynamic> json) => Question(
        id: json["_id"],
        question: json["question"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "question": question,
      };
}
