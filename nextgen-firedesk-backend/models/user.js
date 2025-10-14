const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/index");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile: {
      type: DataTypes.STRING,
    },
    loginID: {
      type: DataTypes.STRING,
    },
    // New fields for scalability and extra functionality
    status: {
      type: DataTypes.STRING(10), // e.g., active, inactive
      allowNull: true,
    },
    otp: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    device_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mongo_id: { 
      type: DataTypes.STRING(24), // Optional migration from MongoDB
      allowNull: true,
    },
    // ADD ROLE ID FIELD HERE
    roleId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

// ADD ASSOCIATION METHOD
User.associate = function(models) {
  User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
};

module.exports = User;