const { Schema, model, SchemaTypes } = require("mongoose");

const notificationSchema = new Schema(
  {
    userId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    importance: {
      type: String,
      enum: ["Critical", "Warning", "Reminder"],
      default: "Reminder",
    },
    plantId: {
      type: SchemaTypes.ObjectId,
      ref: "Plant",
      required: false,
    },
    categoryId: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
      required: false,
    },
    title: String,
    message: String,
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Notification", notificationSchema);
