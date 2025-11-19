
/**
 * Formats a role name by replacing underscores with spaces
 * @param role - The role string (e.g., "SERVICE_GIRL")
 * @returns Formatted role string (e.g., "SERVICE GIRL")
 */
export function formatRole(role: string): string {
    return role.replace(/_/g, " ")
}


export const parseFeatures = (features: string): string[] => {
    if (!features) return [];
    try {
        const parsed = JSON.parse(features);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // ignore
    }
    return features.split(/[,;|]/).map((f) => f.trim()).filter(Boolean);
};


export const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
    }).format(price);
