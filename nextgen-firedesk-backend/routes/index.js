// firedesk-backend/routes/index.js
const express = require("express");
const router = express.Router();

// Middlewares
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const activityLogger = require("../middleware/activityLogger");

// Admin Controllers
const adminController = require("../controller/admin/adminController");
const clientController = require("../controller/admin/client/clientController");

// Master Data Controllers
const stateController = require("../controller/admin/masterData/stateController");
const cityController = require("../controller/admin/masterData/cityController");
const industryController = require("../controller/admin/masterData/industryController");

// ----------------- FIXED: import the self-audit controller (not models) -----------------
const selfAuditController = require("../controller/admin/masterData/selfAuditController");
// -------------------------------------------------------------------------------------


// Add this import line
const formController = require("../controller/admin/serviceForm/formController");
const categoryController = require("../controller/admin/masterData/categoryController");

// Add these imports after other controller imports
const plantController = require("../controller/admin/plantController");
const managerController = require("../controller/admin/managerController");

const roleController = require("../controller/admin/roleController");
const userController = require("../controller/admin/userController");

const technicianController = require("../controller/admin/technicianController");

// Product Controller
const productController = require("../controller/admin/productController");

// Activity Controller
const activityController = require("../controller/admin/activityController");

// System Status Controller
const systemStatusController = require("../controller/admin/systemStatusController");

// Search Controller
const searchController = require("../controller/admin/searchController");

// Asset Controller
const assetController = require("../controller/admin/assetController");

// =================== TEST ===================
router.get("/", (req, res) => res.json({ msg: "Welcome to FireDesk." }));

// =================== ADMIN ===================
router.post("/adminCreate", adminController.adminCreate);
router.post("/login", adminController.login);
router.post("/logout", auth, adminController.logout);
router.get("/dashboard", auth, adminController.dashboard);
router.get("/get-admin-profile", auth, adminController.getAdminProfile);
router.put("/editAdmin", auth, adminController.editAdmin);
router.get("/refresh", adminController.refresh);

// =================== CLIENT ===================
router.post("/client", auth, activityLogger.logCreate('Client'), clientController.create);
router.get("/client/getAll", auth, clientController.getAll);
router.put("/client", auth, activityLogger.logUpdate('Client'), clientController.editClient);
router.get("/client/org/profile/:orgUserId", auth, clientController.orgProfile);
// =================== STATE ===================
router.post("/state", auth, adminAuth, activityLogger.logCreate('State'), stateController.create);
router.get("/state", auth, stateController.getAll);
router.get("/state/active", auth, stateController.getAllActive);
router.put("/state", auth, adminAuth, activityLogger.logUpdate('State'), stateController.update);
router.delete("/state/:id", auth, adminAuth, activityLogger.logDelete('State'), stateController.delete);

// =================== CITY ===================
router.post("/city", auth, adminAuth, activityLogger.logCreate('City'), cityController.create);
router.get("/city", auth, cityController.getAll);
router.put("/city", auth, adminAuth, activityLogger.logUpdate('City'), cityController.update);
router.delete("/city/:id", auth, adminAuth, activityLogger.logDelete('City'), cityController.delete);
router.get("/city/stateName/:stateName", auth, cityController.getByStateName);
router.get("/city/active", auth, cityController.activeCities);
router.get("/city/active/stateName/:stateName", auth, cityController.getActiveCitiesByStateName);
router.get("/city/stateId/:stateId", auth, cityController.getByStateId);
router.get("/city/active/stateId/:stateId", auth, cityController.getActiveCitiesByStateId);

// =================== INDUSTRY ===================
router.post("/industry", auth, adminAuth, activityLogger.logCreate('Industry'), industryController.create);
router.get("/industry", auth, industryController.getAll);
router.get("/industry/active", auth, industryController.getAllActive);
router.put("/industry", auth, adminAuth, activityLogger.logUpdate('Industry'), industryController.update);
// FIX: Change from body to URL parameter for DELETE
router.delete("/industry/:id", auth, adminAuth, activityLogger.logDelete('Industry'), industryController.delete);


// =================== SELF AUDIT (CRUD) ===================
// create a full self-audit with categories and questions (admin only)
router.post("/masterData/selfAudit", auth, adminAuth, selfAuditController.create);

// get all audits (or single if you keep only one)
router.get("/masterData/selfAudit/all", auth, selfAuditController.getAll);

// get by id
router.get("/masterData/selfAudit/:id", auth, selfAuditController.getById);

