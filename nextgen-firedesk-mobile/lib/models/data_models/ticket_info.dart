class TicketInfo {
  final int id;
  final String title;
  final String description;

  TicketInfo({required this.id, required this.title, required this.description});

  factory TicketInfo.fromJson(Map<String, dynamic> json) {
    return TicketInfo(
      id: json['id'],
      title: json['title'],
      description: json['description'],
    );
  }
}