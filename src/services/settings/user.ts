import axios from "../axios";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  practiceName?: string;
  role?: string;
  isVerified?: boolean;
  termsAccepted?: boolean;
  status?: string;
  locations?: any[];
  permissions?: any[];
  access?: boolean;
  tokenVersion?: number;
  createdAt?: string;
  updatedAt?: string;
  practice?: string;
  specialty?: string;
  medicalSpecialty?: { title: string; _id: string };
  image?: string;
}

// ✅ Get user detail
export const fetchUser = async (id: string): Promise<User> => {
  const response = (await axios.get(`/users/${id}`)) as unknown as {
    data: User;
  };
  return response.data;
};

// ✅ Update user detail
export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const response = (await axios.put(`/users/${id}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })) as unknown as { data: User };
  return (response as any).data || response;
};
