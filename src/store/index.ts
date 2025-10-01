import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./authSlice";
import uiReducer, { UIState } from "./uiSlice";
import commonReducer, { commonState } from "./commonSlice";

export interface RootState {
  auth: AuthState;
  ui: UIState;
  common: commonState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    common: commonReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
