const express = require("express");
const organizationController = require("../controller/organization/organizationController");
const dashboardController = require("../controller/organization/dashboard/dashboardController");
const assetController = require("../controller/organization/assets/assetsController");
const auth = require("../middleware/auth");
const groupServiceController = require("../controller/organization/groupService/groupServiceController");
const serviceController = require("../controller/organization/services/serviceController");
const ticketsController = require("../controller/organization/tickets/tickets");
const upload = require("../middleware/multer.middleware");
const auditController = require("../controller/organization/audit/auditController");
const OrganizationCategoryController = require("../controller/organization/category/categoryController");
const archiveController = require("../controller/organization/archive/archiveController");
const customerReportsController = require("../controller/organization/reports/customerReportsController");
const technicianController = require("../controller/organization/technician/technicianController");
const plantController = require("../controller/organization/plant/plantController");
const multer = require("multer");
const bulkUpload = require("../controller/organization/assets/bulkUpload");
const formController = require("../controller/admin/serviceForm/formController");
const router = express.Router();
const upload1 = multer({ dest: "./public/temp" });

router.get("/", (req, res, next) => {
  return res.json({ message: "Hello from organization route" });
});
// from here organization api started
// login
router.post("/login", organizationController.login);
router.get("/forgot-password/:loginID", organizationController.forgotPassword);
router.post("/verify-otp", organizationController.verifyOtp);
router.post("/change-password", organizationController.changePassword);
// get-organization-profile
router.get("/profile", auth, organizationController.getOrganizationProfile);
// organization dashboard
router.post("/dashboard-data", auth, dashboardController.getDashboardData);
router.post(
  "/get-pump-dashboard-data",
  auth,
  dashboardController.getPumpDashboardData
);
router.post(
  "/get-buildings-by-plant-and-category",
  auth,
  dashboardController.getBuildingsByPlantAndCategory
);
router.post(
  "/get-products-by-plant-and-category",
  auth,
  dashboardController.getProductsByPlantAndCategory
);
router.post(
  "/get-types-by-plant-and-category",
  auth,
  dashboardController.getTypesByPlantAndCategory
);
router.post(
  "/get-capacitys-by-plant-and-category",
  auth,
  dashboardController.getCapacitysByPlantAndCategory
);
router.post(
  "/get-hydrostatic-test-overview",
  auth,
  dashboardController.getHydrostaticTestOverview
);
router.post(
  "/get-refill-test-overview",
  auth,
  dashboardController.getRefillTestOverview
);
router.post(
  "/get-asset-distribution-overview",
  auth,
  dashboardController.getAssetDistributionOverview
);

router.post(
  "/dashboard/pump-room/know-more-data",
  auth,
  dashboardController.getPumpKnowMoreData
);
router.get(
  "/get-hp-test-dates/:plantId",
  auth,
  dashboardController.getHpTestDates
);
router.get(
  "/get-refill-dates/:plantId",
  auth,
  dashboardController.getRefillDates
);
router.post(
  "/get-pump-systam-overview",
  auth,
  dashboardController.getPumpSystamOverview
);
router.post(
  "/get-water-level-trend",
  auth,
  dashboardController.getWaterLevelTrend
);
router.post(
  "/get-diesel-level-trend",
  auth,
  dashboardController.getDieselLevelTrend
);
router.post(
  "/get-headerpressure-level-trend",
  auth,
  dashboardController.getHeaderPressureTrend
);
router.post(
  "/get-pump-maintenance-overview-data",
  auth,
  dashboardController.getPumpMaintenanceOverviewData
);
router.post(
  "/dashboard/get-pump-mode-status-trend",
  auth,
  dashboardController.getPumpModeStatusTrend
);
// assets
router.get("/assets", auth, assetController.getAll);
router.get(
  "/get-assets-by-category-id/:categoryId/:plantId",
  auth,
  assetController.getAllAssetNamesByCategoryPlantId
);
router.post(
  "/get-filtered-assets-by-multi-category-single-plant",
  auth,
  assetController.getFilteredAssetsByMultiCategorySinglePlant
);
router.post("/assets", auth, upload.any(), assetController.create);
router.get("/assets/:id", auth, assetController.getById);
router.get(
  "/asset/:id/service-details",
  auth,
  assetController.getAssetServiceDetails
);
router.post(
  "/asset/refill-and-hp-test",
  auth,
  assetController.refillAndHpTestDates
);
router.post("/asset/lat-long-remark", auth, assetController.assetLatLongRemark);
router.get("/asset/unique-tag-names", auth, assetController.uniqueTagNames);
router.get(
  "/assets/:id/get-details-for-add-services",
  auth,
  assetController.getDetailsForAddServices
);
router.get(
  "/assets/get-service-form/:assetId/:serviceType/:serviceFrequency",
  auth,
  serviceController.getServiceFormByAssetIdServiceTypeServiceFrequency
);
router.post(
  "/assets/create-old-service",
  auth,
  serviceController.createOldService
);
//group-service
router.post(
  "/group-service/create",
  auth,
  groupServiceController.createGroupService
);
router.get("/group-service/get", auth, groupServiceController.getGroupServices);
router.get("/group-service/:_id/details", auth, groupServiceController.getById);
router.put(
  "/group-service/edit",
  auth,
  groupServiceController.editGroupService
);
// asset-bulk-upload
router.post(
  "/assets/bulk-upload",
  upload1.single("file"),
  auth,
  bulkUpload.upload
);
router.post(
  "/assets/bulk-asset-service-upload",
  upload1.single("file"),
  auth,
  bulkUpload.bulkAssetServiceUpload
);

