import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface statsState {
  totalReferrals: number;
}

const initialState: statsState = {
  totalReferrals: 0,
};

const statsSlice = createSlice({
  name: "commmon",
  initialState,
  reducers: {
    setTotalReferrals: (state, action: PayloadAction<number>) => {
      state.totalReferrals = action.payload;
    },
  },
});

export const { setTotalReferrals } = statsSlice.actions;
export default statsSlice.reducer;
