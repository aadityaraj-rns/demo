import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  partnerName: "",
  contact: "",
  email: "",
  branchName: "",
  cityName: "",
  stateName: "",
  category: "",
  password: "",
};

export const PartnerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setPartner: (state, action) => {
      const {
        partnerName,
        contact,
        email,
        branchName,
        cityName,
        stateName,
        password,
        category,
      } = action.payload;

      state.partnerName = partnerName;
      state.contact = contact;
      state.email = email;
      state.branchName = branchName;
      state.cityName = cityName;
      state.stateName = stateName;
      state.category = category;
      state.password = password;
    },
    resetPartner: (state, action) => {
      state.partnerName = "";
      state.contact = "";
      state.email = "";
      state.branchName = "";
      state.cityName = "";
      state.stateName = "";
      state.category = "";
      state.password = "";
    },
  },
});

export const { setPartner, resetPartner } = PartnerSlice.actions;

export default PartnerSlice.reducer;
