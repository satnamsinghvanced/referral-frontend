// src/store/slices/medicalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface commonState {
  specialties: string[];
  error: string | null;
}

const initialState: commonState = {
  specialties: [],
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
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setSpecialties, setError } = commmonSlice.actions;
export default commmonSlice.reducer;
