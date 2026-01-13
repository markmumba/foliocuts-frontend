import type {
    CustomerList,
    CustomerResponse,
    ApiResponse,
    PaginatedData,
} from "@digital-barbershop/shared-types";
import type { ApiClient } from "../apiClient";

export function createCustomerService(apiClient: ApiClient) {
    return {
        getCustomers: async (
            page: number,
            size: number,
            search: string
        ): Promise<ApiResponse<PaginatedData<CustomerList>>> => {
            const response = await apiClient.instance.get<
                ApiResponse<PaginatedData<CustomerList>>
            >("/customers", {
                params: { page, size, search },
            });
            return response.data;
        },
        getCustomer: async (
            customerId: number
        ): Promise<ApiResponse<CustomerResponse>> => {
            const response = await apiClient.instance.get<
                ApiResponse<CustomerResponse>
            >(`/customers/${customerId}`);
            return response.data;
        },
        getCustomerByPhone: async (
            phone: string
        ): Promise<ApiResponse<CustomerResponse>> => {
            const response = await apiClient.instance.get<
                ApiResponse<CustomerResponse>
            >(`/customers/phone`, { params: { phone } });
            return response.data;
        },
    };
}


