import type { ApiResponse } from "@/types/api";
import { apiClient } from "./api";
import type { CreateStaffRequest, CreateEmployeesResponse, DeleteStaffResponse, User } from "@/types/user";


export const userService = {
    getUsers: async (): Promise<ApiResponse<User[]>> => {
        const response = await apiClient.get<ApiResponse<User[]>>('/users/employees-for-tenant');
        return response.data;
    },
    getRoles: async (): Promise<ApiResponse<string[]>> => {
        const response = await apiClient.get<ApiResponse<string[]>>('/users/roles');
        return response.data;
    },
    createStaff: async (request: CreateStaffRequest): Promise<ApiResponse<CreateEmployeesResponse>> => {
        const response = await apiClient.post<ApiResponse<CreateEmployeesResponse>>('/users/create-employees', request);
        return response.data;
    },
    deleteStaff: async (staffId: number): Promise<ApiResponse<User>> => {
        const response = await apiClient.delete<ApiResponse<User>>(`/users/delete-employee/${staffId}`);
        return response.data;
    },
    deleteMultipleStaff: async (staffIds: number[]): Promise<ApiResponse<DeleteStaffResponse>> => {
        const response = await apiClient.post<ApiResponse<DeleteStaffResponse>>('/users/delete-employees', { staffIds });
        return response.data;
    },

}   