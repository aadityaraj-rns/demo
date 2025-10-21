// firedesk-backend/models/organization/plant/MonitoringForm.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const MonitoringForm = sequelize.define("MonitoringForm", {
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
  buildingId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "buildings",
      key: "id",
    },
    onDelete: "SET NULL",
  },
  floorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "floors",
      key: "id",
    },
    onDelete: "SET NULL",
  },
}, {
  tableName: "monitoring_forms",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: false,
});

module.exports = MonitoringForm;
