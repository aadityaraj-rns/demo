const mongoose = require("mongoose");
const { Schema } = mongoose;

const citySchema = new Schema(
  {
    stateId: { type: mongoose.SchemaTypes.ObjectId, ref: "State", required: true },
    cityName: { type: String, required: true },
    status: { type: String, enum: ["Active", "Deactive"], default: "Active" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("City", citySchema, "citys");
