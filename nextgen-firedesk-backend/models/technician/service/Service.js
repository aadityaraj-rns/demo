// const { required } = require("joi");
// const { Schema, model, SchemaTypes } = require("mongoose");

// const serviceSchema = new Schema(
//   {
//     assetId: {
//       type: SchemaTypes.ObjectId,
//       ref: "Asset",
//       required: true,
//     },
//     technicianUserId: {
//       type: SchemaTypes.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     serviceStartDate: { type: Date, required: true },
//     serviceEndDate: { type: Date, required: false },
//     serviceStatus: {
//       type: String,
//       enum: ["In Progress", "Completed"],
//       default: "In Progress",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// module.exports = model("Service", serviceSchema, "services");
