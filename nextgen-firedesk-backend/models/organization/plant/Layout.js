// firedesk-backend/models/organization/plant/Layout.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Layout = sequelize.define("Layout", {
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
  buildingId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "buildings",
      key: "id",
    },
    onDelete: "SET NULL",
  },
  floorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "floors",
      key: "id",
    },
    onDelete: "SET NULL",
  },
  wingId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "wings",
      key: "id",
    },
    onDelete: "SET NULL",
  },
  layoutType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Type of layout (e.g., floor plan, site plan, etc.)',
  },
  layoutUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "layouts",
  timestamps: false,
});

module.exports = Layout;
