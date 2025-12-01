import { recordService } from "@/services/recordService";
import type { ApiResponse } from "@/types/api";
import type { RecordList, RecordResponse } from "@/types/record";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";



export function useRecords(page: number, size: number, search: string): UseQueryResult<ApiResponse<RecordList[]>, Error> {
    return useQuery({
        queryKey: ['records', page, size, search],
        queryFn: () => recordService.getRecords(page, size, search),
    })
}

export function useRecord(recordId: number): UseQueryResult<ApiResponse<RecordResponse>, Error> {
    return useQuery({
        queryKey: ['record', recordId],
        queryFn: () => recordService.getRecord(recordId),
        enabled: !!recordId && recordId > 0,
    })
}   
