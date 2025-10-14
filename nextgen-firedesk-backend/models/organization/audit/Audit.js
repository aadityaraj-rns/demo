const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Audit = sequelize.define("Audit", {
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
  tableName: "audits",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Audit;
