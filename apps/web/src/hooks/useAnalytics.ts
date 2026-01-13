import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { analyticsService } from "@/lib/api";
import type {
    ApiResponse,
    RecordSummary,
    EmployeePerformanceSummary,
    SingleEmployeePerformanceSummary,
    SingleEmployeePerformance,
    WeeklyPerformance
} from "@digital-barbershop/shared-types";

/**
 * Analytics Hooks
 * Custom React Query hooks for analytics and metrics data
 */

// Records Analytics
export function useRecordsSummary(): UseQueryResult<ApiResponse<RecordSummary>, Error> {
    return useQuery({
        queryKey: ['analytics-records-summary'],
        queryFn: () => analyticsService.getRecordsSummary(),
    });
}

// Staff Performance Analytics
export function useStaffPerformanceSummary(): UseQueryResult<ApiResponse<EmployeePerformanceSummary>, Error> {
    return useQuery({
        queryKey: ['analytics-staff-performance-summary'],
        queryFn: () => analyticsService.getStaffPerformanceSummary(),
    });
}

export function useStaffDailyPerformance(employeeId: number | null): UseQueryResult<ApiResponse<SingleEmployeePerformanceSummary>, Error> {
    return useQuery({
        queryKey: ['analytics-staff-daily-performance', employeeId],
        queryFn: () => employeeId
            ? analyticsService.getStaffDailyPerformance(employeeId)
            : Promise.reject('No employee ID provided'),
        enabled: !!employeeId,
    });
}

export function useStaffPerformanceOverview(employeeId: number | null): UseQueryResult<ApiResponse<SingleEmployeePerformance>, Error> {
    return useQuery({
        queryKey: ['analytics-staff-performance-overview', employeeId],
        queryFn: () => employeeId
            ? analyticsService.getStaffPerformanceOverview(employeeId)
            : Promise.reject('No employee ID provided'),
        enabled: !!employeeId,
    });
}

export function useStaffWeeklyPerformance(
    employeeId: number | null,
    startDate?: string,
    endDate?: string
): UseQueryResult<ApiResponse<WeeklyPerformance>, Error> {
    return useQuery({
        queryKey: ['analytics-staff-weekly-performance', employeeId, startDate, endDate],
        queryFn: () => employeeId
            ? analyticsService.getStaffWeeklyPerformance(employeeId, startDate, endDate)
            : Promise.reject('No employee ID provided'),
        enabled: !!employeeId,
    });
}
