export interface CustomerList {
    id: number;
    customerCode: string;
    phoneNumber: string;
    totalVisits: string;
    totalSpent: string;
    createdAt: string;
    updatedAt: string;
}


export interface CustomerResponse {
    id: number;
    customerCode: string;
    phoneNumber: string;
    totalVisits: string;
    totalSpent: string;
    createdAt: string;
    updatedAt: string;
    records: CustomerRecord[];
    loyaltyTrackers: CustomerLoyaltyTracker[];
}


export interface CustomerRecord {
    id: number;
    recordCode: string;
    customerPhoneNumber: string;
    customerName: string;
    totalAmount: string;
    discountAmount: string;
    finalAmount: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}


export interface CustomerLoyaltyTracker {
    id: number;
    serviceName: string;
    visitsRequired: string;
    currentCount: string;
    totalEarned: string;
    createdAt: string;
    updatedAt: string;
}