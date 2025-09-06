import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  state: "",
  city: "",
};

export const addCity = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCity: (state, action) => {
      const { stateName, city } = action.payload;

      state.stateName = stateName;
      state.city = city;
    },
    resetCity: (state, action) => {
      state.stateName = "";
      state.city = "";
    },
  },
});

export const { setCity, resetCity } = addCity.actions;

export default addCity.reducer;
