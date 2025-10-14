const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    branchName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "cities",
        key: "id",
      },
    },
    industryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "industries",
        key: "id",
      },
    },
    clientType: {
      type: DataTypes.ENUM("partner", "organization"),
      allowNull: false,
    },
    categories: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      validate: {
        customValidator(value) {
          if (!Array.isArray(value)) throw new Error("Categories must be an array");
          value.forEach((category) => {
            if (!category.categoryId) throw new Error("Each category must have a categoryId");
            if (category.serviceDetails) {
              const { serviceFrequency } = category.serviceDetails;
              const validFrequencies = ["Weekly", "Fortnight", "Monthly", "Quarterly", "Half Year", "Yearly"];
              if (serviceFrequency) {
                ["inspection", "testing", "maintenance"].forEach((type) => {
                  if (serviceFrequency[type] && !validFrequencies.includes(serviceFrequency[type])) {
                    throw new Error(`Invalid ${type} frequency`);
                  }
                });
              }
            }
            if (category.categoryHistory && !Array.isArray(category.categoryHistory)) {
              throw new Error("Category history must be an array");
            }
          });
        },
      },
    },
    gst: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    headerImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    footerImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdByPartnerUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    // New optional fields
    mongo_id: {
      type: DataTypes.STRING(24),
      allowNull: true,
    },
  },
  {
    tableName: "clients",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = Client;
