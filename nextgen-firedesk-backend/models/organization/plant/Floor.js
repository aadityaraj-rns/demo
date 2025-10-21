// firedesk-backend/models/organization/plant/Floor.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Floor = sequelize.define("Floor", {
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
  floorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Purpose/usage of the floor (e.g., office, warehouse, etc.)',
  },
  floorArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Floor area in square meters',
  },
}, {
  tableName: "floors",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Floor;
