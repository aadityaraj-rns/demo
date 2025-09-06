const mongoose = require("mongoose");
const { Schema } = mongoose;

const technicianSchema = new Schema(
  {
    technicianId: String,
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    orgId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    plantId: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Plant",
        required: true,
      },
    ],
    categoryId: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    technicianType: {
      type: String,
      enum: ["In House", "Third Party"],
      required: true,
    },
    venderName: {
      type: String,
      validate: {
        validator: function (v) {
          return this.technicianType === "Third Party" ? !!v : true;
        },
        message: 'venderName is required when technicianType is "Third Party".',
      },
    },
    venderNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return this.technicianType === "Third Party" ? !!v : true;
        },
        message:
          'venderNumber is required when technicianType is "Third Party".',
      },
    },
    venderEmail: {
      type: String,
      validate: {
        validator: function (v) {
          return this.technicianType === "Third Party" ? !!v : true;
        },
        message:
          'venderEmail is required when technicianType is "Third Party".',
      },
    },
    venderAddress: {
      type: String,
      validate: {
        validator: function (v) {
          return this.technicianType === "Third Party" ? !!v : true;
        },
        message:
          'venderAddress is required when technicianType is "Third Party".',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Technician", technicianSchema, "technicians");
