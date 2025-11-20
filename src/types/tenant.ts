

export interface TenantList{
    items:TenantForList[];
    metadata:Metadata;
}
export interface Metadata{
    currentPage:number;
    totalPages:number;
    totalItems:number;
    limit:number;
}

export interface TenantForList {
    tenantId:string;
    businessName:string;
    subdomain:string;
    phoneNumber:string;
    email:string;
    mpesaTillNo:string;
    mpesaBusinessShortCode:string;
    status:string;
    subscriptionPlan:string;
    numberOfUsers:string;
    numberOfServices:string;
    numberOfBarberServices:string;
    numberOfServiceGirlServices:string;
    createdAt:string;
    updatedAt:string;
}


export interface TenantUsers {
    userId:string;
    email:string;
    phoneNumber:string;
    role:string;
}

export interface TenantServices {
    serviceId:string;
    serviceName:string;
    servicePrice:string;
    serviceType:string;
}

export interface Tenant {
    tenantId:string;
    businessName:string;
    subdomain:string;
    phoneNumber:string;
    email:string;
    mpesaTillNo:string;
    mpesaBusinessShortCode:string;
    status:string;
    subscriptionPlan:string;
    numberOfUsers:string;
    numberOfServices:string;
    numberOfBarberServices:string;
    numberOfServiceGirlServices:string;
    users:TenantUsers[];
    services:TenantServices[];
    createdAt:string;
    updatedAt:string;
}

