const { required } = require("joi");
const { Schema, default: mongoose } = require("mongoose");

const assetSchema = new Schema(
  {
    groupId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "GroupService",
      required: false,
    },
    document1: {
      type: String,
      required: false,
    },
    document2: {
      type: String,
      required: false,
    },
    assetId: {
      type: String,
      unique: true,
      trim: true,
    },

    plantId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Plant",
      required: true,
    },
    building: {
      type: String,
      required: true,
    },
    productCategoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Product",
      required: true,
    },
    type: { type: String, required: false },
    subType: { type: String, required: false },
    capacity: {
      type: Number,
      required: true,
    },
    capacityUnit: {
      type: String,
      required: false,
      default: "NA",
    },
    location: {
      type: String,
      required: true,
    },
    orgUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    technicianUserId: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        default: null,
        required: false,
      },
    ],
    model: {
      type: String,
      required: false,
    },
    slNo: {
      type: String,
      required: false,
    },
    pressureRating: {
      type: String,
      required: false,
    },
    pressureUnit: {
      type: String,
      enum: ["Kg/Cm2", "PSI", "MWC", "Bar", ""],
      required: false,
    },
    moc: {
      type: String,
      required: false,
    },
    approval: {
      type: String,
      required: false,
    },
    fireClass: {
      type: String,
      required: false,
    },
    manufacturingDate: {
      type: Date,
      required: true,
    },
    installDate: {
      type: Date,
      required: true,
    },
    suctionSize: {
      type: String,
      required: false,
    },
    head: {
      type: String,
      required: false,
    },
    rpm: {
      type: String,
      required: false,
    },
    mocOfImpeller: {
      type: String,
      required: false,
    },
    fuelCapacity: {
      type: String,
      required: false,
    },
    flowInLpm: {
      type: String,
      required: false,
    },
    housePower: {
      type: String,
      required: false,
    },
    healthStatus: {
      type: String,
      enum: ["NotWorking", "AttentionRequired", "Healthy"],
      default: "Healthy",
    },
    tag: {
      type: String,
      required: false,
    },
    qrCodeUrl: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Warranty", "AMC", "In-House", "Deactive"],
      required: true,
    },
    oldlatlongs: [
      {
        plantId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Plant",
          required: false,
        },
        building: {
          type: String,
          required: false,
        },
        location: {
          type: String,
          required: false,
        },
        lat: {
          type: String,
          required: false,
        },
        long: {
          type: String,
          required: false,
        },
      },
    ],
    lat: {
      type: String,
      required: false,
    },
    long: {
      type: String,
      required: false,
    },
    latLongRemark: {
      type: String,
      required: false,
    },
    manufacturerName: { type: String, required: false },
    refilledOn: Date,
    // nextRefilledDue: Date,
    hpTestOn: Date,
    nextHpTestDue: Date,
    condition: {
      type: String,
      required: false,
      enum: [
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
        "",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Asset", assetSchema, "assets");
