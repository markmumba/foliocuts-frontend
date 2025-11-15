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
    fullName: string;
    phone: string;
    status: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

