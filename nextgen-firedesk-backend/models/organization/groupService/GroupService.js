const { SchemaTypes } = require("mongoose");
const { Schema, model } = require("mongoose");

const groupServiceSchema = new Schema(
  {
    groupId: { type: String, required: true },
    groupName: { type: String, required: true },
    formId: {
      type: SchemaTypes.ObjectId,
      ref: "Form",
      required: true,
    },
    description: { type: String, required: false },
    qrCodeUrl: {
      type: String,
      required: false,
    },
    assetsId: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Asset",
        required: true,
      },
    ],
    orgUserId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    plantId: {
      type: SchemaTypes.ObjectId,
      ref: "Plant",
      required: true,
    },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    inspection: {
      type: String,
      enum: [
        "Weekly",
        "Fortnight",
        "Monthly",
        "Quarterly",
        "Half Year",
        "Yearly",
        "",
      ],
      required: false,
    },
    testing: {
      type: String,
      enum: [
        "Weekly",
        "Fortnight",
        "Monthly",
        "Quarterly",
        "Half Year",
        "Yearly",
        "",
      ],
      required: false,
    },
    maintenance: {
      type: String,
      enum: [
        "Weekly",
        "Fortnight",
        "Monthly",
        "Quarterly",
        "Half Year",
        "Yearly",
        "",
      ],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = model("GroupService", groupServiceSchema);
