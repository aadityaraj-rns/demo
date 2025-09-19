import "package:intl/intl.dart";

String customDateFormatter(String date) {
  try {
    DateTime dateTime = DateTime.parse(date);
    return DateFormat("dd-MM-yyyy").format(dateTime);
  } catch (e) {
    // Handle the error if the date string is not in a correct format
    return 'Invalid date format';
  }
}

String customDateFormatter2(String date) {
  try {
    DateTime dateTime = DateTime.parse(date);
    return DateFormat("yyyy-MM-dd").format(dateTime);
  } catch (e) {
    // Handle the error if the date string is not in a correct format
    return 'Invalid date format';
  }
}
