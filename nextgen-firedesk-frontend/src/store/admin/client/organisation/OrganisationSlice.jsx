import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    customerName: "",
    contact: "",
    email: "",
    branchName: "",
    cityName: "",
    stateName: "",
    password: "",
};

export const CustomerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { customerName,contact,email,branchName,cityName,stateName,password } = action.payload;

      state.customerName = customerName;
      state.contact = contact;
      state.email = email;
      state.branchName = branchName;
      state.cityName = cityName;
      state.stateName = stateName;
      state.password = password;
    },
    resetCustomer: (state, action) => {
      state.customerName = "";
      state.contact = "";
      state.email = "";
      state.branchName = "";
      state.cityName = "";
      state.stateName = "";
      state.password = "";
    },
  },
});

export const { setCustomer, resetCustomer } = CustomerSlice.actions;

export default CustomerSlice.reducer;
