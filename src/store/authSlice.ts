import { fromDate } from '@internationalized/date';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

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
 


const isTokenValid = (token: string) => {
  try {
    const { exp } = jwtDecode(token);
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
  isAuthenticated: savedToken && isTokenValid(savedToken),
  loading: false,
  error: null,
};

// Async thunk for signup
// export const signUp = createAsyncThunk(
//   'auth/signUp',
//   async (formData: any, { rejectWithValue }) => {
//     console.log('fromdata at auth slice: ', fromDate)
//     try {
//       // Replace with actual API call
//       const response = await fetch('http://localhost:9090/api/users/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         return rejectWithValue(error.message);
//       }

//       return await response.json();
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { 
    setCredentials: (state, action) => {
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

    // Logout and clear user data
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
  },

  // extraReducers: (builder) => {
  //   builder
  //     // Handle signup async actions
  //     .addCase(signUp.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(signUp.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.user = action.payload;
  //       state.isAuthenticated = true;
  //       state.error = null;
  //     })
  //     .addCase(signUp.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload as string;
  //     });
  // },
});

export const { setCredentials, logout, clearError , loginSuccess} = authSlice.actions;
export default authSlice.reducer;
