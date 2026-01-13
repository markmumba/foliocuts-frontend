import type { ApiResponse } from "@digital-barbershop/shared-types";
import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
} from "@digital-barbershop/shared-types";
import type { ApiClient } from "../apiClient";

export function createAuthService(apiClient: ApiClient) {
    return {
        login: async (
            loginRequest: LoginRequest
        ): Promise<ApiResponse<LoginResponse>> => {
            const response = await apiClient.instance.post<
                ApiResponse<LoginResponse>
            >("/auth/login", loginRequest);
            return response.data;
        },

        register: async (
            registerRequest: RegisterRequest
        ): Promise<ApiResponse<RegisterResponse>> => {
            const response = await apiClient.instance.post<
                ApiResponse<RegisterResponse>
            >("/auth/register", registerRequest);
            return response.data;
        },

        refreshToken: async (
            refreshTokenRequest: RefreshTokenRequest
        ): Promise<ApiResponse<RefreshTokenResponse>> => {
            const response = await apiClient.instance.post<
                ApiResponse<RefreshTokenResponse>
            >("/auth/refresh", refreshTokenRequest);
            return response.data;
        },
    };
}


