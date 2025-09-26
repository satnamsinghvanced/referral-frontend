// services/authService.ts
import { useMutation } from '@tanstack/react-query';

const base_url = import.meta.env.API_BASE_URL || 'http://localhost:9090'

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
    data: {
        _id: string;
        firstName: string;
        lastName: string;
        mobile: string;
        email: string;
        practiceName: string;
        role: string;
        status: string;
        __v: number;
    };
    token: string;
}

export const useLoginMutation = () => {
    return useMutation<LoginResponse, Error, LoginData>({
        mutationFn: async (loginData: LoginData) => {
            const response = await fetch(`${base_url}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            return await response.json();
        },
    });
};