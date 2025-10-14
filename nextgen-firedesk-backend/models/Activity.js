const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/index");

const Activity = sequelize.define(
  "Activity",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Action performed (e.g., created, updated, deleted)',
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type of entity affected (e.g., technician, plant, user)',
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of the affected entity',
    },
    entityName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Name/description of the affected entity',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who performed the action',
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of user who performed the action',
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type of user (admin, manager, technician)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed description of the activity',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional data related to the activity',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address of the user',
    },
    orgUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Organization user ID for filtering',
    },
  },
  {
    tableName: "activities",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['entityType'] },
      { fields: ['action'] },
      { fields: ['orgUserId'] },
      { fields: ['createdAt'] },
    ],
  }
);

module.exports = Activity;