// update an audit (replace categories/questions)
router.put("/masterData/selfAudit/:id", auth, adminAuth, selfAuditController.update);

// delete audit
router.delete("/masterData/selfAudit/:id", auth, adminAuth, selfAuditController.delete);

// -------------------------------------------------------------------



// =================== FORM ===================
router.post("/form", auth, adminAuth, activityLogger.logCreate('ServiceForm'), formController.createForm);
router.get("/form", auth, formController.getAll);
router.get("/form/active", auth, formController.getAllActive);
router.get("/form/service-names", auth, formController.getAllServiceNames);
router.get("/form/:id", auth, formController.getById);
router.put("/form", auth, adminAuth, activityLogger.logUpdate('ServiceForm'), formController.update);
router.delete("/form/:id", auth, adminAuth, activityLogger.logDelete('ServiceForm'), formController.delete);

// =================== CATEGORY ===================
router.post("/category", auth, adminAuth, activityLogger.logCreate('Category'), categoryController.create);
router.get("/category", auth, categoryController.getAll);
router.get("/category/active", auth, categoryController.getActiveCategories);
router.put("/category", auth, adminAuth, activityLogger.logUpdate('Category'), categoryController.update);
router.delete("/category/:id", auth, adminAuth, activityLogger.logDelete('Category'), categoryController.delete);

// =================== PRODUCT ===================
router.post("/product", auth, adminAuth, activityLogger.logCreate('Product'), productController.create);
router.get("/product", auth, productController.getAll);
router.get("/product/:categoryId", auth, productController.getByCategory);
router.put("/product", auth, adminAuth, activityLogger.logUpdate('Product'), productController.update);
router.delete("/product/:id", auth, adminAuth, activityLogger.logDelete('Product'), productController.delete);


// =================== PLANT (ADMIN) ===================
router.post("/plant", auth, plantController.create);
router.get("/plant/:id", auth, plantController.getById);
router.get("/plant", auth, plantController.getAll);
router.get("/plant/active", auth, plantController.getAllActive);
router.put("/plant/:id", auth, adminAuth, plantController.update);
router.delete("/plant/:id", auth, adminAuth, plantController.delete);
// In your routes/index.js, replace the /plants route with this:

// =================== PLANTS (GET ALL FOR MANAGER ASSIGNMENT) ===================
router.get("/plants", auth, async (req, res, next) => {
  try {
    const { Plant, Industry, City, State } = require("../models/index");
    
    let whereCondition = { status: 'Active' };
    
    // If manager, filter by their org and assigned plants
    if (req.user.userType === "manager") {
      const { Manager } = require("../models/index");
      const manager = await Manager.findOne({ 
        where: { userId: req.user.id }
      });
      
      if (manager) {
        whereCondition.orgUserId = manager.orgUserId;
        whereCondition.managerId = manager.id;
      }
    }
    // Admin users see all active plants - no orgUserId filter
    
    const plants = await Plant.findAll({
      where: whereCondition,
      include: [
        {
          model: Industry,
          as: 'industry',
          attributes: ['id', 'industryName']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'cityName']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'stateName']
        }
      ],
      order: [['plantName', 'ASC']]
    });
    
    return res.json({ plants });
  } catch (error) {
    console.error('Plants fetch error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to fetch plants',
      error: error.message 
    });
  }
});

// =================== MANAGER (ADMIN) ===================
router.post("/manager", auth, adminAuth, managerController.create);
router.get("/manager", auth, managerController.getAll);
router.get("/manager/active", auth, managerController.getAllActive);
router.put("/manager", auth, adminAuth, managerController.update);
router.delete("/manager/:id", auth, adminAuth, managerController.delete);



// =================== ROLES & PERMISSIONS ===================
router.post("/role", auth, adminAuth, activityLogger.logCreate('Role'), roleController.create);
router.get("/role", auth, roleController.getAll);
router.put("/role", auth, adminAuth, activityLogger.logUpdate('Role'), roleController.update);
router.delete("/role/:id", auth, adminAuth, activityLogger.logDelete('Role'), roleController.delete);

// =================== USER MANAGEMENT ===================
router.get("/admin/users", auth, adminAuth, userController.getAll);
router.post("/admin/users", auth, adminAuth, activityLogger.logCreate('User'), userController.create);
router.put("/admin/users/role", auth, adminAuth, activityLogger.logUpdate('User'), userController.updateRole);

