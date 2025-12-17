
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

export const formatDateTime = (dateString?: string) => {
    if (!dateString) return { full: "—", date: "—", time: "—" };
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return { full: dateString, date: dateString, time: "—" };

    return {
        full: date.toLocaleDateString('en-KE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        date: date.toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-KE', {
            hour: '2-digit',
            minute: '2-digit'
        })
    };
};

export const formatCurrency = (amount?: number | string) => {
    const parsed = Number(amount ?? 0);
    if (Number.isNaN(parsed)) return "KES 0.00";
    return `KES ${parsed.toFixed(2)}`;
};

export const getInitials = (fullName: string | null | undefined) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };