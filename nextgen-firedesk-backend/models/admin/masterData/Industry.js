const mongoose = require("mongoose");

const { Schema } = mongoose;

const industrySchema = new Schema(
  {
    industryName: { type: String, required: true },
    status: { type: String, enum: ["Active", "Deactive"], default: "Active" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Industry", industrySchema, "industrys");
