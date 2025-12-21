import type { ApiResponse } from "@/types/api";
import type { CreateRecordRequest, RecordFilters, RecordList, RecordResponse, RecordSummary } from "@/types/record";
import { apiClient } from "./api";



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
    getRecordSummary: async (): Promise<ApiResponse<RecordSummary>> => {
        const response = await apiClient.get<ApiResponse<RecordSummary>>(
            "/transactions/records/summary"
        );
        return response.data;
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