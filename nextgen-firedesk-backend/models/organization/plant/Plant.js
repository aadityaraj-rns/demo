// firedesk-backend/models/organization/plant/Plant.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Plant = sequelize.define("Plant", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  plantId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  orgUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  pumpIotDeviceId: {
    type: DataTypes.STRING,
    allowNull: true,
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
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  address2: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cityId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "cities",
      key: "id",
    },
  },
  stateId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "states",
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
  managerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "managers",
      key: "id",
    },
  },
  plantImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Premises Details
  mainBuildings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  subBuildings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  buildings: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of building objects with name, floors, floorName, usage, area, height'
  },
  totalPlantArea: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'In Square Meters'
  },
  totalBuildUpArea: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'In Square Meters'
  },
  entrances: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of entrance objects with name and width'
  },
  
  // Diesel Generator
  dgAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dgQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  
  // Staircase Details
  staircaseAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  staircaseQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  staircaseType: {
    type: DataTypes.ENUM('enclosed', 'open', 'spiral'),
    allowNull: true,
  },
  staircaseWidth: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'In Meters'
  },
  staircaseFireRating: {
    type: DataTypes.INTEGER,
    comment: 'In Minutes (60, 90, 120)'
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
  
  // Lift Details
  liftAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  liftQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  
  // Fire Safety - Tank Capacities (keeping existing + adding new)
  headerPressure: {
    type: DataTypes.STRING,
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
  pressureUnit: {
    type: DataTypes.ENUM("Kg/Cm2", "PSI", "MWC", "Bar"),
    allowNull: true,
  },
  primeOverTankCapacity: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'In Cubic Meters'
  },
  primeOverTankCapacity2: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'In Cubic Meters'
  },
  terraceTankCapacity: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'In Cubic Meters'
  },
  headerPressureBar: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'In Bar'
  },
  systemCommissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  
  // AMC / Maintenance
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
  
  // Fire Equipment Count
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
  
  // Fire Pumps
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
  
  // Compliance - Fire NOC
  fireNocNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nocValidityDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  
  // Fire Insurance
  insurancePolicyNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  insurerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Compliance Equipment Count
  complianceExtinguishers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  complianceHydrantPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  complianceSprinklers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  complianceSafeAreas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  
  // Document Upload
  complianceDocuments: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of document URLs'
  },
  
  // Monitoring
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
  
  // Layout Upload
  layoutName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  layouts: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  layoutFiles: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of layout file URLs'
  },
  
  // Scheduler Setup
  schedulerSetups: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of scheduler objects with category, dates, and frequencies'
  },
  
  status: {
    type: DataTypes.ENUM("Active", "Deactive", "Draft"),
    defaultValue: "Draft",
  },
}, {
  tableName: "plants",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Plant;