export type ServiceTypeStaffRole = "BARBER" | "SERVICE_GIRL";

export interface ServiceTypeRequest {
    name: string;
    description: string;
    staffRole: ServiceTypeStaffRole;
}

export interface ServiceTypeResponse {
    id: number;
    name: string;
    description: string;
    staffRole: ServiceTypeStaffRole;
    createdAt: string;
    updatedAt: string;
}


