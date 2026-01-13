import type { ApiResponse } from "@digital-barbershop/shared-types";
import type { PaymentRequest, PaymentResponse } from "@digital-barbershop/shared-types";
import type { ApiClient } from "../apiClient";

export function createPaymentService(apiClient: ApiClient) {
    return {
        initiatePayment: async (
            request: PaymentRequest
        ): Promise<ApiResponse<PaymentResponse>> => {
            const referenceNumber =
                typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : Math.random().toString(36).slice(2);

            const response = await apiClient.instance.post<
                ApiResponse<PaymentResponse>
            >("/transactions/initiate-payment", request, {
                headers: { referenceNumber },
            });
            return response.data;
        },
    };
}


