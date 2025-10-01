import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { store } from "../store";
import { logout } from "../store/authSlice";

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
    // const token = process.env.VITE_TOKEN;
    if (token) {
      if (!isTokenValid(token)) {
        store.dispatch(logout());
        window.location.href = "/referral-retrieve/signin"; // redirect if expired
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
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/referral-retrieve/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
