const { Schema, SchemaTypes, model, default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ticketResponseSchema = new Schema(
  {
    geoCheck: String,
    ticketId: { type: SchemaTypes.ObjectId, ref: "Ticket", required: true },
    plantId: { type: SchemaTypes.ObjectId, ref: "Plant", required: true },
    assetsId: { type: SchemaTypes.ObjectId, ref: "Asset", required: true },
    technicianId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      required: true,
      enum: [
        "Incomplete",
        "Upcoming",
        "Rejected",
        "Waiting for approval",
        "Completed",
      ],
    },
    statusUpdatedBy: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },
    managerRemark: {
      type: String,
      required: false,
    },
    technicianRemark: { type: String, required: false },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        note: { type: String },
      },
    ],
    images: {
      ticketimage1: { type: String, required: false },
      ticketimage2: { type: String, required: false },
      ticketimage3: { type: String, required: false },
    },
  },
  { timestamps: true }
);

ticketResponseSchema.plugin(AutoIncrement, { inc_field: "ticketReportNo" });
module.exports = model(
  "TicketResponse",
  ticketResponseSchema,
  "ticketResponses"
);
