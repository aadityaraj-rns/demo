import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  productName: "",
  details: "",
  serviceFrequence: "",
  questions: "",
  remark: "",
};

export const ServiceSlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setService: (state, action) => {
      const { productName, details, serviceFrequence, questions, remark } =
        action.payload;

      state.productName = productName;
      state.details = details;
      state.serviceFrequence = serviceFrequence;
      state.questions = questions;
      state.remark = remark;
    },
    resetService: (state, action) => {
      state.productName = "";
      state.details = "";
      state.serviceFrequence = "";
      state.questions = "";
      state.remark = "";
    },
  },
});

export const { setService, resetService } = ServiceSlice.actions;

export default ServiceSlice.reducer;
