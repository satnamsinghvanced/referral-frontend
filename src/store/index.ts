import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./authSlice";
import uiReducer, { UIState } from "./uiSlice";

export interface RootState {
  auth: AuthState;
  ui: UIState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
