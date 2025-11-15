export const Role = {
    OWNER: "OWNER",
    RECEPTIONIST: "RECEPTIONIST",
    ADMIN: "ADMIN",
    BARBER: "BARBER",
    SERVICE_GIRL: "SERVICE_GIRL",
} as const;

export type Role = typeof Role[keyof typeof Role];