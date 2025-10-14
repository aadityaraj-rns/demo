const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/index");

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // TODO: Add specific fields based on original Mongoose model
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
}, {
  tableName: "notifications",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Notification;
