import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  userType: "",
  name: "",
  loginID: "",
  phone: "",
  email: "",
  profile: "",
  displayName: "",
  auth: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {
        _id,
        userType,
        loginID,
        name,
        phone,
        email,
        profile,
        displayName,
        auth,
      } = action.payload;

      state._id = _id;
      state.userType = userType;
      state.loginID = loginID;
      state.name = name;
      state.phone = phone;
      state.email = email;
      state.profile = profile;
      state.displayName = displayName;
      state.auth = auth;
    },
    resetUser: (state) => {
      state._id = "";
      state.userType = "";
      state.name = "";
      state.phone = "";
      state.email = "";
      state.profile = "";
      state.displayName = "";
      state.auth = false;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
