const mongoose = require("mongoose");
const { Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);


const variantSchema = new Schema(
  {
    type: { type: String, required: true, trim: true },

    subType: {
      type: [String], // array of strings
      default: [],
      validate: {
        validator: (arr) => new Set(arr).size === arr.length,
        message: "Duplicate sub-types are not allowed inside the same variant",
      },
    },

    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false } // don’t need separate _ids for variants
);


const productSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    productName: { type: String, required: true },

    testFrequency: {
      type: String,
      required: true,
      enum: ["One Year", "Two Years", "Three Years", "Five Years", "Ten Years"],
    },

    variants: {
      type: [variantSchema],
      default: [],
      validate: {
        validator: function (arr) {
          const seen = new Set();
          for (const v of arr) {
            if (seen.has(v.type)) return false; // duplicate type
            seen.add(v.type);
          }
          return true;
        },
        message: "Each variant.type must be unique in this product",
      },
    },

    status: { type: String, enum: ["Active", "Deactive"], default: "Active" },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Product", productSchema);
