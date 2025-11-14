import axios from "axios";
import { store } from "../store";
import { logout } from "../store/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
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
