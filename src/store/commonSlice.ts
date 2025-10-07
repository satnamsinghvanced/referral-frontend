// src/store/slices/medicalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface commonState {
  specialties: string[];
  roles: string[];
  permissions: string[];
  error: string | null;
}

const initialState: commonState = {
  specialties: [],
  roles: [],
  permissions: [],
  error: null,
};

const commmonSlice = createSlice({
  name: "commmon",
  initialState,
  reducers: {
    setSpecialties: (state, action: PayloadAction<string[]>) => {
      state.specialties = action.payload;
      state.error = null;
    },
    setRoles: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload;
      state.error = null;
    },
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setSpecialties, setRoles, setPermissions, setError } =
  commmonSlice.actions;
export default commmonSlice.reducer;
