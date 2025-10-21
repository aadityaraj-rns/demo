// firedesk-backend/models/organization/plant/DieselGenerator.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const DieselGenerator = sequelize.define("DieselGenerator", {
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
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: "diesel_generators",
  timestamps: false,
});

module.exports = DieselGenerator;
