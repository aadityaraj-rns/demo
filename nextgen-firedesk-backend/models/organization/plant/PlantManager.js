// firedesk-backend/models/organization/plant/PlantManager.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const PlantManager = sequelize.define("PlantManager", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  plantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "plants",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  managerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "managers",
      key: "id",
    },
    onDelete: "CASCADE",
  },
}, {
  tableName: "plant_managers",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['plantId', 'managerId']
    }
  ]
});

module.exports = PlantManager;
