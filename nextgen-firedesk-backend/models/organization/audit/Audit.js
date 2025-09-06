const { required } = require("joi");
const { Schema, default: mongoose, SchemaTypes } = require("mongoose");

const auditSchema = new Schema(
  {
    orgUserId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    nameOfAudit: {
      type: String,
      required: true,
    },
    plantId: {
      type: SchemaTypes.ObjectId,
      ref: "Plant",
      required: true,
    },
    auditorName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Audit", auditSchema, "audits");
