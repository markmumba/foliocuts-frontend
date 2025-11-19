import type { ApiResponse } from "@/types/api";
import type { CreateSubscriptionPlanTemplateRequest, SubscriptionPlanTemplateResponse } from "@/types/subscriptionPlanTemplate";
import { apiClient } from "./api";

export const subscriptionService = {

    getSubscriptionPlanTemplates: async (): Promise<ApiResponse<SubscriptionPlanTemplateResponse[]>> => {
        const response = await apiClient.get<ApiResponse<SubscriptionPlanTemplateResponse[]>>('/subscription/subscription-plan-template');
        console.log("response", response.data);
        return response.data;
    },
    getSubscriptionPlanTemplate: async (id: string): Promise<ApiResponse<SubscriptionPlanTemplateResponse>> => {
        console.log("id", id);
        console.log("endpoint url", apiClient.getUri());
        const response = await apiClient.get<ApiResponse<SubscriptionPlanTemplateResponse>>(`/subscription/subscription-plan-template/${id}`);

        console.log("response", response.data);

        return response.data;
    },
    
    createSubscriptionPlanTemplate: async (payload: CreateSubscriptionPlanTemplateRequest): Promise<ApiResponse<SubscriptionPlanTemplateResponse>> => {
        const response = await apiClient.post<ApiResponse<SubscriptionPlanTemplateResponse>>('/subscription/subscription-plan-template', payload);
        return response.data;
    },

    updateSubscriptionPlanTemplate: async (id: string, payload: CreateSubscriptionPlanTemplateRequest): Promise<ApiResponse<SubscriptionPlanTemplateResponse>> => {
        const response = await apiClient.put<ApiResponse<SubscriptionPlanTemplateResponse>>(`/subscription/subscription-plan-template/${id}`, payload);
        return response.data;
    },

    deactivateSubscriptionPlanTemplate: async (id: string): Promise<ApiResponse<string>> => {
        const response = await apiClient.put<ApiResponse<string>>(`/subscription/subscription-plan-template/${id}/deactivate`);
        return response.data;
    },
    activateSubscriptionPlanTemplate: async (id: string): Promise<ApiResponse<string>> => {
        const response = await apiClient.put<ApiResponse<string>>(`/subscription/subscription-plan-template/${id}/activate`);
        return response.data;
    },

}