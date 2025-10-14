const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../database/index");

const Asset = sequelize.define("Asset", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "groupservices",
      key: "id",
    },
  },
  document1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  document2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  assetId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  plantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "plants",
      key: "id",
    },
  },
  building: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  productCategoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "categories",
      key: "id",
    },
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "products",
      key: "id",
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  capacity: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  capacityUnit: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "NA",
  },
  location: {
    type: DataTypes.STRING,
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
  technicianUserId: {
    type: DataTypes.JSONB, // Array of UUIDs stored as JSON
    allowNull: true,
    defaultValue: [],
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pressureRating: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pressureUnit: {
    type: DataTypes.ENUM("Kg/Cm2", "PSI", "MWC", "Bar", ""),
    allowNull: true,
  },
  moc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  approval: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fireClass: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  manufacturingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  installDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  suctionSize: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  head: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rpm: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mocOfImpeller: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fuelCapacity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  flowInLpm: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  housePower: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  healthStatus: {
    type: DataTypes.ENUM("NotWorking", "AttentionRequired", "Healthy"),
    defaultValue: "Healthy",
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qrCodeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Warranty", "AMC", "In-House", "Deactive"),
    allowNull: false,
  },
  oldlatlongs: {
    type: DataTypes.JSONB, // Array of objects stored as JSON
    allowNull: true,
    defaultValue: [],
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  long: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latLongRemark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  manufacturerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refilledOn: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  hpTestOn: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  nextHpTestDue: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  condition: {
    type: DataTypes.ENUM(
      "Ticket Due",
      "Service Due", 
      "Refilling Required",
      "Due for HP Test",
      "Low Pressure",
      "Obstruction",
      "Displaced",
      "Damaged",
      "Under Weight",
      "Spare Required",
      "Tampered",
      "AMC Due",
      "Nearing End of Life",
      "Out-Of Warranty",
      "GEO Location : Outside",
      "GEO Location : Inside",
      ""
    ),
    allowNull: true,
  },
}, {
  tableName: "assets",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

module.exports = Asset;
