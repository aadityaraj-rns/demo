class ApiUrls {
  static const String basicUrl = "https://demoapi.firedesk.in/technician";
  // static const String basicUrl = "https://testapi.firedesk.in/technician";
  // static const String basicUrl =
  //     "https://firedest-backend-api.onrender.com/technician";
  // static const String basicUrl =
  //     "https://firedest-backend-api.onrender.com/technician";
  static const String phoneVerifyUrl = "$basicUrl/registercheck";
  static const String otpverifyUrl = "$basicUrl/login";
  static const String logoutUrl = "$basicUrl/logout";
  static const String fetchmyassetsUrl = "$basicUrl/my-assets";
  static const String fetchServicesByStatusUrl = "$basicUrl/service-by-status";
  static const String fetchTicketsUrl = basicUrl;
  static const String fetchNotificationsUrl =
      "https://demoapi.firedesk.in/my-notifications";
  static const String updateNotificationsStatusUrl =
      "https://demoapi.firedesk.in/notification-mark-as-read";
  static const String fetchAssetInfoUrl = "$basicUrl/asset-detail";
  static const String fetchAssetInfoByScannerIdUrl =
      "$basicUrl/get-assets-details-by-scanner-id";
  static const String fetchServiceInfoUrl =
      "$basicUrl/get-service-details-by-service-id";
  static const String fetchSubmittedServiceInfoUrl =
      "$basicUrl/my-service-form";
  // static const String fetchInprogressServices =
  //     "$basicUrl/my-in-progress-service";
  // static const String fetchUpcomingServices = "$basicUrl/my-upcoming-service";
  // static const String fetchIncompleteServices =
  //     "$basicUrl/my-incomplete-service";
  static const String fetchDueServices =
      "$basicUrl/my-due-service-tickets-by-plant";
  static const String fetchTicketInfoUrl = basicUrl;
  static const String fetchProfileDataUrl = "$basicUrl/my-profile";
  static const String fetchPlantsUrl = "$basicUrl/my-plants";
  static const String fetchPlantInfoUrl = "$basicUrl/plant";
  static const String fetchOrganisationInfo = "$basicUrl/my-organization";
  static const String fetchMonthDataUrl = "$basicUrl/get-calender-dates";
  static const String fetchDateDataUrl =
      "$basicUrl/get-service-and-ticket-by-date";
  static const String fetchIncompleteTickets =
      "$basicUrl/my-incompleted-tickets";
  static const String fetchInProgressTickets = "$basicUrl/my-upcoming-tickets";
  static const String getServiceForm = "$basicUrl/get-service-form";
  static const String submitServiceForm = "$basicUrl/submit-service-form";
  static const String uploadServicesImage =
      "$basicUrl/update-service-form-image";
  static const String fetchTicketsByStatus = "$basicUrl/tickets-by-status";
  static const String submitTicket = "$basicUrl/store-ticket-response";
  static const String updateProfile = "$basicUrl/edit-profile";
  static const String deActivateAccount = "$basicUrl/deactive-account";
  static const String ticketSubmittedDataUrl = "$basicUrl/ticket-response";
  static const String updateLocationUrl = "$basicUrl/update-location";
}
