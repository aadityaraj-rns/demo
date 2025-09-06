import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  categorieName: "",
};

export const CategorieSlice = createSlice({
  name: "categorie",
  initialState,
  reducers: {
    setCategorie: (state, action) => {
      const { categorieName } = action.payload;

      state.categorieName = categorieName;
    },
    resetCategorie: (state, action) => {
      state.categorieName = "";
    },
  },
});

export const { setCategorie, resetCategorie } = CategorieSlice.actions;

export default CategorieSlice.reducer;
