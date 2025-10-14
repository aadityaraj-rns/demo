const { DataTypes } = require("sequelize");
const { sequelize } = require("../../database/index");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "categories",
      key: "id",
    },
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  testFrequency: {
    type: DataTypes.ENUM("One Year", "Two Years", "Three Years", "Five Years", "Ten Years"),
    allowNull: false,
  },
  variants: {
    type: DataTypes.JSONB, // Store complex array of objects as JSON
    allowNull: true,
    defaultValue: [],
    validate: {
      customValidator(value) {
        if (!Array.isArray(value)) {
          throw new Error("Variants must be an array");
        }
        
        // Check for unique variant types
        const types = value.map(v => v.type);
        const uniqueTypes = new Set(types);
        if (types.length !== uniqueTypes.size) {
          throw new Error("Each variant.type must be unique in this product");
        }
        
        // Validate each variant structure and unique subTypes
        value.forEach(variant => {
          if (!variant.type || !variant.description || !variant.image) {
            throw new Error("Each variant must have type, description, and image");
          }
          
          if (variant.subType && Array.isArray(variant.subType)) {
            const uniqueSubTypes = new Set(variant.subType);
            if (variant.subType.length !== uniqueSubTypes.size) {
              throw new Error("Duplicate sub-types are not allowed inside the same variant");
            }
          }
        });
      },
    },
  },
  status: {
    type: DataTypes.ENUM("Active", "Deactive"),
    defaultValue: "Active",
  },
}, {
  tableName: "products",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Product;