const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/index");

const PumpIOTLiveData = sequelize.define("PumpIOTLiveData", {
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
  tableName: "pumpiotlivedatas",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = PumpIOTLiveData;
