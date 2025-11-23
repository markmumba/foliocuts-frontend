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
}

export interface ServiceItem {
    id: number;
    serviceName: string;
    staffName: string;
    price: number;
    isFree: boolean;
    freeReason: string;
}

export interface RecordList {
    id: number;
    recordCode: string;
    customerPhoneNumber: string;
    customerName: string;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: string;
}



export interface CreateRecordRequest {
    customerPhoneNumber: string;
    serviceItems: ServiceItemRequest[];
}

export interface ServiceItemRequest {
    serviceId: string;
    staffId: string;
}