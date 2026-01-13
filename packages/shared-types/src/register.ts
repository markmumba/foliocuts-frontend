export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    address?: string;
    tenant: TenantRequest;
    subscriptionPlanId?: string;
}

export interface TenantRequest {
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    mpesaTillNo: string;
    mpesaBusinessShortCode: string;
}

export interface RegisterResponse {
    id: number;
    email: string;
    fullName: string;
    role: string;
    status: string;
    createdAt: string;
}

export interface RegisterStep1Request {
    fullName: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    confirmPassword: string;
}


