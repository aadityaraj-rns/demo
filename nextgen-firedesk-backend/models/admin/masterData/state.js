const mongoose = require("mongoose");

const { Schema } = mongoose;

const stateSchema = new Schema(
  {
    stateName: { type: String, required: true },
    status: { type: String, enum: ["Active", "Deactive"], default: "Active" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("State", stateSchema, "states");
