import { tenantService } from "@/services/tenantService";
import { useQuery } from "@tanstack/react-query";

export function useTenants(page: string, size: string, search: string) {
    return useQuery({
        queryKey: ['tenants', page, size, search],
        queryFn: () => tenantService.getTenants(page, size, search),

    })
}

export function useTenant(tenantId: string) {
    return useQuery({
        queryKey: ['tenant', tenantId],
        queryFn: () => tenantService.getTenant(tenantId),
        enabled: !!tenantId,
    })
}