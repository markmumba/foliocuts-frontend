import type { CustomerList, CustomerResponse } from "@/types/customer";
import { apiClient } from "./api";
import type { ApiResponse, PaginatedData } from "@/types/api";

export const customerService = {
    getCustomers: async (page: number, size: number, search: string): Promise<ApiResponse<PaginatedData<CustomerList>>> => {
        const response = await apiClient.get<ApiResponse<PaginatedData<CustomerList>>>('/customers', {
            params: {
                page,
                size,
                search,
            },
        });
        return response.data;
    },
    getCustomer: async (customerId: number): Promise<ApiResponse<CustomerResponse>> => {
        const response = await apiClient.get<ApiResponse<CustomerResponse>>(`/customers/${customerId}`);
        return response.data;
    }
}
