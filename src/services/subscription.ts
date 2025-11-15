import type { ApiResponse } from "@/types/api";
import type { SubscriptionPlanTemplateResponse } from "@/types/subscriptionPlanTemplate";
import { apiClient } from "./api";

export const subscriptionService = {

    getSubscriptionPlanTemplates: async (): Promise<ApiResponse<SubscriptionPlanTemplateResponse[]>> => {
        const response = await apiClient.get<ApiResponse<SubscriptionPlanTemplateResponse[]>>('/subscription/subscription-plan-template');
        return response.data;
    },

}