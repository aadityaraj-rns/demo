const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const GroupService = sequelize.define("GroupService", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  groupId: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  groupName: {
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
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qrCodeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  assetsId: {
    type: DataTypes.JSONB, // Array of UUIDs stored as JSON
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  orgUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  plantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "plants",
      key: "id",
    },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  inspection: {
    type: DataTypes.ENUM("Weekly", "Fortnight", "Monthly", "Quarterly", "Half Year", "Yearly", ""),
    allowNull: true,
  },
  testing: {
    type: DataTypes.ENUM("Weekly", "Fortnight", "Monthly", "Quarterly", "Half Year", "Yearly", ""),
    allowNull: true,
  },
  maintenance: {
    type: DataTypes.ENUM("Weekly", "Fortnight", "Monthly", "Quarterly", "Half Year", "Yearly", ""),
    allowNull: true,
  },
}, {
  tableName: "groupservices",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = GroupService;
