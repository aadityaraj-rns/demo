// firedesk-backend/models/index.js
const { sequelize } = require("../database/index");

// Import all models
const User = require("./user");
const RefreshToken = require("./token");
const State = require("./admin/masterData/state");
const City = require("./admin/masterData/city");
const Category = require("./admin/masterData/category");
const Industry = require("./admin/masterData/Industry");
const Vendor = require("./admin/masterData/Vendor");
const EdgeDevice = require("./admin/masterData/EdgeDevice");
const Product = require("./admin/product");
const Form = require("./admin/serviceForms/Form");
const Client = require("./admin/client/Client");
const Manager = require("./organization/manager/Manager");
const Plant = require("./organization/plant/Plant");
const Building = require("./organization/plant/Building");
const Floor = require("./organization/plant/Floor");
const Wing = require("./organization/plant/Wing");
const PlantManager = require("./organization/plant/PlantManager");
const Entrance = require("./organization/plant/Entrance");
const DieselGenerator = require("./organization/plant/DieselGenerator");
const Staircase = require("./organization/plant/Staircase");
const Lift = require("./organization/plant/Lift");
const FireSafetyForm = require("./organization/plant/FireSafetyForm");
const ComplianceFireSafety = require("./organization/plant/ComplianceFireSafety");
const MonitoringForm = require("./organization/plant/MonitoringForm");
const MonitoringDevice = require("./organization/plant/MonitoringDevice");
const Layout = require("./organization/plant/Layout");
const Asset = require("./organization/asset/Asset");
const GroupService = require("./organization/groupService/GroupService");
const Ticket = require("./organization/ticket/Ticket");
const Technician = require("./organization/technician/Technician");
const Role = require("./Role");
const SelfAudit = require("./admin/masterData/selfAudit");
const SelfAuditCategory = require("./admin/masterData/selfAuditCategory");
const SelfAuditQuestion = require("./admin/masterData/selfAuditQuestion");
const Activity = require("./Activity");

const models = {
  sequelize,
  User,
  RefreshToken,
  State,
  City,
  Category,
  Industry,
  Vendor,
  EdgeDevice,
  Product,
  Form,
  Client,
  Manager,
  Plant,
  Building,
  Floor,
  Wing,
  PlantManager,
  Entrance,
  DieselGenerator,
  Staircase,
  Lift,
  FireSafetyForm,
  ComplianceFireSafety,
  MonitoringForm,
  MonitoringDevice,
  Layout,
  Asset,
  GroupService,
  Ticket,
  Technician,
  Role,
  SelfAudit,
  SelfAuditCategory,
  SelfAuditQuestion,
  Activity,
};

