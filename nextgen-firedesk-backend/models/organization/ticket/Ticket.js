const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Ticket = sequelize.define("Ticket", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ticketId: {
    type: DataTypes.STRING,
    allowNull: true,
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
  assetsId: {
    type: DataTypes.JSONB, // Array of UUIDs stored as JSON
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  taskNames: {
    type: DataTypes.JSONB, // Array of strings stored as JSON
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  taskDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ticketType: {
    type: DataTypes.ENUM("General", "Asset Related"),
    defaultValue: "General",
  },
  completedStatus: {
    type: DataTypes.ENUM("Pending", "Rejected", "Waiting for approval", "Completed"),
    defaultValue: "Pending",
  },
}, {
  tableName: "tickets",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Ticket;
