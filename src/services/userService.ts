import type { ApiResponse } from "@/types/api";
import { apiClient } from "./api";
import { analyticsService } from "./analyticsService";
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

    // Staff Performance Metrics - Delegated to Analytics Service
    /**
     * @deprecated Use analyticsService.getStaffPerformanceSummary() instead
     * This method delegates to the analytics service for backward compatibility
     */
    getEmployeesPerformanceSummary: async (): Promise<ApiResponse<EmployeePerformanceSummary>> => {
        return analyticsService.getStaffPerformanceSummary();
    },
    /**
     * @deprecated Use analyticsService.getStaffDailyPerformance() instead
     * This method delegates to the analytics service for backward compatibility
     */
    getEmployeeDailyPerformance: async (employeeId: number): Promise<ApiResponse<SingleEmployeePerformanceSummary>> => {
        return analyticsService.getStaffDailyPerformance(employeeId);
    },
    /**
     * @deprecated Use analyticsService.getStaffPerformanceOverview() instead
     * This method delegates to the analytics service for backward compatibility
     */
    getEmployeePerformanceOverview: async (employeeId: number): Promise<ApiResponse<SingleEmployeePerformance>> => {
        return analyticsService.getStaffPerformanceOverview(employeeId);
    },
    /**
     * @deprecated Use analyticsService.getStaffWeeklyPerformance() instead
     * This method delegates to the analytics service for backward compatibility
     */
    getEmployeeWeeklyPerformance: async (employeeId: number, startDate?: string, endDate?: string): Promise<ApiResponse<WeeklyPerformance>> => {
        return analyticsService.getStaffWeeklyPerformance(employeeId, startDate, endDate);
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
    updateEmployeeCommission: async (employeeId: number, serviceId: string, rate: number): Promise<ApiResponse<string>> => {
        const response = await apiClient.patch<ApiResponse<string>>(`/users/employee/${employeeId}/service/${serviceId}/update-commission`, { rate });
        return response.data;
    },

}