let associationsDefined = false;
const defineAssociations = () => {
  if (associationsDefined) return;
  associationsDefined = true;

  // User <-> Token
  User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
  RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

  // State <-> City
  State.hasMany(City, { foreignKey: "stateId", as: "cities", onDelete: "CASCADE" });
  City.belongsTo(State, { foreignKey: "stateId", as: "state" });

  // State <-> Plant
  State.hasMany(Plant, { foreignKey: "stateId", as: "plants", onDelete: "SET NULL" });
  Plant.belongsTo(State, { foreignKey: "stateId", as: "state" });

  // Form <-> Category
  Form.hasMany(Category, { foreignKey: "formId", as: "categories", onDelete: "CASCADE" });
  Category.belongsTo(Form, { foreignKey: "formId", as: "form" });

  // Category <-> Product
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // Form <-> GroupService
  Form.hasMany(GroupService, { foreignKey: "formId", as: "groupServices" });
  GroupService.belongsTo(Form, { foreignKey: "formId", as: "form" });

  // Industry <-> Client
  Industry.hasMany(Client, { foreignKey: "industryId", as: "clients" });
  Client.belongsTo(Industry, { foreignKey: "industryId", as: "industry" });

  // Industry <-> Plant
  Industry.hasMany(Plant, { foreignKey: "industryId", as: "plants", onDelete: "SET NULL" });
  Plant.belongsTo(Industry, { foreignKey: "industryId", as: "industry" });

  // User <-> Client
  User.hasMany(Client, { foreignKey: "userId", as: "clientProfile" });
  User.hasMany(Client, { foreignKey: "createdByPartnerUserId", as: "createdClients" });
  Client.belongsTo(User, { foreignKey: "userId", as: "user" });
  Client.belongsTo(User, { foreignKey: "createdByPartnerUserId", as: "createdByPartner" });

  // City <-> Client
  City.hasMany(Client, { foreignKey: "cityId", as: "clients" });
  Client.belongsTo(City, { foreignKey: "cityId", as: "city" });

  // User <-> Manager
  User.hasMany(Manager, { foreignKey: "userId", as: "managerProfile" });
  User.hasMany(Manager, { foreignKey: "orgUserId", as: "managedBy" });
  Manager.belongsTo(User, { foreignKey: "userId", as: "user" });
  Manager.belongsTo(User, { foreignKey: "orgUserId", as: "organization" });

  // User <-> Plant
  User.hasMany(Plant, { foreignKey: "orgUserId", as: "plants" });
  Plant.belongsTo(User, { foreignKey: "orgUserId", as: "organization" });

  // City <-> Plant
  City.hasMany(Plant, { foreignKey: "cityId", as: "plants", onDelete: "SET NULL" });
  Plant.belongsTo(City, { foreignKey: "cityId", as: "city" });

  // Many-to-Many: Plant <-> Manager (through PlantManager junction table)
  Plant.belongsToMany(Manager, { 
    through: PlantManager, 
    foreignKey: "plantId", 
    otherKey: "managerId",
    as: "managers" 
  });
  Manager.belongsToMany(Plant, { 
    through: PlantManager, 
    foreignKey: "managerId", 
    otherKey: "plantId",
    as: "plants" 
  });

  // Plant -> Building (One-to-Many)
  Plant.hasMany(Building, { foreignKey: "plantId", as: "buildings", onDelete: "CASCADE" });
  Building.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // Building -> Floor (One-to-Many)
  Building.hasMany(Floor, { foreignKey: "buildingId", as: "floors", onDelete: "CASCADE" });
  Floor.belongsTo(Building, { foreignKey: "buildingId", as: "building" });

  // Floor -> Wing (One-to-Many)
  Floor.hasMany(Wing, { foreignKey: "floorId", as: "wings", onDelete: "CASCADE" });
  Wing.belongsTo(Floor, { foreignKey: "floorId", as: "floor" });

  // Plant -> Entrance (One-to-Many)
  Plant.hasMany(Entrance, { foreignKey: "plantId", as: "entrances", onDelete: "CASCADE" });
  Entrance.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // Plant -> DieselGenerator (One-to-Many)
  Plant.hasMany(DieselGenerator, { foreignKey: "plantId", as: "dieselGenerators", onDelete: "CASCADE" });
  DieselGenerator.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // Building -> Staircase (One-to-Many)
  Building.hasMany(Staircase, { foreignKey: "buildingId", as: "staircases", onDelete: "CASCADE" });
  Staircase.belongsTo(Building, { foreignKey: "buildingId", as: "building" });

  // Building -> Lift (One-to-Many)
  Building.hasMany(Lift, { foreignKey: "buildingId", as: "lifts", onDelete: "CASCADE" });
  Lift.belongsTo(Building, { foreignKey: "buildingId", as: "building" });

  // Plant -> FireSafetyForm (One-to-Many)
  Plant.hasMany(FireSafetyForm, { foreignKey: "plantId", as: "fireSafetyForms", onDelete: "CASCADE" });
  FireSafetyForm.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // Vendor -> FireSafetyForm (One-to-Many)
  Vendor.hasMany(FireSafetyForm, { foreignKey: "amcVendorId", as: "fireSafetyForms", onDelete: "SET NULL" });
  FireSafetyForm.belongsTo(Vendor, { foreignKey: "amcVendorId", as: "amcVendor" });

  // Plant -> ComplianceFireSafety (One-to-Many)
  Plant.hasMany(ComplianceFireSafety, { foreignKey: "plantId", as: "complianceForms", onDelete: "CASCADE" });
  ComplianceFireSafety.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // Plant -> MonitoringForm (One-to-Many)
  Plant.hasMany(MonitoringForm, { foreignKey: "plantId", as: "monitoringForms", onDelete: "CASCADE" });
  MonitoringForm.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // Building -> MonitoringForm (One-to-Many)
  Building.hasMany(MonitoringForm, { foreignKey: "buildingId", as: "monitoringForms", onDelete: "SET NULL" });
  MonitoringForm.belongsTo(Building, { foreignKey: "buildingId", as: "building" });

  // Floor -> MonitoringForm (One-to-Many)
  Floor.hasMany(MonitoringForm, { foreignKey: "floorId", as: "monitoringForms", onDelete: "SET NULL" });
  MonitoringForm.belongsTo(Floor, { foreignKey: "floorId", as: "floor" });

  // MonitoringForm -> MonitoringDevice (One-to-Many)
  MonitoringForm.hasMany(MonitoringDevice, { foreignKey: "monitoringFormId", as: "devices", onDelete: "CASCADE" });
  MonitoringDevice.belongsTo(MonitoringForm, { foreignKey: "monitoringFormId", as: "monitoringForm" });

  // EdgeDevice -> MonitoringDevice (One-to-Many)
  EdgeDevice.hasMany(MonitoringDevice, { foreignKey: "edgeDeviceId", as: "monitoringDevices", onDelete: "CASCADE" });
  MonitoringDevice.belongsTo(EdgeDevice, { foreignKey: "edgeDeviceId", as: "edgeDevice" });

  // Plant -> Layout (One-to-Many)
  Plant.hasMany(Layout, { foreignKey: "plantId", as: "layouts", onDelete: "CASCADE" });
  Layout.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // Building -> Layout (One-to-Many)
  Building.hasMany(Layout, { foreignKey: "buildingId", as: "layouts", onDelete: "SET NULL" });
  Layout.belongsTo(Building, { foreignKey: "buildingId", as: "building" });

  // Floor -> Layout (One-to-Many)
  Floor.hasMany(Layout, { foreignKey: "floorId", as: "layouts", onDelete: "SET NULL" });
  Layout.belongsTo(Floor, { foreignKey: "floorId", as: "floor" });

  // Wing -> Layout (One-to-Many)
  Wing.hasMany(Layout, { foreignKey: "wingId", as: "layouts", onDelete: "SET NULL" });
  Layout.belongsTo(Wing, { foreignKey: "wingId", as: "wing" });

  // Plant <-> Asset
  Plant.hasMany(Asset, { foreignKey: "plantId", as: "assets" });
  Asset.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // Category <-> Asset
  Category.hasMany(Asset, { foreignKey: "productCategoryId", as: "assets" });
  Asset.belongsTo(Category, { foreignKey: "productCategoryId", as: "category" });

  // Product <-> Asset
  Product.hasMany(Asset, { foreignKey: "productId", as: "assets" });
  Asset.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // User <-> Asset
  User.hasMany(Asset, { foreignKey: "orgUserId", as: "assets" });
  Asset.belongsTo(User, { foreignKey: "orgUserId", as: "organization" });

  // GroupService <-> Asset
  GroupService.hasMany(Asset, { foreignKey: "groupId", as: "assets" });
  Asset.belongsTo(GroupService, { foreignKey: "groupId", as: "groupService" });

  // User <-> GroupService
  User.hasMany(GroupService, { foreignKey: "orgUserId", as: "groupServices" });
  GroupService.belongsTo(User, { foreignKey: "orgUserId", as: "organization" });

  // Plant <-> GroupService
  Plant.hasMany(GroupService, { foreignKey: "plantId", as: "groupServices" });
  GroupService.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // User <-> Ticket
  User.hasMany(Ticket, { foreignKey: "orgUserId", as: "tickets" });
  Ticket.belongsTo(User, { foreignKey: "orgUserId", as: "organization" });

  // Plant <-> Ticket
  Plant.hasMany(Ticket, { foreignKey: "plantId", as: "tickets" });
  Ticket.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

  // User <-> Role
  User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
  Role.hasMany(User, { foreignKey: "roleId", as: "users" });

  // SelfAudit <-> SelfAuditCategory <-> SelfAuditQuestion
  SelfAudit.hasMany(SelfAuditCategory, { foreignKey: "selfAuditId", as: "categories" });
  SelfAuditCategory.belongsTo(SelfAudit, { foreignKey: "selfAuditId", as: "selfAudit" });
  SelfAuditCategory.hasMany(SelfAuditQuestion, { foreignKey: "selfAuditCategoryId", as: "questions" });
  SelfAuditQuestion.belongsTo(SelfAuditCategory, { foreignKey: "selfAuditCategoryId", as: "category" });

  // ================= TECHNICIAN RELATIONS =================
  const { Technician } = models;

  User.hasMany(Technician, { foreignKey: "orgUserId", as: "technicians", onDelete: "CASCADE" });
  Technician.belongsTo(User, { foreignKey: "orgUserId", as: "organization" });

  User.hasOne(Technician, { foreignKey: "userId", as: "technicianProfile", onDelete: "CASCADE" });
  Technician.belongsTo(User, { foreignKey: "userId", as: "user" });

  // 🔸 Optional Manager / Plant / Category links
  Manager.hasMany(Technician, { foreignKey: "managerId", as: "technicians", onDelete: "SET NULL" }); // 🔸
  Technician.belongsTo(Manager, { foreignKey: "managerId", as: "manager", onDelete: "SET NULL" }); // 🔸

  Plant.hasMany(Technician, { foreignKey: "plantId", as: "technicians", onDelete: "SET NULL" }); // 🔸
  Technician.belongsTo(Plant, { foreignKey: "plantId", as: "plant", onDelete: "SET NULL" }); // 🔸

  Category.hasMany(Technician, { foreignKey: "categoryId", as: "technicians", onDelete: "SET NULL" }); // 🔸
  Technician.belongsTo(Category, { foreignKey: "categoryId", as: "category", onDelete: "SET NULL" }); // 🔸

  // ================= ACTIVITY RELATIONS =================
  User.hasMany(Activity, { foreignKey: "userId", as: "activities" });
  Activity.belongsTo(User, { foreignKey: "userId", as: "user" });
};

defineAssociations();
module.exports = models;
