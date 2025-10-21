// firedesk-backend/models/organization/plant/Entrance.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Entrance = sequelize.define("Entrance", {
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
  entranceName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  width: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Width in meters',
  },
}, {
  tableName: "entrances",
  timestamps: false,
});

module.exports = Entrance;
