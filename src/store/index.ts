import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./authSlice";
import uiReducer, { UIState } from "./uiSlice";
import commonReducer, { commonState } from "./commonSlice";
import statsReducer, { statsState } from "./statsSlice";

export interface RootState {
  auth: AuthState;
  ui: UIState;
  common: commonState;
  stats: statsState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    common: commonReducer,
    stats: statsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
