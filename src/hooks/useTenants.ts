import { tenantService } from "@/services/tenantService";
import { useQuery } from "@tanstack/react-query";

export function useTenants(page: string, size: string, search: string) {
    return useQuery({
        queryKey: ['tenants', page, size, search],
        queryFn: () => tenantService.getTenants(page, size, search),

    })
}

export function useTenant(tenantId: string, userPage: number = 1, userPageSize: number = 10) {
    return useQuery({
        queryKey: ['tenant', tenantId, userPage, userPageSize],
        queryFn: () => tenantService.getTenant(tenantId, userPage, userPageSize),
        enabled: !!tenantId,
    })
}