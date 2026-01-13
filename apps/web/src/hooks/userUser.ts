import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api";


export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: userService.getUsers,
    })
}

export function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: userService.getRoles,
    })
}

// Staff Performance Metrics Hooks
export function useEmployeesPerformanceSummary() {
    return useQuery({
        queryKey: ['employees-performance-summary'],
        queryFn: userService.getEmployeesPerformanceSummary,
    })
}

export function useEmployeeDailyPerformance(employeeId: number | null) {
    return useQuery({
        queryKey: ['employee-daily-performance', employeeId],
        queryFn: () => employeeId ? userService.getEmployeeDailyPerformance(employeeId) : Promise.reject('No employee ID'),
        enabled: !!employeeId,
    })
}

export function useEmployeePerformanceOverview(employeeId: number | null) {
    return useQuery({
        queryKey: ['employee-performance-overview', employeeId],
        queryFn: () => employeeId ? userService.getEmployeePerformanceOverview(employeeId) : Promise.reject('No employee ID'),
        enabled: !!employeeId,
    })
}

export function useEmployeeWeeklyPerformance(employeeId: number | null, startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: ['employee-weekly-performance', employeeId, startDate, endDate],
        queryFn: () => employeeId ? userService.getEmployeeWeeklyPerformance(employeeId, startDate, endDate) : Promise.reject('No employee ID'),
        enabled: !!employeeId,
    })
}

export function useEmployeeServices(employeeId: number | null) {
    return useQuery({
        queryKey: ['employee-services', employeeId],
        queryFn: () => employeeId ? userService.getEmployeeServices(employeeId) : Promise.reject('No employee ID'),
        enabled: !!employeeId,
    })
}

export function useRecentActivities(employeeId: number | null, limit?: number) {
    return useQuery({
        queryKey: ['employee-recent-activities', employeeId, limit],
        queryFn: () => employeeId ? userService.getRecentActivities(employeeId, limit) : Promise.reject('No employee ID'),
        enabled: !!employeeId,
    })
}
