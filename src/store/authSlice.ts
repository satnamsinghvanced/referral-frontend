import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// interface AuthState {
//   user: any | null;
//   token: string | null;
//   isAuthenticated: boolean;
// }

const isTokenValid = (token: string) => {
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false;
    return Date.now() < exp * 1000; // exp is in seconds → convert to ms
  } catch {
    return false;
  }
};

// Load saved credentials
const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken && isTokenValid(savedToken) ? savedToken : null,
  isAuthenticated: savedToken && isTokenValid(savedToken),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      if (!isTokenValid(token)) {
        console.warn("Token is expired, not saving to state");
        return;
      }

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
