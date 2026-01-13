import type { ApiResponse } from "@digital-barbershop/shared-types";
import type {
    CreateRecordRequest,
    RecordFilters,
    RecordList,
    RecordResponse,
} from "@digital-barbershop/shared-types";
import type { ApiClient } from "../apiClient";
import { createAnalyticsService } from "./analyticsService";

export function createRecordService(apiClient: ApiClient) {
    const analyticsService = createAnalyticsService(apiClient);

    return {
        getRecords: async (
            filters: RecordFilters
        ): Promise<ApiResponse<RecordList[]>> => {
            const response = await apiClient.instance.get<
                ApiResponse<RecordList[]>
            >("/transactions/records", { params: filters });
            return response.data;
        },
        getRecord: async (
            recordId: number
        ): Promise<ApiResponse<RecordResponse>> => {
            const response = await apiClient.instance.get<
                ApiResponse<RecordResponse>
            >(`/transactions/records/${recordId}`);
            return response.data;
        },
        createRecord: async (
            request: CreateRecordRequest
        ): Promise<ApiResponse<RecordResponse>> => {
            const response = await apiClient.instance.post<
                ApiResponse<RecordResponse>
            >("/transactions/create-record", request);
            return response.data;
        },
        getRecordSummary: analyticsService.getRecordsSummary,
    };
}


