const express = require("express");
const router = express.Router();
const technicianController = require("../controller/organization/technician/technicianController");
const myAssetsController = require("../controller/technician/myAssetsController");
const technicianServiceController = require("../controller/technician/service/technicianServiceController");
const myPlantController = require("../controller/technician/plant/myPlantController");
const technicianTicketsController = require("../controller/technician/tickets/ticketsController");
const calenderController = require("../controller/technician/calender/calenderController");
const technicianProfile = require("../controller/technician/profile/technicianProfile");
const reportsController = require("../controller/technician/reports/reportsController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer.middleware");

// from here technician api start
// login
router.post("/registerCheck", technicianController.registerCheck);
router.post("/login", technicianController.login);
router.put(
  "/deactive-account/:technicianUserId",
  auth,
  technicianController.deactiveAccount
);
router.post("/logout", auth, technicianController.logout);
// technician profile
router.get("/my-profile/:technicianUserId", auth, technicianProfile.myProfile);
router.get("/my-assets", auth, myAssetsController.getMyAssets);
router.post("/asset-detail/:assetId", auth, myAssetsController.getAssetById);
router.put("/update-location", auth, myAssetsController.updateLocation);
router.get(
  "/get-assets-details-by-scanner-id/:id",
  auth,
  myAssetsController.getAssetsDetailsByScannerId
);
router.get(
  "/my-due-service-tickets-by-plant/:plantId",
  auth,
  technicianServiceController.getMyDueServiceTickets
);
router.get(
  "/get-service-details-by-service-id/:serviceTicketId",
  auth,
  technicianServiceController.getServiceDetailsByServiceId
);

// router.post(
//   "/my-upcoming-service",
//   auth,
//   technicianServiceController.getMyUpcomingService
// );
// router.post(
//   "/my-incomplete-service",
//   auth,
//   technicianServiceController.getMyIncompleteService
// );
router.get("/my-plants", auth, myPlantController.getMyPlants);
router.get("/get-my-plant-names", auth, myPlantController.getMyPlantNames);
router.get("/plant/:plantId", auth, myPlantController.getPlantById);
router.get("/my-organization", auth, myPlantController.getMyOrganization);
// router.get(
//   "/my-in-progress-service/:technicianUserId",
//   auth,
//   technicianServiceController.myInProgressService
// );
router.post(
  "/service-by-status",
  auth,
  technicianServiceController.getServicesByStatus
);
// router.get(
//   "/approval-pending-service-tickets-by-plant/:plantId",
//   auth,
//   technicianServiceController.approvalPendingServiceTickets
// );
// router.get(
//   "/approval-rejected-service-tickets-by-plant/:plantId",
//   auth,
//   technicianServiceController.approvalRejectedServiceTickets
// );
// router.get(
//   "/approval-approved-service-tickets-by-plant/:plantId",
//   auth,
//   technicianServiceController.approvalApprovedServiceTickets
// );
router.get(
  "/services/details/:assetId", //same as asset-detail
  auth,
  myAssetsController.getServiceAssetById
);

// router.get("/my-tickets", auth, technicianTicketsController.getAllTickets);
router.post(
  "/my-incompleted-tickets",
  auth,
  technicianTicketsController.incompletedTicketService
);
router.post(
  "/my-upcoming-tickets",
  auth,
  technicianTicketsController.upcomingTicketService
);
router.get(
  "/get-service-form/:serviceTicketId",
  auth,
  technicianServiceController.getServiceForm
);
router.post(
  "/submit-service-form",
  auth,
  technicianServiceController.submitServiceForm
);
router.post(
  "/update-service-form-image",
  auth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  technicianServiceController.updateServiceFormImage
);
// calender
router.post("/get-calender-dates", auth, calenderController.getServiceDates);
// router.post(
//   "/get-service-and-ticket",
//   auth,
//   calenderController.getTicketsAndService
// );
router.post(
  "/get-service-and-ticket-by-date",
  auth,
  calenderController.getServiceAndTicketByDate
);

// GET Ticket Details By ID
router.get(
  "/ticket-details/:ticketId",
  auth,
  technicianTicketsController.getTicketDetailsById
);
router.get(
  "/tickets-by-status/:status/:plantId",
  auth,
  technicianTicketsController.getTicketsByStatus
);
router.post(
  "/store-ticket-response",
  auth,
  upload.fields([
    { name: "ticketimage1", maxCount: 1 },
    { name: "ticketimage2", maxCount: 1 },
    { name: "ticketimage3", maxCount: 1 },
  ]),
  technicianTicketsController.StoreTicketResponse
);

// technician report
router.post("/service-report", auth, reportsController.serviceReport);
// getTicketResponseById
router.get(
  "/ticket-response/:responseId",
  auth,
  technicianTicketsController.getTicketResponseById
);

router.put(
  "/edit-profile",
  auth,
  upload.fields([{ name: "profile", maxCount: 1 }]),
  technicianProfile.editProfile
);
router.get(
  "/my-service-form/:_id",
  auth,
  technicianServiceController.myServiceForm
);

module.exports = router;
