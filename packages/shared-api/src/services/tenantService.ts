import type { ApiResponse } from "@digital-barbershop/shared-types";
import type { Tenant, TenantList } from "@digital-barbershop/shared-types";
import type { ApiClient } from "../apiClient";

export function createTenantService(apiClient: ApiClient) {
    return {
        getTenants: async (
            page: string,
            size: string,
            search: string
        ): Promise<ApiResponse<TenantList>> => {
            const response = await apiClient.instance.get<
                ApiResponse<TenantList>
            >("/tenants", { params: { page, size, search } });
            return response.data;
        },
        getTenant: async (
            tenantId: string,
            userPage: number = 1,
            userPageSize: number = 10
        ): Promise<ApiResponse<Tenant>> => {
            const response = await apiClient.instance.get<
                ApiResponse<Tenant>
            >(`/tenants/${tenantId}`, { params: { userPage, userPageSize } });
            return response.data;
        },
    };
}


