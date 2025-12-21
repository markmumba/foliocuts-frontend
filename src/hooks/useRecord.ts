import { recordService } from "@/services/recordService";
import type { ApiResponse } from "@/types/api";
import type { RecordFilters, RecordList, RecordResponse, RecordSummary } from "@/types/record";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useRecords(filters: RecordFilters): UseQueryResult<ApiResponse<RecordList[]>, Error> {
    return useQuery({
        queryKey: ["records", filters],
        queryFn: () => recordService.getRecords(filters),
    });
}

export function useRecord(recordId: number): UseQueryResult<ApiResponse<RecordResponse>, Error> {
    return useQuery({
        queryKey: ['record', recordId],
        queryFn: () => recordService.getRecord(recordId),
        enabled: !!recordId && recordId > 0,
    })
}   

export function useRecordSummary(): UseQueryResult<ApiResponse<RecordSummary>, Error> {
    return useQuery({
        queryKey: ['record-summary'],
        queryFn: () => recordService.getRecordSummary(),
    })
}