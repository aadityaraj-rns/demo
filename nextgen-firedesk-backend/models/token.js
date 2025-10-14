const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/index");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false, 
      unique: true, // one refresh token per user
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "refresh_tokens",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = RefreshToken;
