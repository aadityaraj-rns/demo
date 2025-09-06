const express = require("express");
const adminController = require("../controller/admin/adminController");
const auth = require("../middleware/auth");
const stateController = require("../controller/admin/masterData/stateController");
const cityController = require("../controller/admin/masterData/cityController");
const categoryController = require("../controller/admin/masterData/categoryController");
const selfAuditController = require("../controller/admin/masterData/selfAuditController");
const productController = require("../controller/admin/productController");
const upload = require("../middleware/multer.middleware");
const organizationController = require("../controller/organization/organizationController");
const industryController = require("../controller/admin/masterData/industryController");
const clientController = require("../controller/admin/client/clientController");
const partnerClientController = require("../controller/partner/clientController");
const formController = require("../controller/admin/serviceForm/formController");
const authController = require("../controller/partner/authController");
const pushNotification = require("../controller/firebasePushNotification/pushNotificationControlleer");
const notificationController = require("../controller/technician/notification/notificationController");
const router = express.Router();
const organisationRoutes = require("./organisation");
const technicianRoutes = require("./technician");
const fileUpload = require("../controller/fireUpload");
const iotController = require("../controller/iotController");

// test
router.get("/", (req, res) => [res.json({ msg: "Welcome to FireDesk." })]);

// admin
// for first time create admin
router.post("/adminCreate", adminController.adminCreate);
// login
router.post("/login", adminController.login);
// logout
router.post("/logout", auth, adminController.logout);
// dashboard
router.get("/dashboard", auth, adminController.dashboard);
// get admin profile
router.get("/get-admin-profile", auth, adminController.getAdminProfile);
// editAdmin
router.put(
  "/editAdmin",
  auth,
  upload.fields([{ name: "profile", maxCount: 1 }]),
  adminController.editAdmin
);
//refresh
router.get("/refresh", adminController.refresh);
// forget-password
// home

// state
// addState
router.post("/masterData/state", auth, stateController.create);
// getAllStateh
router.get("/masterData/state/all", auth, stateController.getAll);
// gettAllActiveState
router.get("/masterData/state/allActives", auth, stateController.getAllActive);
// update
router.put("/masterData/state", auth, stateController.update);

// industry
// addIndustry
router.post("/masterData/industry", auth, industryController.create);
// getAllIndustry
router.get("/masterData/industry/all", auth, industryController.getAll);
// getAllActiveIndustry
router.get(
  "/masterData/industry/allActives",
  auth,
  industryController.getAllActive
);
// update
router.put("/masterData/industry", auth, industryController.update);

// city
// addCity
router.post("/masterData/city", auth, cityController.create);
// edit
router.put("/masterData/city", auth, cityController.update);
// getAllCity
router.get("/masterData/city/all", auth, cityController.getAll);
// getCitiesByStateName
router.get("/masterData/citys/:stateName", auth, cityController.getByStateName);
//getActiveCities
router.get("/masterData/activeCities", auth, cityController.activeCities);
//
router.get(
  "/masterData/activeCitys/:stateName",
  auth,
  cityController.getActiveCitysByStateName
);
// getCitiesByStateId
router.get("/masterData/city/:stateId", auth, cityController.getByStateId);
//
router.get(
  "/masterData/activeCity/:stateId",
  auth,
  cityController.getActivecitysByStateId
);

// category
router.post("/masterData/category", auth, categoryController.create);
// getAllCategories
router.get("/masterData/category/all", auth, categoryController.getAll);
// allActiveCategories
router.get(
  "/masterData/category/allActives",
  auth,
  categoryController.getActiveCategories
);
// update
router.put("/masterData/category", auth, categoryController.update);

// Self Audit
// create
router.post("/masterData/selfAudit", auth, selfAuditController.create);
// get all questions
router.get("/masterData/selfAudit/all", auth, selfAuditController.getAll);
// edit by selfAudit_id
router.put("/masterData/selfAudit/:_id", auth, selfAuditController.update);

// client
// create
router.post("/client", auth, clientController.create);
// getAll Client
router.get("/client/getAll", auth, clientController.getAll);
// editClient
router.put("/client", auth, clientController.editClient);
// get-technician-by-orgId
router.get(
  "/client/technician/:orgUserId",
  auth,
  clientController.getTechnicians
);
// get-assets-by-orgId
router.get("/client/assets/:orgUserId", auth, clientController.getAssets);
// get-tickets-by-orgUserId
router.get("/client/tickets/:orgUserId", auth, clientController.getTickets);
// get-plants-by-orgUserId
router.get("/client/plants/:orgUserId", auth, clientController.getPlants);
// get-organization-profile
router.get("/client/org/profile/:orgUserId", auth, clientController.orgProfile);

// product
// create
router.post("/product", auth, productController.create);
// upload file
router.post(
  "/upload-file",
  auth,
  upload.fields([{ name: "file", maxCount: 1 }]),
  fileUpload.upload
);
// update
router.put("/product", auth, productController.update);

// getAll
router.get("/products", auth, productController.getAll);
router.get("/products/:categoryId", auth, productController.getByCategory);

// edit
router.put(
  "/edit-org-profile",
  auth,
  upload.fields([{ name: "profile", maxCount: 1 }]),
  organizationController.editOrgProfile
);

// form
router.post("/form", auth, formController.createForm);
router.get("/forms", auth, formController.getAll);
router.get("/getAllServiceNames", auth, formController.getAllServiceNames);
router.get("/form/:_id", auth, formController.getById);
router.post(
  "/form/add-questions-to-section",
  auth,
  formController.addQuestionsToSection
);
router.delete(
  "/form/remove-questions",
  auth,
  formController.removeQuestionsFromSection
);

// Partner login routes
router.post("/partner-login", authController.authenticate);
router.post("/partner/client", auth, partnerClientController.create);
router.put("/partner/client", auth, partnerClientController.editClient);
router.get("/partner/clients", auth, partnerClientController.getAll);
router.get(
  "/partner/getActiveCategoriesForPartner",
  auth,
  partnerClientController.getActiveCategoriesForPartner
);
router.get("/partner/profile", auth, partnerClientController.getPartnerProfile);
// edit
router.put(
  "/partner/edit-profile",
  auth,
  upload.fields([{ name: "profile", maxCount: 1 }]),
  partnerClientController.editPartnerProfile
);
router.get(
  "/partner/dashboard-data",
  auth,
  partnerClientController.dashboardData
);

// Partner profile

//technician push notification
router.get("/push-notification", pushNotification.sendNotification);

//notification
router.get(
  "/my-notifications",
  auth,
  notificationController.getMyNotifications
);
router.delete(
  "/clear-my-notifications",
  auth,
  notificationController.clearMyNotifications
);
router.put(
  "/notification-mark-as-read",
  auth,
  notificationController.updateReadNotification
);
router.post("/send-iot-data", iotController.create);
router.use("/organization", organisationRoutes);
router.use("/technician", technicianRoutes);

module.exports = router;
