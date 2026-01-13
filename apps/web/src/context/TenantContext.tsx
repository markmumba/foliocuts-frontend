import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useTenant } from "@/hooks/useTenants";
import type { Tenant } from "@digital-barbershop/shared-types";

interface TenantContextType {
    tenant: Tenant | null;
    isLoading: boolean;
    error: Error | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    // Only fetch tenant data if user is authenticated and has a tenantId
    const { data, isLoading, error } = useTenant(
        user?.tenantId || '',
        1,
        10
    );

    const tenant = data?.data || null;

    const value: TenantContextType = {
        tenant,
        isLoading: isAuthenticated ? isLoading : false,
        error: error as Error | null,
    };

    return (
        <TenantContext.Provider value={value}>
            {children}
        </TenantContext.Provider>
    );
};

export function useTenantContext() {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenantContext must be used within a TenantProvider');
    }
    return context;
}
