import type { Role } from "./enums";



export interface User {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStaffRequest {
    emails: string[];
    staffRole: Role;
}
export interface DeleteStaffResponse {
    totalRequested: number;
    deleted: number;
    deletedIds: number[];
    restrictedIds: number[];
    notFoundIds: number[];
    message: string;
}

export interface CreateEmployeesResponse {
    totalRequested: number;
    created: number;
    skipped: number;
    existingEmails: string[];
    createdEmails: string[];
    message: string;
}
