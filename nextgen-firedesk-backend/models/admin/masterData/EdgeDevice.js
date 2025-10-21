// firedesk-backend/models/admin/masterData/EdgeDevice.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const EdgeDevice = sequelize.define("EdgeDevice", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  deviceName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deviceCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "edge_devices",
  timestamps: false,
});

module.exports = EdgeDevice;
