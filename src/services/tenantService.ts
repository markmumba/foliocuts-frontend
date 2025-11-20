import type { ApiResponse } from "@/types/api";
import type { Tenant, TenantList } from "@/types/tenant";
import { apiClient } from "./api";


export const tenantService = {
    getTenants: async (page: string, size: string, search: string): Promise<ApiResponse<TenantList>> => {
        const response = await apiClient.get<ApiResponse<TenantList>>('/tenants', {
            params: {
                page,
                size,
                search,
            },
        });
        return response.data;
    },
    getTenant: async (tenantId: string): Promise<ApiResponse<Tenant>> => {
        const response = await apiClient.get<ApiResponse<Tenant>>(`/tenants/${tenantId}`);
        return response.data;
    },

}