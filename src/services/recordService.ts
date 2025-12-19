import type { ApiResponse } from "@/types/api";
import type { CreateRecordRequest, RecordList, RecordResponse } from "@/types/record";
import { apiClient } from "./api";

export interface RecordFilters {
    page: number;
    size: number;
    search?: string;
    staffName?: string;
    paymentMethod?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}

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