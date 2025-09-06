const mongoose = require("mongoose");
const { Schema } = mongoose;
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const categorySchema = new Schema(
  {
    categoryName: { type: String, required: true },
    formId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Form",
      required: true,
    },
    status: { type: String, enum: ["Active", "Deactive"], default: "Active" },
  },
  {
    timestamps: true,
  }
);

// categorySchema.plugin(AutoIncrement, { inc_field: "categoryId" });

module.exports = mongoose.model("Category", categorySchema, "categories");
