const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  formId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "forms",
      key: "id",
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
  tableName: "categories",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Category;