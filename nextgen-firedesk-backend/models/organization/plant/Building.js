// firedesk-backend/models/organization/plant/Building.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Building = sequelize.define("Building", {
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
  buildingName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  buildingHeight: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Height in meters',
  },
  totalArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Total area in square meters',
  },
  totalBuildUpArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Built-up area in square meters',
  },
}, {
  tableName: "buildings",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Building;
