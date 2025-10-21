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
    defaultValue: "Active",
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