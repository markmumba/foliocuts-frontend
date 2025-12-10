import type { Role } from "./enums";

export interface User {
    id: number;
    email: string;
    fullName?: string | null;
    phoneNumber?: string | null;
    phone?: string | null;
    role: string | null;
    status: string;
    tenantId?: string | null;
    createdAt: string;
    updatedAt?: string;
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

// Staff Performance Types
export interface TodayTotals {
    services: number;
    revenue: string | number;
    commission: string | number;
}

export interface EmployeePerformanceSummary {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    todayTotals: TodayTotals;
}

export interface SingleEmployeePerformanceSummary {
    services: number;
    revenue: string | number;
    commission: string | number;
    servicesPerformed?: string[];
}

export interface Performance {
    services: number;
    revenue: string | number;
    commission: string | number;
}

export interface SingleEmployeePerformance {
    todaysPerformance: Performance;
    weeklyPerformance: Performance;
    monthlyPerformance: Performance;
    assignedServices: string[];
}

export interface DailyPerformance {
    day: string;
    services: number;
    revenue: string | number;
    commission: string | number;
}

export interface WeeklyPerformance {
    data: DailyPerformance[];
}

export interface ServiceCommissionRate {
    service: string;
    rate: string | number;
}

export interface EmployeeServices {
    assignedServices: string[];
    commissionRates: ServiceCommissionRate[];
}

export interface RecentActivity {
    recordId: number;
    customerNumber: string;
    serviceName: string;
    commission: string | number;
    amount: string | number;
    createdAt: string;
}
