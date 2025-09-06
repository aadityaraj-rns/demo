import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  product: "",
  category: "",
  type: "",
  capacity: "",
  make: "",
  modal: "",
  bodyType: "",
  fireRating: "",
  description: "",
  image1: null,
  image2: null,
  file1: null,
  file2: null,
  file3: null,
  file4: null,
};

export const ProductSlice = createSlice({
  name: "createSlice",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      const {
        product,
        category,
        type,
        make,
        modal,
        bodyType,
        fireRating,
        description,
        image1,
        image2,
        file1,
        file2,
        file3,
        file4,
      } = action.payload;

      state.product = product;
      state.category = category;
      state.type = type;
      state.make = make;
      state.modal = modal;
      state.bodyType = bodyType;
      state.fireRating = fireRating;
      state.description = description;
      state.image1 = image1;
      state.image2 = image2;
      state.file1 = file1;
      state.file2 = file2;
      state.file3 = file3;
      state.file4 = file4;
    },
    resetProduct: (state) => {
      state.product = "";
      state.category = "";
      state.type = "";
      state.make = "";
      state.modal = "";
      state.fireRating = "";
      state.description = "";
      state.image1 = null;
      state.image2 = null;
      state.file1 = null;
      state.file2 = null;
      state.file3 = null;
      state.file4 = null;
    },
  },
});

export const { setProduct, resetProduct } = ProductSlice.actions;

export default ProductSlice.reducer;
