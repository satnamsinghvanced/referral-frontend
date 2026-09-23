import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { addToast } from "@heroui/react";
import { queryClient } from "../providers/QueryProvider";

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

const triggerLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("cached_billing_data")) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {}
  queryClient.clear();
  window.location.href = `${import.meta.env.VITE_URL_PREFIX || ""}/signin`;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!isTokenValid(token)) {
        triggerLogout();
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
    if (error.message === "Network Error" || error.code === "ERR_NETWORK" || !error.response) {
      error.message = "Network Error. Please try again after some time.";
      if (!isToastShowing) {
        isToastShowing = true;
        addToast({
          title: "Error",
          description: "Network Error. Please try again after some time.",
          color: "danger",
        });
        setTimeout(() => {
          isToastShowing = false;
        }, 5000);
      }
    }
    const url = error.config?.url || "";
    const isAuthRequest =
      url.includes("/login") ||
      url.includes("/signin") ||
      url.includes("/logout") ||
      url.includes("/verify-2fa") ||
      url.includes("/check-email") ||
      url.includes("/register") ||
      url.includes("/forgot-password") ||
      url.includes("/reset-password");
    const currentToken = localStorage.getItem("token");

    if (error.response?.status === 401 && !isAuthRequest && currentToken) {
      triggerLogout();
    } else if (error.response?.status === 403 && !isAuthRequest) {
      if (!isToastShowing) {
        isToastShowing = true;
        addToast({
          title: "Access Restricted",
          description: error.response?.data?.message || "This feature is not included in your current subscription plan.",
          color: "warning",
        });
        setTimeout(() => {
          isToastShowing = false;
        }, 5000);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
