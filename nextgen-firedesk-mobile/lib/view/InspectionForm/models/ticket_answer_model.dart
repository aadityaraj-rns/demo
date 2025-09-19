class TicketQUestionAnswer {
  final String question;
  String? answer;
  String note;

  TicketQUestionAnswer({
    required this.question,
    this.answer,
    this.note = '',
  });

  Map<String, dynamic> toJson() {
    return {
      'question': question,
      'answer': answer,
      'note': note,
    };
  }
}
