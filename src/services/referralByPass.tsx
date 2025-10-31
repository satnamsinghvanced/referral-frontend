import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Remove token-related interceptors
axiosInstance.interceptors.request.use(
    (config) => {
        // No token handling here anymore
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.log('error: ', error)
        // if (error.response?.status === 401) {
        //     // Redirect to login if unauthorized (no token, expired, etc.)
        //     window.location.href = "/referral-retrieve/signin";
        // }
        // return Promise.reject(error);
    }
);

export default axiosInstance;
