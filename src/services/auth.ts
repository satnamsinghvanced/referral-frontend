import axios from "./axios";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: {
        user: any; // Replace with your user type
        token: string;
    };
    token: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axios.post("/users/login", payload);
    return response.data;
};