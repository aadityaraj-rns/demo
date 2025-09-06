const { required } = require("joi");
const { Schema, default: mongoose } = require("mongoose");

const questionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Question", questionSchema, "questions");
