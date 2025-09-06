const { Schema, default: mongoose } = require("mongoose");

const sectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    testFrequency: {
      type: String,
      enum: ["Weekly", "Monthly", "Quarterly", "Semi-Annual", "Yearly",""],
      required: false,
    },
    serviceType: {
      type: String,
      enum: ["Inspection", "Maintenance", "Testing"],
      required: true,
    },
    questions: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
  },
  { _id: false } // 🔑 This disables _id for this subdocument
);

const formSchema = new Schema({
  serviceName: {
    type: String,
    required: true,
  },
  sectionName: [sectionSchema],
});

module.exports = mongoose.model("Form", formSchema, "forms");
