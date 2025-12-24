import type { ApiResponse } from "@/types/api";
import type { CreateRecordRequest, RecordFilters, RecordList, RecordResponse, RecordSummary } from "@/types/record";
import { apiClient } from "./api";
import { analyticsService } from "./analyticsService";



export const recordService = {
    getRecords: async (filters: RecordFilters): Promise<ApiResponse<RecordList[]>> => {
        const response = await apiClient.get<ApiResponse<RecordList[]>>(
            "/transactions/records",
            {
                params: filters,
            }
        );
        return response.data;
    },
    /**
     * @deprecated Use analyticsService.getRecordsSummary() instead
     * This method delegates to the analytics service for backward compatibility
     */
    getRecordSummary: async (): Promise<ApiResponse<RecordSummary>> => {
        return analyticsService.getRecordsSummary();
    },
    getRecord: async (
        recordId: number
    ): Promise<ApiResponse<RecordResponse>> => {
        const response = await apiClient.get<ApiResponse<RecordResponse>>(
            `/transactions/records/${recordId}`
        );
        return response.data;
    },
    createRecord: async (
        request: CreateRecordRequest
    ): Promise<ApiResponse<RecordResponse>> => {
        const response = await apiClient.post<ApiResponse<RecordResponse>>(
            "/transactions/create-record",
            request
        );
        return response.data;
    },

};