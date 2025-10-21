// firedesk-backend/models/admin/masterData/Vendor.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Vendor = sequelize.define("Vendor", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vendorName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "vendors",
  timestamps: false,
});

module.exports = Vendor;