router.post("/technician", auth, adminAuth, activityLogger.logCreate('Technician'), technicianController.create);
router.get("/technician", auth, adminAuth, technicianController.getAll);
router.put("/technician/:id", auth, adminAuth, activityLogger.logUpdate('Technician'), technicianController.update);
router.delete("/technician/:id", auth, adminAuth, activityLogger.logDelete('Technician'), technicianController.delete);

// =================== ASSETS ===================
router.post("/asset", auth, adminAuth, activityLogger.logCreate('Asset'), assetController.create);
router.get("/asset", auth, adminAuth, assetController.getAll);
router.get("/asset/:id", auth, adminAuth, assetController.getById);
router.put("/asset/:id", auth, adminAuth, activityLogger.logUpdate('Asset'), assetController.update);
router.delete("/asset/:id", auth, adminAuth, activityLogger.logDelete('Asset'), assetController.delete);
router.post("/asset/bulk-upload", auth, adminAuth, assetController.bulkUpload);

// =================== ACTIVITY LOGS ===================
router.get("/activity/recent", auth, activityController.getRecent);
router.get("/activity/stats", auth, activityController.getStats);
router.get("/activity", auth, activityController.getAll);

// =================== SYSTEM STATUS ===================
router.get("/system/status", auth, systemStatusController.getStatus);

// =================== GLOBAL SEARCH ===================
router.get("/search", auth, searchController.globalSearch);

module.exports = router;



// const express = require("express");
// const adminController = require("../controller/admin/adminController");
// const auth = require("../middleware/auth");
// const stateController = require("../controller/admin/masterData/stateController");
// const cityController = require("../controller/admin/masterData/cityController");
// const categoryController = require("../controller/admin/masterData/categoryController");
// const selfAuditController = require("../controller/admin/masterData/selfAuditController");
// const productController = require("../controller/admin/productController");
// const upload = require("../middleware/multer.middleware");
// const organizationController = require("../controller/organization/organizationController");
// const industryController = require("../controller/admin/masterData/industryController");
// const clientController = require("../controller/admin/client/clientController");
// const partnerClientController = require("../controller/partner/clientController");
// const formController = require("../controller/admin/serviceForm/formController");
// const authController = require("../controller/partner/authController");
// const pushNotification = require("../controller/firebasePushNotification/pushNotificationControlleer");
// const notificationController = require("../controller/technician/notification/notificationController");
// const router = express.Router();
// const organisationRoutes = require("./organisation");
// const technicianRoutes = require("./technician");
// const fileUpload = require("../controller/fireUpload");
// const iotController = require("../controller/iotController");

// // test
// // Corrected test route
// router.get("/", (req, res) => res.json({ msg: "Welcome to FireDesk." }));

// // admin
// // for first time create admin
// router.post("/adminCreate", adminController.adminCreate);
// // login
// router.post("/login", adminController.login);
// // logout
// router.post("/logout", auth, adminController.logout);
// // dashboard
// router.get("/dashboard", auth, adminController.dashboard);
// // get admin profile
// router.get("/get-admin-profile", auth, adminController.getAdminProfile);
// // editAdmin
// router.put(
//   "/editAdmin",
//   auth,
//   upload.fields([{ name: "profile", maxCount: 1 }]),
//   adminController.editAdmin
// );
// //refresh
// router.get("/refresh", adminController.refresh);
// // forget-password
// // home

// // state
// // addState
// router.post("/masterData/state", auth, stateController.create);
// // getAllStateh
// router.get("/masterData/state/all", auth, stateController.getAll);
// // gettAllActiveState
// router.get("/masterData/state/allActives", auth, stateController.getAllActive);
// // update
// router.put("/masterData/state", auth, stateController.update);

// // industry
// // addIndustry
// router.post("/masterData/industry", auth, industryController.create);
// // getAllIndustry
// router.get("/masterData/industry/all", auth, industryController.getAll);
// // getAllActiveIndustry
// router.get(
//   "/masterData/industry/allActives",
//   auth,
//   industryController.getAllActive
// );
// // update
// router.put("/masterData/industry", auth, industryController.update);

