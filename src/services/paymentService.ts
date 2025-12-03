import type { ApiResponse } from "@/types/api";
import type { PaymentRequest, PaymentResponse } from "@/types/payment";
import { apiClient } from "./api";

export const paymentService = {
    initiatePayment: async (request: PaymentRequest): Promise<ApiResponse<PaymentResponse>> => {
        const referenceNumber =
            typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2);

        const response = await apiClient.post<ApiResponse<PaymentResponse>>(
            "/transactions/initiate-payment",
            request,
            {
                headers: {
                    referenceNumber,
                },
            }
        );
        return response.data;
    },
};