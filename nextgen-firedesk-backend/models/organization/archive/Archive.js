const { Schema, default: mongoose, SchemaTypes } = require("mongoose");

const archiveSchema = new Schema(
  {
    organizationId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    archiveName: { type: String, required: true },
    archiveDescription: { type: String, required: false },
    file: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Archive", archiveSchema);
