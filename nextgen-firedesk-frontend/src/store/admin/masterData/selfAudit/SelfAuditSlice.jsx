import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  question: "",
  questionType: "",
};

export const SelfAuditSlice = createSlice({
  name: "selfAudit",
  initialState,
  reducers: {
    setSelfAudit: (state, action) => {
      const { question, questionType } = action.payload;

      state.question = question;
      state.questionType = questionType;
    },
    resetSelfAudit: (state, action) => {
      state.question = "";
      state.questionType = "";
    },
  },
});

export const { setSelfAudit, resetSelfAudit } = SelfAuditSlice.actions;

export default SelfAuditSlice.reducer;
