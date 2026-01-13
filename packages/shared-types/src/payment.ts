export interface PaymentRequest {
    paymentMethod: "CASH" | "MPESA";
    amount: string;
    recordId: string;
    customerNumber: string;
    message: string;
}

export interface PaymentResponse {
    message: string;
}


