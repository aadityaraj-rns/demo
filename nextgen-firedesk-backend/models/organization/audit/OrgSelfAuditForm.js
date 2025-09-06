const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  ans: { type: Schema.Types.Mixed, required: true },
});

const CategorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  questions: [QuestionSchema],
});

const orgSelfAuditSchema = new Schema(
  {
    orgUserId: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    categories: [CategorySchema],
    workPlace: { type: String, required: true },
    inspectorName: { type: String, required: true },
    additionalNotes: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("OrgSelfAuditForm", orgSelfAuditSchema);
