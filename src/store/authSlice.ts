import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { disconnectSocket } from "../services/socket";
import { logoutUser } from "../services/auth";
import { queryClient } from "../providers/QueryProvider";

interface User {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  role: string;
  userId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface JwtPayload {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  role: string;
  userId: string;
  exp?: number;
}

const isTokenValid = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return false;
    return Date.now() < exp * 1000; // exp is in seconds → convert to ms
  } catch {
    return false;
  }
};

// Load saved credentials from localStorage
const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken && isTokenValid(savedToken) ? savedToken : null,
  isAuthenticated: !!(savedToken && isTokenValid(savedToken)),
  loading: false,
  error: null,
};

export const handleLogoutThunk = createAsyncThunk(
  "auth/handleLogout",
  async (_, { dispatch }) => {
    try {
      // 1. Disconnect Socket
      disconnectSocket();

      // 2. Notify Server
      await logoutUser();
    } catch (error) {
      console.error("Server logout failed", error);
    } finally {
      // 3. Clear Local State (Always happens even if API fails)
      dispatch(authSlice.actions.logout());
      queryClient.clear();
      window.location.href = `${import.meta.env.VITE_URL_PREFIX}/signin`;
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      if (!isTokenValid(token)) {
        console.warn("Token is expired, not saving to state");
        return;
      }

      state.token = token;
      state.isAuthenticated = true;

      const userData = jwtDecode<JwtPayload>(token); // ✅ typed decode

      // You can also construct your `User` type from here if needed
      const user: User = {
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobile: userData.mobile,
        email: userData.email,
        role: userData.role,
      };

      state.user = user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },

    updateUserFirstName: (
      state,
      action: PayloadAction<{ firstName: string }>,
    ) => {
      if (state.user) {
        state.user.firstName = action.payload.firstName;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    clearError: (state) => {
      state.error = null;
    },

    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      // state.user = action.payload.user;
      // state.token = action.payload.token;
      // state.isAuthenticated = true;
      // localStorage.setItem('user', JSON.stringify(action.payload.user));
      // localStorage.setItem('token', action.payload.token);
    },
  },
});

export const {
  setCredentials,
  updateUserFirstName,
  logout,
  clearError,
  loginSuccess,
} = authSlice.actions;
export default authSlice.reducer;
