const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Technician = sequelize.define(
  "Technician",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    technicianId: { type: DataTypes.STRING, allowNull: false, unique: true },
    orgUserId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    managerId: { type: DataTypes.UUID, allowNull: true },
    plantId: { type: DataTypes.UUID, allowNull: true },
    categoryId: { type: DataTypes.UUID, allowNull: true },
    technicianType: { type: DataTypes.ENUM("In House", "Third Party"), allowNull: false },
    venderName: { type: DataTypes.STRING, allowNull: true },
    venderNumber: { type: DataTypes.STRING, allowNull: true },
    venderEmail: { type: DataTypes.STRING, allowNull: true },
    venderAddress: { type: DataTypes.TEXT, allowNull: true },
    experience: { type: DataTypes.STRING, allowNull: true },
    specialization: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" },
  },
  {
    tableName: "technicians",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

Technician.associate = function (models) {
  Technician.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
  Technician.belongsTo(models.User, { foreignKey: "orgUserId", as: "organization", onDelete: "CASCADE" });

  // Optional relations - already set to allowNull: true
  Technician.belongsTo(models.Manager, { foreignKey: "managerId", as: "manager", onDelete: "SET NULL", constraints: false });
  Technician.belongsTo(models.Plant, { foreignKey: "plantId", as: "plant", onDelete: "SET NULL", constraints: false });
  Technician.belongsTo(models.Category, { foreignKey: "categoryId", as: "category", onDelete: "SET NULL", constraints: false });
};

module.exports = Technician;