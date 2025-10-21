// firedesk-backend/models/organization/plant/Wing.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Wing = sequelize.define("Wing", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  floorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "floors",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  wingName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Purpose/usage of the wing',
  },
  wingArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Wing area in square meters',
  },
}, {
  tableName: "wings",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Wing;
