import type { ApiResponse } from "@digital-barbershop/shared-types";
import type { RecordSummary } from "@digital-barbershop/shared-types";
import type {
    EmployeePerformanceSummary,
    SingleEmployeePerformanceSummary,
    SingleEmployeePerformance,
    WeeklyPerformance,
} from "@digital-barbershop/shared-types";
import type { ApiClient } from "../apiClient";

export function createAnalyticsService(apiClient: ApiClient) {
    return {
        getRecordsSummary: async (): Promise<ApiResponse<RecordSummary>> => {
            const response = await apiClient.instance.get<
                ApiResponse<RecordSummary>
            >("/analytics/records-summary");
            return response.data;
        },

        getStaffPerformanceSummary: async (): Promise<
            ApiResponse<EmployeePerformanceSummary>
        > => {
            const response = await apiClient.instance.get<
                ApiResponse<EmployeePerformanceSummary>
            >("/analytics/staff-performance-summary");
            return response.data;
        },

        getStaffDailyPerformance: async (
            employeeId: number
        ): Promise<ApiResponse<SingleEmployeePerformanceSummary>> => {
            const response = await apiClient.instance.get<
                ApiResponse<SingleEmployeePerformanceSummary>
            >(`/analytics/staff/${employeeId}/daily-performance`);
            return response.data;
        },

        getStaffPerformanceOverview: async (
            employeeId: number
        ): Promise<ApiResponse<SingleEmployeePerformance>> => {
            const response = await apiClient.instance.get<
                ApiResponse<SingleEmployeePerformance>
            >(`/analytics/staff/${employeeId}/performance-overview`);
            return response.data;
        },

        getStaffWeeklyPerformance: async (
            employeeId: number,
            startDate?: string,
            endDate?: string
        ): Promise<ApiResponse<WeeklyPerformance>> => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            const queryString = params.toString();
            const url = `/analytics/staff/${employeeId}/weekly-performance${
                queryString ? `?${queryString}` : ""
            }`;
            const response = await apiClient.instance.get<
                ApiResponse<WeeklyPerformance>
            >(url);
            return response.data;
        },
    };
}


