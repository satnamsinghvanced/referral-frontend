import axios from "../axios";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  practice?: string;
  specialty?: string;
  image?: string;
}

// ✅ Get user detail
export const fetchUser = async (id: string) => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

// ✅ Update user detail
export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const response = await axios.put(`/users/${id}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data", // override default
    },
  });
  return response.data;
};