// services
router.get("/service-schedules", auth, serviceController.getServiceSchedules);
router.get("/get-service-due", auth, serviceController.getServiceDue);
router.get(
  "/get-completed-services",
  auth,
  serviceController.getCompletedServices
);
router.get("/get-lapsed-services", auth, serviceController.getLapsedServices);
router.get(
  "/get-service-response-by-id/:id",
  auth,
  serviceController.getServiceResponseById
);
router.get(
  "/get-rejected-service-forms/:id",
  auth,
  serviceController.getRejectedServiceForms
);
router.patch(
  "/update-service-response-status/:id",
  auth,
  serviceController.updateServiceResponseStatus
);
router.put(
  "/update-ticket-response-status/:id",
  auth,
  ticketsController.updateTicketResponseStatus
);
router.get("/get-my-categories", auth, serviceController.getMyCategories);
router.get(
  "/getMyAllServiceNames",
  auth,
  serviceController.getMyAllServiceNames
);
router.put("/assets", auth, upload.any(), assetController.edit);

// audit
router.post(
  "/audit",
  auth,
  upload.fields([{ name: "file", maxCount: 1 }]),
  auditController.createAudit
);
router.get("/audit", auth, auditController.getSelfAuditQuestions);
// To get the created audits
router.get("/get-audits", auth, auditController.getAudits);

// route to save the organization self audit form data
router.post(
  "/add-self-audit-form",
  auth,
  auditController.saveSelfAuditFormData
);
router.get("/form/get-form-ids", auth, formController.getFormIds);
router.get("/get-self-audits", auth, auditController.getSelfAuditsById);
router.get("/self-audit/:auditId", auth, auditController.getSelfAuditDetail);

// Archive
router.post(
  "/archive-create",
  auth,
  upload.fields([{ name: "file", maxCount: 1 }]),
  archiveController.create
);
router.put(
  "/edit-archive",
  auth,
  upload.fields([{ name: "file", maxCount: 1 }]),
  archiveController.edit
);
router.delete("/delete-archive/:_id", auth, archiveController.delete);
router.get("/archives-fetch", auth, archiveController.fetchByOrgUserId);

// ticket
router.post("/ticket", auth, ticketsController.createTicket);
router.put("/ticket", auth, ticketsController.editTicket);
router.get("/tickets", auth, ticketsController.getTickets);
router.get(
  "/get-asset-categories",
  auth,
  ticketsController.getMyAssetCategories
);
router.get(
  "/ticket-details/:ticketId",
  auth,
  ticketsController.getTicketDetails
);

// form
router.get(
  "/get-categories",
  auth,
  OrganizationCategoryController.getMyCategories
);
router.get(
  "/get-categorie-names",
  auth,
  OrganizationCategoryController.getMyCategorieNames
);
router.put(
  "/update-categories",
  auth,
  OrganizationCategoryController.editCategories
);

router.post("/reports", auth, customerReportsController.reports);
// Organization
router.get(
  "/ticket-response/:responseId",
  auth,
  ticketsController.getTicketResponseById
);
router.post(
  "/save-header-footer-images",
  auth,
  upload.fields([
    { name: "headerImage", maxCount: 1 },
    { name: "footerImage", maxCount: 1 },
  ]),
  organizationController.SaveHeaderFooterImage
);
// add technician
router.post("/technician", auth, technicianController.create);
// getAll technicians
router.get("/technicians", auth, technicianController.getAll);
// getAll technicianName
router.get(
  "/technician-names",
  auth,
  technicianController.getAllTechnicianNames
);
// edit technician
router.put("/technician", auth, technicianController.edit);
// Add manager
router.post("/manager", auth, organizationController.addManager);
// get allManagers
router.get("/manager", auth, organizationController.allManagers);
router.get("/manager-name", auth, organizationController.allManagerNames);
// update Manager
router.put("/manager", auth, organizationController.editManager);
// create Plant
router.post("/plant", auth, upload.any(), plantController.create);
router.put("/plant/:id", auth, upload.any(), plantController.editPlant);
router.get(
  "/get-pump-iot-device-id-by-plant/:id",
  auth,
  plantController.getPumpIotDeviceIdByPlant
);

// getAll Plants
router.get("/plant", auth, plantController.getAll);
router.get("/plant-names", auth, plantController.getAllPlantNames);
router.put(
  "/edit-plant-image",
  auth,
  upload.fields([{ name: "plantImage", maxCount: 1 }]),
  plantController.editPlantImage
);
router.put(
  "/add-plant-layout",
  auth,
  // upload.fields([{ name: "plantLayoutImage", maxCount: 1 }]),
  plantController.addLayoutInplant
);
router.get(
  "/get-layouts-by-plant/:plantId",
  auth,
  plantController.getLayoutsByPlant
);
router.post("/layout-markers", auth, plantController.getLayoutMarkers);
router.post("/update-layout-marker", auth, plantController.updateLayoutMarker);
// router.post(
//   "/get-services-by-date",
//   auth,
//   serviceController.getServicesByDate
// );
module.exports = router;
