// API Client
export { ApiClient, createApiClient, type ApiClientConfig } from "./apiClient";
export {
    type StorageAdapter,
    type NavigationAdapter,
    localStorageAdapter,
    windowNavigationAdapter,
    createAsyncStorageAdapter,
    createExpoNavigationAdapter,
} from "./storage";

// Service factories
export { createAuthService } from "./services/authService";
export { createAnalyticsService } from "./services/analyticsService";
export { createCustomerService } from "./services/customerService";
export { createRecordService } from "./services/recordService";
export { createServicesService } from "./services/servicesService";
export { createUserService } from "./services/userService";
export { createTenantService } from "./services/tenantService";
export { createSubscriptionService } from "./services/subscriptionService";
export { createPaymentService } from "./services/paymentService";
