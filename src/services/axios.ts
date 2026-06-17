import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { queryClient } from "../providers/QueryProvider";
import { store } from "../store";
import { handleLogoutThunk } from "../store/authSlice";

interface JwtPayload {
  exp?: number;
  nextBillingDate?: string;
}

const isTokenValid = (token: string) => {
  try {
    const { exp, nextBillingDate } = jwtDecode<JwtPayload>(token);
    if (!exp) {
      return false;
    }
    if (Date.now() >= exp * 1000) {
      return false;
    }
    if (nextBillingDate) {
      const billingDate = new Date(nextBillingDate);
      if (!isNaN(billingDate.getTime()) && billingDate < new Date()) {
        return false;
      }
    }
    return true;
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
        store.dispatch(handleLogoutThunk());
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isToastShowing = false;

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response && !isToastShowing) {
      isToastShowing = true;
      // addToast({
      //   title: "Network Error",
      //   description:
      //     "Unable to connect to the server. This may be a CORS issue or network failure.",
      //   color: "danger",
      // });

      // Reset the flag after some time to allow future toasts
      setTimeout(() => {
        isToastShowing = false;
      }, 5000);
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!error.config?.url?.includes("/logout")) {
        store.dispatch(handleLogoutThunk());
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
