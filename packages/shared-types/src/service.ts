export interface ServiceRequest {
    serviceTypeId: string;
    name: string;
    description: string;
    price: number;
    defaultCommissionRate: number;
    loyaltyRuleRequest?: LoyaltyRuleRequest | null;
}

export interface ServiceRequestStep1 {
    serviceTypeId: string;
    name: string;
    description: string;
    price: number;
    defaultCommissionRate: number;
}

export interface LoyaltyRuleRequest {
    visitsRequired: number;
    isEnabled: boolean;
    description: string;
}

export interface LoyaltyRuleResponse {
    id: string;
    serviceId: string;
    visitsRequired: number;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceResponse {
    id: string;
    serviceTypeId: string;
    serviceTypeName: string;
    serviceTypeStaffRole: string;
    name: string;
    description: string;
    price: number;
    defaultCommissionRate: number;
    isActive: boolean;
    loyaltyRule: LoyaltyRuleResponse;
    createdAt: string;
    updatedAt: string;
}


