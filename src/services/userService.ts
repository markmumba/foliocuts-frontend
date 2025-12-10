import type { ApiResponse } from "@/types/api";
import { apiClient } from "./api";
import type {
    CreateStaffRequest,
    CreateEmployeesResponse,
    DeleteStaffResponse,
    User,
    EmployeePerformanceSummary,
    SingleEmployeePerformanceSummary,
    SingleEmployeePerformance,
    WeeklyPerformance,
    EmployeeServices,
    RecentActivity
} from "@/types/user";


export const userService = {
    getUsers: async (): Promise<ApiResponse<User[]>> => {
        const response = await apiClient.get<ApiResponse<User[]>>('/users/employees-for-tenant');
        return response.data;
    },
    getRoles: async (): Promise<ApiResponse<string[]>> => {
        const response = await apiClient.get<ApiResponse<string[]>>('/users/roles');
        return response.data;
    },
    createStaff: async (request: CreateStaffRequest): Promise<ApiResponse<CreateEmployeesResponse>> => {
        const response = await apiClient.post<ApiResponse<CreateEmployeesResponse>>('/users/create-employees', request);
        return response.data;
    },
    deleteStaff: async (staffId: number): Promise<ApiResponse<User>> => {
        const response = await apiClient.delete<ApiResponse<User>>(`/users/delete-employee/${staffId}`);
        return response.data;
    },
    deleteMultipleStaff: async (staffIds: number[]): Promise<ApiResponse<DeleteStaffResponse>> => {
        const response = await apiClient.post<ApiResponse<DeleteStaffResponse>>('/users/delete-employees', { staffIds });
        return response.data;
    },

    // Staff Performance Metrics
    getEmployeesPerformanceSummary: async (): Promise<ApiResponse<EmployeePerformanceSummary>> => {
        const response = await apiClient.get<ApiResponse<EmployeePerformanceSummary>>('/users/employees-performance-summary');
        return response.data;
    },
    getEmployeeDailyPerformance: async (employeeId: number): Promise<ApiResponse<SingleEmployeePerformanceSummary>> => {
        const response = await apiClient.get<ApiResponse<SingleEmployeePerformanceSummary>>(`/users/employee/${employeeId}/daily-performance`);
        return response.data;
    },
    getEmployeePerformanceOverview: async (employeeId: number): Promise<ApiResponse<SingleEmployeePerformance>> => {
        const response = await apiClient.get<ApiResponse<SingleEmployeePerformance>>(`/users/employee/${employeeId}/performance-overview`);
        return response.data;
    },
    getEmployeeWeeklyPerformance: async (employeeId: number, startDate?: string, endDate?: string): Promise<ApiResponse<WeeklyPerformance>> => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const queryString = params.toString();
        const url = `/users/employee/${employeeId}/weekly-performance${queryString ? `?${queryString}` : ''}`;
        const response = await apiClient.get<ApiResponse<WeeklyPerformance>>(url);
        return response.data;
    },
    getEmployeeServices: async (employeeId: number): Promise<ApiResponse<EmployeeServices>> => {
        const response = await apiClient.get<ApiResponse<EmployeeServices>>(`/users/employee/${employeeId}/services`);
        return response.data;
    },
    getRecentActivities: async (employeeId: number, limit?: number): Promise<ApiResponse<RecentActivity[]>> => {
        const params = new URLSearchParams();
        if (limit !== undefined) params.append('limit', limit.toString());
        const queryString = params.toString();
        const url = `/users/employee/${employeeId}/recent-activities${queryString ? `?${queryString}` : ''}`;
        const response = await apiClient.get<ApiResponse<RecentActivity[]>>(url);
        return response.data;
    },

}