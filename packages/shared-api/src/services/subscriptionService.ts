import type { ApiResponse } from "@digital-barbershop/shared-types";
import type {
    CreateSubscriptionPlanTemplateRequest,
    SubscriptionPlanTemplateResponse,
} from "@digital-barbershop/shared-types";
import type { ApiClient } from "../apiClient";

export function createSubscriptionService(apiClient: ApiClient) {
    return {
        getSubscriptionPlanTemplatesAdmin: async (): Promise<
            ApiResponse<SubscriptionPlanTemplateResponse[]>
        > => {
            const response = await apiClient.instance.get<
                ApiResponse<SubscriptionPlanTemplateResponse[]>
            >("/subscription/subscription-plan-template");
            return response.data;
        },
        getSubscriptionPlanTemplatesCustomer: async (): Promise<
            ApiResponse<SubscriptionPlanTemplateResponse[]>
        > => {
            const response = await apiClient.instance.get<
                ApiResponse<SubscriptionPlanTemplateResponse[]>
            >("/subscription/subscription-plan-template-for-customer");
            return response.data;
        },
        getSubscriptionPlanTemplate: async (
            id: string
        ): Promise<ApiResponse<SubscriptionPlanTemplateResponse>> => {
            const response = await apiClient.instance.get<
                ApiResponse<SubscriptionPlanTemplateResponse>
            >(`/subscription/subscription-plan-template/${id}`);
            return response.data;
        },
        createSubscriptionPlanTemplate: async (
            payload: CreateSubscriptionPlanTemplateRequest
        ): Promise<ApiResponse<SubscriptionPlanTemplateResponse>> => {
            const response = await apiClient.instance.post<
                ApiResponse<SubscriptionPlanTemplateResponse>
            >("/subscription/subscription-plan-template", payload);
            return response.data;
        },
        updateSubscriptionPlanTemplate: async (
            id: string,
            payload: CreateSubscriptionPlanTemplateRequest
        ): Promise<ApiResponse<SubscriptionPlanTemplateResponse>> => {
            const response = await apiClient.instance.put<
                ApiResponse<SubscriptionPlanTemplateResponse>
            >(`/subscription/subscription-plan-template/${id}`, payload);
            return response.data;
        },
        deactivateSubscriptionPlanTemplate: async (
            id: string
        ): Promise<ApiResponse<string>> => {
            const response = await apiClient.instance.put<
                ApiResponse<string>
            >(`/subscription/subscription-plan-template/${id}/deactivate`);
            return response.data;
        },
        activateSubscriptionPlanTemplate: async (
            id: string
        ): Promise<ApiResponse<string>> => {
            const response = await apiClient.instance.put<
                ApiResponse<string>
            >(`/subscription/subscription-plan-template/${id}/activate`);
            return response.data;
        },
        deleteSubscriptionPlanTemplate: async (
            id: string
        ): Promise<ApiResponse<string>> => {
            const response = await apiClient.instance.delete<
                ApiResponse<string>
            >(`/subscription/subscription-plan-template/${id}`);
            return response.data;
        },
    };
}


