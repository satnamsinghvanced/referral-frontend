import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { store } from "../store";
import { logout } from "../store/authSlice";
import { queryClient } from "../providers/QueryProvider";

const isTokenValid = (token: string) => {
  try {
    const { exp } = jwtDecode(token);
    if (!exp) {
      return false;
    }
    return Date.now() < exp! * 1000;
  } catch {
    return false;
  }
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      if (!isTokenValid(token)) {
        store.dispatch(logout());
        queryClient.clear();
        window.location.href = `${import.meta.env.VITE_URL_PREFIX}/signin`; // redirect if expired
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      store.dispatch(logout());
      queryClient.clear();
      window.location.href = `${import.meta.env.VITE_URL_PREFIX}/signin`;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
