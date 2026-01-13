export type SubscriptionPlan = "BASIC" | "PREMIUM" | "ENTERPRISE";

export interface SubscriptionPlanTemplateResponse {
    id: string;
    plan: SubscriptionPlan;
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    trialDays: number;
    maxStaff: number;
    maxServices: number;
    maxAppointmentsPerMonth: number;
    features: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
    yearlySavings: number;
    yearlyDiscountPercentage: number;
}

export interface CreateSubscriptionPlanTemplateRequest {
    plan: SubscriptionPlan;
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice?: number;
    trialDays: number;
    maxStaff: number;
    maxServices: number;
    maxAppointmentsPerMonth: number;
    features: string;
    isActive: boolean;
    displayOrder: number;
}


