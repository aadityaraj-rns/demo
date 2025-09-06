const mongoose = require("mongoose");

const serviceTicketsSchema = new mongoose.Schema(
  {
    individualService: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: false,
    },
    groupServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupService",
      required: false,
    },
    orgUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },
    assetsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        required: true,
      },
    ],
    serviceType: {
      type: String,
      required: true,
      enum: {
        values: ["Inspection", "Testing", "Maintenance"],
        message: "{VALUE} is not a valid service type",
      },
    },
    serviceFrequency: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    expireDate: {
      type: Date,
      required: true,
    },
    submittedFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormResponse",
      required: false,
    },
    completedStatus: {
      type: String,
      enum: [
        "Pending",
        "Lapsed",
        "Waiting for approval",
        "Rejected",
        "Completed",
        "",
      ],
      required: false,
    },
    statusUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    serviceDoneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceTickets", serviceTicketsSchema);
