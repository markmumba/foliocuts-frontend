import type { ApiResponse } from "@/types/api";
import type { RecordList, RecordResponse } from "@/types/record";
import { apiClient } from "./api";


export const recordService = {
    getRecords: async (page: number, size: number, search: string): Promise<ApiResponse<RecordList[]>> => {
        const response = await apiClient.get<ApiResponse<RecordList[]>>('/transactions/records', {
            params: {
                page,
                size,
                search,
            },
        });
        return response.data;
    },
    getRecord: async (recordId: number): Promise<ApiResponse<RecordResponse>> => {
        const response = await apiClient.get<ApiResponse<RecordResponse>>(`/transactions/records/${recordId}`);
        return response.data;
    },
}