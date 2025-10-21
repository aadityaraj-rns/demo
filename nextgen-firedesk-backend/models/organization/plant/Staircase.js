// firedesk-backend/models/organization/plant/Staircase.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Staircase = sequelize.define("Staircase", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  buildingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "buildings",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Type: enclosed, open, spiral',
  },
  width: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Width in meters',
  },
  fireRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Fire rating in minutes (60, 90, 120)',
  },
  pressurization: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  emergencyLighting: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "staircases",
  timestamps: false,
});

module.exports = Staircase;
