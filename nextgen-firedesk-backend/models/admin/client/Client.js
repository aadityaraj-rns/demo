const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceDetailsSchema = new Schema(
  {
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    serviceFrequency: {
      inspection: {
        type: String,
        enum: [
          "Weekly",
          "Fortnight",
          "Monthly",
          "Quarterly",
          "Half Year",
          "Yearly",
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
        ],
        required: false,
      },
    },
  },
  { _id: false }
);

const categoryHistorySchema = new Schema(
  {
    editedAt: { type: Date, default: Date.now },
    editedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    changes: { type: String },
  },
  { _id: false }
);

const categorySchema = new Schema(
  {
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
    serviceDetails: serviceDetailsSchema,
    categoryHistory: [categoryHistorySchema],
  },
  { _id: false }
);

const clientSchema = new Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    branchName: { type: String, required: false },
    cityId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "City",
      required: true,
    },
    industryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Industry",
      required: false,
    },
    clientType: {
      type: String,
      enum: ["partner", "organization"],
      requited: true,
    },
    categories: [categorySchema],
    gst: { type: String, required: false },
    pincode: { type: String, required: false },
    address: { type: String, required: false },
    headerImage: { type: String, required: false },
    footerImage: { type: String, required: false },
    createdByPartnerUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", clientSchema, "clients");
