class ServiceForm {
  final List<Section> inspectionData;
  final List<Section> maintenanceData;
  final List<Section> testingData;

  ServiceForm({
    required this.inspectionData,
    required this.maintenanceData,
    required this.testingData,
  });
}

class Section {
  final String name;
  final List<Question2> questions;

  Section({
    required this.name,
    required this.questions,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'questions': questions.map((q) => q.toJson()).toList(),
    };
  }
}

class Question2 {
  final String question;
  String? answer;
  String? note;

  Question2({
    required this.question,
    this.answer,
    this.note,
  });

  Map<String, dynamic> toJson() {
    return {
      'question': question,
      'answer': answer,
      'note': note,
    };
  }
}
