const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");
const State = require("./state");

const City = sequelize.define("City", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cityName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
  stateId: { type: DataTypes.UUID, allowNull: false, references: { model: "states", key: "id" } },
  status: { type: DataTypes.ENUM("Active", "Deactive"), defaultValue: "Active" },
  createdBy: { type: DataTypes.UUID, allowNull: false, references: { model: "users", key: "id" } },
}, {
  tableName: "cities",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

City.belongsTo(State, { foreignKey: "stateId", onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = City;
