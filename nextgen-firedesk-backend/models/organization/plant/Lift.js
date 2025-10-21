// firedesk-backend/models/organization/plant/Lift.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Lift = sequelize.define("Lift", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  buildingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "buildings",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: "lifts",
  timestamps: false,
});

module.exports = Lift;
