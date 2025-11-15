import type { ApiResponse } from "@/types/api";
import type { LoginRequest, LoginResponse } from "@/types/login";
import type { RegisterRequest, RegisterResponse } from "@/types/register";
import { apiClient } from "./api";

export const authService = {

    login: async (loginRequest: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', loginRequest);
        return response.data;
    },

    register: async (registerRequest: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
        const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', registerRequest);
        return response.data;
    },
}