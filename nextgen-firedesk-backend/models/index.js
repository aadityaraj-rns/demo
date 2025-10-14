// firedesk-backend/models/index.js
const { sequelize } = require("../database/index");

// Import all models
const User = require("./user");
const RefreshToken = require("./token");
const State = require("./admin/masterData/state");
const City = require("./admin/masterData/city");
const Category = require("./admin/masterData/category");
const Industry = require("./admin/masterData/Industry");
const Product = require("./admin/product");
const Form = require("./admin/serviceForms/Form");
const Client = require("./admin/client/Client");
const Manager = require("./organization/manager/Manager");
const Plant = require("./organization/plant/Plant");
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
  Product,
  Form,
  Client,
  Manager,
  Plant,
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

  // Manager <-> Plant
  Manager.hasMany(Plant, { foreignKey: "managerId", as: "plants", onDelete: "SET NULL" });
  Plant.belongsTo(Manager, { foreignKey: "managerId", as: "manager", onDelete: "SET NULL" });

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
