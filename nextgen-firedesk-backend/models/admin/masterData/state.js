const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const State = sequelize.define("State", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  stateName: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { notEmpty: true } },
  status: { type: DataTypes.ENUM("Active", "Deactive"), defaultValue: "Active" },
  createdBy: { type: DataTypes.UUID, allowNull: false, references: { model: "users", key: "id" } },
}, {
  tableName: "states",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = State;
 