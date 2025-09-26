import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  practiceName: string;
  role: string;
  status: string;
  __v: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface JwtPayload {
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
const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken && isTokenValid(savedToken) ? savedToken : null,
  isAuthenticated: !!(savedToken && isTokenValid(savedToken)),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;

      if (!isTokenValid(token)) {
        console.warn('Token is expired, not saving to state');
        return;
      }

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    clearError: (state) => {
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
  },
});

export const { setCredentials, logout, clearError, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