// // city
// // addCity
// router.post("/masterData/city", auth, cityController.create);
// // edit
// router.put("/masterData/city", auth, cityController.update);
// // getAllCity
// router.get("/masterData/city/all", auth, cityController.getAll);
// // getCitiesByStateName
// router.get("/masterData/citys/:stateName", auth, cityController.getByStateName);
// //getActiveCities
// router.get("/masterData/activeCities", auth, cityController.activeCities);
// //
// router.get(
//   "/masterData/activeCitys/:stateName",
//   auth,
//   cityController.getActiveCitysByStateName
// );
// // getCitiesByStateId
// router.get("/masterData/city/:stateId", auth, cityController.getByStateId);
// //
// router.get(
//   "/masterData/activeCity/:stateId",
//   auth,
//   cityController.getActivecitysByStateId
// );

// // category
// router.post("/masterData/category", auth, categoryController.create);
// // getAllCategories
// router.get("/masterData/category/all", auth, categoryController.getAll);
// // allActiveCategories
// router.get(
//   "/masterData/category/allActives",
//   auth,
//   categoryController.getActiveCategories
// );
// // update
// router.put("/masterData/category", auth, categoryController.update);

// // Self Audit
// // create
// router.post("/masterData/selfAudit", auth, selfAuditController.create);
// // get all questions
// router.get("/masterData/selfAudit/all", auth, selfAuditController.getAll);
// // edit by selfAudit_id
// router.put("/masterData/selfAudit/:_id", auth, selfAuditController.update);

// // client
// // create
// router.post("/client", auth, clientController.create);
// // getAll Client
// router.get("/client/getAll", auth, clientController.getAll);
// // editClient
// router.put("/client", auth, clientController.editClient);
// // get-technician-by-orgId
// router.get(
//   "/client/technician/:orgUserId",
//   auth,
//   clientController.getTechnicians
// );
// // get-assets-by-orgId
// router.get("/client/assets/:orgUserId", auth, clientController.getAssets);
// // get-tickets-by-orgUserId
// router.get("/client/tickets/:orgUserId", auth, clientController.getTickets);
// // get-plants-by-orgUserId
// router.get("/client/plants/:orgUserId", auth, clientController.getPlants);
// // get-organization-profile
// router.get("/client/org/profile/:orgUserId", auth, clientController.orgProfile);

// // product
// // create
// router.post("/product", auth, productController.create);
// // upload file
// router.post(
//   "/upload-file",
//   auth,
//   upload.fields([{ name: "file", maxCount: 1 }]),
//   fileUpload.upload
// );
// // update
// router.put("/product", auth, productController.update);

// // getAll
// router.get("/products", auth, productController.getAll);
// router.get("/products/:categoryId", auth, productController.getByCategory);

// // edit
// router.put(
//   "/edit-org-profile",
//   auth,
//   upload.fields([{ name: "profile", maxCount: 1 }]),
//   organizationController.editOrgProfile
// );

// // form
// router.post("/form", auth, formController.createForm);
// router.get("/forms", auth, formController.getAll);
// router.get("/getAllServiceNames", auth, formController.getAllServiceNames);
// router.get("/form/:_id", auth, formController.getById);
// router.post(
//   "/form/add-questions-to-section",
//   auth,
//   formController.addQuestionsToSection
// );
// router.delete(
//   "/form/remove-questions",
//   auth,
//   formController.removeQuestionsFromSection
// );

// // Partner login routes
// router.post("/partner-login", authController.authenticate);
// router.post("/partner/client", auth, partnerClientController.create);
// router.put("/partner/client", auth, partnerClientController.editClient);
// router.get("/partner/clients", auth, partnerClientController.getAll);
// router.get(
//   "/partner/getActiveCategoriesForPartner",
//   auth,
//   partnerClientController.getActiveCategoriesForPartner
// );
// router.get("/partner/profile", auth, partnerClientController.getPartnerProfile);
// // edit
// router.put(
//   "/partner/edit-profile",
//   auth,
//   upload.fields([{ name: "profile", maxCount: 1 }]),
//   partnerClientController.editPartnerProfile
// );
// router.get(
//   "/partner/dashboard-data",
//   auth,
//   partnerClientController.dashboardData
// );

// // Partner profile

// //technician push notification
// router.get("/push-notification", pushNotification.sendNotification);

// //notification
// router.get(
//   "/my-notifications",
//   auth,
//   notificationController.getMyNotifications
// );
// router.delete(
//   "/clear-my-notifications",
//   auth,
//   notificationController.clearMyNotifications
// );
// router.put(
//   "/notification-mark-as-read",
//   auth,
//   notificationController.updateReadNotification
// );
// router.post("/send-iot-data", iotController.create);
// router.use("/organization", organisationRoutes);
// router.use("/technician", technicianRoutes);

// module.exports = router;