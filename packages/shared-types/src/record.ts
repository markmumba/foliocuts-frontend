import type { PaymentMethod, PaymentStatus } from "./enums";

export interface RecordResponse {
    id: number;
    recordCode: string;
    customerPhoneNumber: string;
    customerName: string;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: string;
    serviceItems: ServiceItem[];
    message: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceItem {
    serviceItemId: number;
    serviceName: string;
    staffName: string;
    price: number;
    isFree: boolean;
    freeReason: string | null;
}

export interface RecordList {
    id: string;
    recordCode: string;
    customerPhoneNumber: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    customerName: string;
    totalAmount: string;
    discountAmount: string;
    finalAmount: string;
    status: string;
    servicesAndStaff: ServiceStaff[];
}

export interface ServiceStaff {
    serviceName: string;
    staffName: string;
}

export interface CreateRecordRequest {
    customerPhoneNumber: string;
    serviceItems: ServiceItemRequest[];
}

export interface ServiceItemRequest {
    serviceId: string;
    staffId: string;
}

export interface CompleteRecordRequest {
    paymentMethod: "CASH" | "MPESA";
    mpesaReceiptNumber: string;
    mpesaTransactionId: string;
    cashReceivedBy: string;
    notes: string;
}

export interface RecordSummary {
    numberOfRecords: string;
    totalRevenue: string;
    totalDiscount: string;
    pending: string;
}

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


