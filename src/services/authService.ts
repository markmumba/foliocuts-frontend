import type { ApiResponse } from "@/types/api";
import type { LoginRequest, LoginResponse } from "@/types/login";
import { apiClient } from "./api";

export const authService = {

    login: async (loginRequest: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', loginRequest);
        return response.data;
    },
}