// models/admin/masterData/selfAudit.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const SelfAudit = sequelize.define("SelfAudit", {
  selfAuditId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "self_audit_id",
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false, 
    field: "name",
  }
}, {
  tableName: "self_audits",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = SelfAudit;
