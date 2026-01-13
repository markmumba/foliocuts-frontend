import type { ApiResponse } from "@digital-barbershop/shared-types";
import type {
    ServiceTypeResponse,
    ServiceTypeRequest,
    ServiceResponse,
    ServiceRequest,
} from "@digital-barbershop/shared-types";
import type { ApiClient } from "../apiClient";

export function createServicesService(apiClient: ApiClient) {
    return {
        getServiceTypes: async (): Promise<ApiResponse<ServiceTypeResponse[]>> => {
            const response = await apiClient.instance.get<
                ApiResponse<ServiceTypeResponse[]>
            >("/services/service-type");
            return response.data;
        },
        createServiceType: async (
            data: ServiceTypeRequest
        ): Promise<ApiResponse<ServiceTypeResponse>> => {
            const response = await apiClient.instance.post<
                ApiResponse<ServiceTypeResponse>
            >("/services/service-type", data);
            return response.data;
        },
        createService: async (
            data: ServiceRequest
        ): Promise<ApiResponse<ServiceResponse>> => {
            const response = await apiClient.instance.post<
                ApiResponse<ServiceResponse>
            >("/services", data);
            return response.data;
        },
        getServices: async (): Promise<ApiResponse<ServiceResponse[]>> => {
            const response = await apiClient.instance.get<
                ApiResponse<ServiceResponse[]>
            >("/services");
            return response.data;
        },
        getService: async (
            serviceId: string
        ): Promise<ApiResponse<ServiceResponse>> => {
            const response = await apiClient.instance.get<
                ApiResponse<ServiceResponse>
            >(`/services/${serviceId}`);
            return response.data;
        },
        getServicesByServiceTypeId: async (
            serviceTypeId: string
        ): Promise<ApiResponse<ServiceResponse[]>> => {
            const response = await apiClient.instance.get<
                ApiResponse<ServiceResponse[]>
            >(`/services/service-type-services/${serviceTypeId}`);
            return response.data;
        },
    };
}


