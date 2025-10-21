// firedesk-backend/models/organization/plant/FireSafetyForm.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const FireSafetyForm = sequelize.define("FireSafetyForm", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  plantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "plants",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  primeOverTankCapacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Capacity in cubic meters',
  },
  terraceTankCapacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Capacity in cubic meters',
  },
  dieselTank1Capacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Diesel tank 1 capacity in cubic meters',
  },
  dieselTank2Capacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Diesel tank 2 capacity in cubic meters',
  },
  headerPressureBar: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Header pressure in Bar',
  },
  systemCommissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  amcVendorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "vendors",
      key: "id",
    },
    onDelete: "SET NULL",
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
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  electricalPump: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  jockeyPump: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "fire_safety_forms",
  timestamps: false,
});

module.exports = FireSafetyForm;
