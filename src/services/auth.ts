import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "./axiosInstance";
import axiosInstance from "./axios";

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data; // Expect { user, token }
};

const fetchUsers = async () => {
  const { data } = await axiosInstance.get("/users");
  return data;
};

export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}