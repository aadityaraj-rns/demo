const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Form = sequelize.define("Form", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  serviceName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  status: {
    type: DataTypes.ENUM("Active", "Deactive"),
    defaultValue: "Active",
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, {
  tableName: "forms",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Form;