import type { ApiResponse } from "@/types/api";
import type { ServiceTypeResponse, ServiceTypeRequest } from "@/types/serviceType";
import { apiClient } from "./api";
import type { ServiceResponse } from "@/types/service";
import type { ServiceRequest } from "@/types/service";


export const servicesService = {

    getServiceTypes: async (): Promise<ApiResponse<ServiceTypeResponse[]>> => {
        const response = await apiClient.get<ApiResponse<ServiceTypeResponse[]>>('/services/service-type');
        return response.data;
    },
    createServiceType: async (data: ServiceTypeRequest): Promise<ApiResponse<ServiceTypeResponse>> => {
        const response = await apiClient.post<ApiResponse<ServiceTypeResponse>>('/services/service-type', data);
        return response.data;
    },
    createService: async (data: ServiceRequest): Promise<ApiResponse<ServiceResponse>> => {
        const response = await apiClient.post<ApiResponse<ServiceResponse>>('/services', data);
        return response.data;
    },
    getServices: async (): Promise<ApiResponse<ServiceResponse[]>> => {
        const response = await apiClient.get<ApiResponse<ServiceResponse[]>>('/services');
        return response.data;
    },
    getService: async (serviceId: string): Promise<ApiResponse<ServiceResponse>> => {
        const response = await apiClient.get<ApiResponse<ServiceResponse>>(`/services/${serviceId}`);
        return response.data;
    },
}
