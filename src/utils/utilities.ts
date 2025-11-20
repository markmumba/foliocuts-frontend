
/**
 * Formats a role name by replacing underscores with spaces
 * @param role - The role string (e.g., "SERVICE_GIRL")
 * @returns Formatted role string (e.g., "SERVICE GIRL")
 */
export function formatRole(role: string | null | undefined): string {
    if (!role) return "User";
    return role.replace(/_/g, " ");
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

/**
 * Decodes a JWT token and returns the payload
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
export function decodeJWT(token: string): Record<string, unknown> | null {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
}
