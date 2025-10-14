// models/admin/masterData/selfAuditCategory.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const SelfAuditCategory = sequelize.define("SelfAuditCategory", {
  selfAuditCategoryId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "self_audit_category_id",
  },
  selfAuditId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "self_audit_id",
  },
  categoryName: {
    type: DataTypes.TEXT, 
    allowNull: false,
    field: "category_name",
  }
}, {
  tableName: "self_audit_categories",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = SelfAuditCategory;
