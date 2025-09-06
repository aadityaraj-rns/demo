const { Schema, SchemaTypes, model, default: mongoose } = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const ticketSchema = new Schema(
  {
    ticketId: String,
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
    assetsId: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Asset",
        required: true,
      },
    ],
    taskNames: { type: [String], required: true },
    taskDescription: { type: String, required: false },
    targetDate: { type: Date, required: true },
    ticketType: {
      type: String,
      enum: ["General", "Asset Related"],
      default: "Pending",
    },
    completedStatus: {
      type: String,
      enum: ["Pending", "Rejected", "Waiting for approval", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// ticketSchema.plugin(AutoIncrement, { inc_field: "ticketId" });

module.exports = model("Ticket", ticketSchema, "tickets");
