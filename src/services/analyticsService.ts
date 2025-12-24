import type { ApiResponse } from "@/types/api";
import type { RecordSummary } from "@/types/record";
import type {
    EmployeePerformanceSummary,
    SingleEmployeePerformanceSummary,
    SingleEmployeePerformance,
    WeeklyPerformance
} from "@/types/user";
import { apiClient } from "./api";

/**
 * Analytics Service
 * Centralized service for all analytics and metrics endpoints
 */
export const analyticsService = {
    /**
     * Get records summary analytics
     * Returns total records, revenue, discounts, and pending count
     */
    getRecordsSummary: async (): Promise<ApiResponse<RecordSummary>> => {
        const response = await apiClient.get<ApiResponse<RecordSummary>>(
            "/analytics/records-summary"
        );
        return response.data;
    },

    /**
     * Get staff performance summary for all employees
     * Returns performance metrics for all staff members
     */
    getStaffPerformanceSummary: async (): Promise<ApiResponse<EmployeePerformanceSummary>> => {
        const response = await apiClient.get<ApiResponse<EmployeePerformanceSummary>>(
            "/analytics/staff-performance-summary"
        );
        return response.data;
    },

    /**
     * Get daily performance metrics for a specific staff member
     */
    getStaffDailyPerformance: async (employeeId: number): Promise<ApiResponse<SingleEmployeePerformanceSummary>> => {
        const response = await apiClient.get<ApiResponse<SingleEmployeePerformanceSummary>>(
            `/analytics/staff/${employeeId}/daily-performance`
        );
        return response.data;
    },

    /**
     * Get performance overview (daily, weekly, monthly) for a specific staff member
     */
    getStaffPerformanceOverview: async (employeeId: number): Promise<ApiResponse<SingleEmployeePerformance>> => {
        const response = await apiClient.get<ApiResponse<SingleEmployeePerformance>>(
            `/analytics/staff/${employeeId}/performance-overview`
        );
        return response.data;
    },

    /**
     * Get weekly performance breakdown for a specific staff member
     */
    getStaffWeeklyPerformance: async (
        employeeId: number,
        startDate?: string,
        endDate?: string
    ): Promise<ApiResponse<WeeklyPerformance>> => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const queryString = params.toString();
        const url = `/analytics/staff/${employeeId}/weekly-performance${queryString ? `?${queryString}` : ''}`;
        const response = await apiClient.get<ApiResponse<WeeklyPerformance>>(url);
        return response.data;
    },
};
