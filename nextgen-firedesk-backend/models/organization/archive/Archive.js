const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Archive = sequelize.define("Archive", {
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
  tableName: "archives",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Archive;
