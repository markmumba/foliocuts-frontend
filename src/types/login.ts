export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;

}

export interface UserResponse {
    id: number;
    email: string;
    fullName: string | null;
    phone: string | null;
    status: string;
    role: string | null;
    tenantId: string | null;
    createdAt: string;
    updatedAt: string;
}

