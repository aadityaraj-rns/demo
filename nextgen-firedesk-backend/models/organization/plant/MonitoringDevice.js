// firedesk-backend/models/organization/plant/MonitoringDevice.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const MonitoringDevice = sequelize.define("MonitoringDevice", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  monitoringFormId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "monitoring_forms",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  edgeDeviceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "edge_devices",
      key: "id",
    },
    onDelete: "CASCADE",
  },
}, {
  tableName: "monitoring_devices",
  timestamps: false,
});

module.exports = MonitoringDevice;
