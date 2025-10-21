// firedesk-backend/models/organization/plant/ComplianceFireSafety.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const ComplianceFireSafety = sequelize.define("ComplianceFireSafety", {
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
  fireNocNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nocValidityDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  insurancePolicyNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  insurerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numFireExtinguishers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numHydrantPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numSprinklers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numSafeAssemblyAreas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  documentUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "compliance_fire_safety",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = ComplianceFireSafety;
