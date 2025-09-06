const mongoose = require("mongoose");
const { Schema } = mongoose;

const managerSchema = new Schema(
  {
    managerId: String,
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    orgUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Manager", managerSchema, "managers");
