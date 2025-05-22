import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  _id: string;
  name: string;
  phone: string;
  password: string;
}

const initialState: AuthState = {
  _id: "",
  name: "",
  phone: "",
  password: "",
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login(state, action) {
      const { _id, name, phone } = action.payload;
      state._id = _id;
      state.name = name;
      state.phone = phone;
    },
    logout(state) {
      state._id = "";
      state.name = "";
      state.phone = "";
      state.password = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
