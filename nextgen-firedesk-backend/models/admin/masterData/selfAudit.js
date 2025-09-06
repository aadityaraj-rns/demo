const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
    enum: ["Yes/No", "Input"], // Restricting to specific types
  },
});

const CategorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  questions: [QuestionSchema], // Embedding QuestionSchema as an array inside CategorySchema
});

const selfAuditSchema = new Schema(
  {
    categories: [CategorySchema], // Embedding CategorySchema as an array
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SelfAudit", selfAuditSchema, "selfAudits");
