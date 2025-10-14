// models/admin/masterData/selfAuditQuestion.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const SelfAuditQuestion = sequelize.define("SelfAuditQuestion", {
  selfAuditQuestionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "self_audit_question_id",
  },
  selfAuditCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "self_audit_category_id",
  },
  questionText: { 
    type: DataTypes.TEXT,
    allowNull: false,
    field: "question_text",
  },
  questionType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "question_type",
  }
}, {
  tableName: "self_audit_questions",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = SelfAuditQuestion;
