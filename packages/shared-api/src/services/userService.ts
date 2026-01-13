import type { ApiResponse } from "@digital-barbershop/shared-types";
import type {
    CreateStaffRequest,
    CreateEmployeesResponse,
    DeleteStaffResponse,
    User,
    EmployeeServices,
    RecentActivity,
} from "@digital-barbershop/shared-types";
import type { ApiClient } from "../apiClient";
import { createAnalyticsService } from "./analyticsService";

export function createUserService(apiClient: ApiClient) {
    const analyticsService = createAnalyticsService(apiClient);

    return {
        getUsers: async (): Promise<ApiResponse<User[]>> => {
            const response = await apiClient.instance.get<ApiResponse<User[]>>(
                "/users/employees-for-tenant"
            );
            return response.data;
        },
        getRoles: async (): Promise<ApiResponse<string[]>> => {
            const response = await apiClient.instance.get<
                ApiResponse<string[]>
            >("/users/roles");
            return response.data;
        },
        createStaff: async (
            request: CreateStaffRequest
        ): Promise<ApiResponse<CreateEmployeesResponse>> => {
            const response = await apiClient.instance.post<
                ApiResponse<CreateEmployeesResponse>
            >("/users/create-employees", request);
            return response.data;
        },
        deleteStaff: async (staffId: number): Promise<ApiResponse<User>> => {
            const response = await apiClient.instance.delete<
                ApiResponse<User>
            >(`/users/delete-employee/${staffId}`);
            return response.data;
        },
        deleteMultipleStaff: async (
            staffIds: number[]
        ): Promise<ApiResponse<DeleteStaffResponse>> => {
            const response = await apiClient.instance.post<
                ApiResponse<DeleteStaffResponse>
            >("/users/delete-employees", { staffIds });
            return response.data;
        },
        getEmployeeServices: async (
            employeeId: number
        ): Promise<ApiResponse<EmployeeServices>> => {
            const response = await apiClient.instance.get<
                ApiResponse<EmployeeServices>
            >(`/users/employee/${employeeId}/services`);
            return response.data;
        },
        getRecentActivities: async (
            employeeId: number,
            limit?: number
        ): Promise<ApiResponse<RecentActivity[]>> => {
            const params = new URLSearchParams();
            if (limit !== undefined) params.append("limit", limit.toString());
            const queryString = params.toString();
            const url = `/users/employee/${employeeId}/recent-activities${
                queryString ? `?${queryString}` : ""
            }`;
            const response = await apiClient.instance.get<
                ApiResponse<RecentActivity[]>
            >(url);
            return response.data;
        },
        updateEmployeeCommission: async (
            employeeId: number,
            serviceId: string,
            rate: number
        ): Promise<ApiResponse<string>> => {
            const response = await apiClient.instance.patch<
                ApiResponse<string>
            >(
                `/users/employee/${employeeId}/service/${serviceId}/update-commission`,
                { rate }
            );
            return response.data;
        },
        getEmployeesPerformanceSummary: analyticsService.getStaffPerformanceSummary,
        getEmployeeDailyPerformance: analyticsService.getStaffDailyPerformance,
        getEmployeePerformanceOverview: analyticsService.getStaffPerformanceOverview,
        getEmployeeWeeklyPerformance: analyticsService.getStaffWeeklyPerformance,
    };
}


