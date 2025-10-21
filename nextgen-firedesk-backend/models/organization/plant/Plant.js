// firedesk-backend/models/organization/plant/Plant.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Plant = sequelize.define("Plant", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  plantName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true, // Made optional to reduce required fields
  },
  address2: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  stateId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "states",
      key: "id",
    },
  },
  cityId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "cities",
      key: "id",
    },
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gstNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  industryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "industries",
      key: "id",
    },
  },
  mainBuildings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  subBuildings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalPlantArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Total plant area in square meters',
  },
  totalBuildUpArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Total built-up area in square meters',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Draft", // Changed default to Draft
  },
  
  // Premises Details
  dgAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dgQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  staircaseAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  staircaseQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  staircaseType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  staircaseWidth: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  staircaseFireRating: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  staircasePressurization: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  staircaseEmergencyLighting: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  staircaseLocation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  liftAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  liftQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  
  // Fire Safety Details
  headerPressure: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pressureUnit: {
    type: DataTypes.ENUM("Kg/Cm2", "PSI", "MWC", "Bar"),
    allowNull: true,
  },
  mainWaterStorage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  primeWaterTankStorage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dieselStorage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  primeOverTankCapacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  primeOverTankCapacity2: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  terraceTankCapacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  headerPressureBar: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  systemCommissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  amcVendor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amcStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  amcEndDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  numFireExtinguishers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  numHydrantPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  numSprinklers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  numSafeAssemblyAreas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dieselEngine: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  electricalPump: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jockeyPump: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Compliance Details
  fireNocNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nocValidityDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  insurancePolicyNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  insurerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  complianceNumExtinguishers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  complianceNumHydrants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  complianceNumSprinklers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  complianceNumSafeAreas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  
  // Monitoring Details
  edgeDeviceId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  monitoringBuilding: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  specificLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  installationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  
  // Layout Details
  layoutName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Scheduler Details
  schedulerCategory: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "categories",
      key: "id",
    },
  },
  schedulerStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  schedulerEndDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  inspectionFrequency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  testingFrequency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maintenanceFrequency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Legacy fields for backward compatibility - mark as deprecated
  orgUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'DEPRECATED: Use plant_managers junction table instead',
  },
  plantImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pumpIotDeviceId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "plants",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Plant;