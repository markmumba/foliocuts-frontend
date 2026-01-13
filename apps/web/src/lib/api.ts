/**
 * Web API Client Setup
 * Initializes the shared API client with web-specific adapters (localStorage, window.location)
 */
import {
    createApiClient,
    createAuthService,
    createAnalyticsService,
    createCustomerService,
    createRecordService,
    createServicesService,
    createUserService,
    createTenantService,
    createSubscriptionService,
    createPaymentService,
    localStorageAdapter,
    windowNavigationAdapter,
} from "@digital-barbershop/shared-api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api/v1';

// Create the API client with web-specific adapters
const apiClient = createApiClient({
    baseURL: API_BASE_URL,
    storage: localStorageAdapter,
    navigation: windowNavigationAdapter,
});

// Export the raw axios instance for any direct usage
export const api = apiClient.instance;

// Create and export all service instances
export const authService = createAuthService(apiClient);
export const analyticsService = createAnalyticsService(apiClient);
export const customerService = createCustomerService(apiClient);
export const recordService = createRecordService(apiClient);
export const servicesService = createServicesService(apiClient);
export const userService = createUserService(apiClient);
export const tenantService = createTenantService(apiClient);
export const subscriptionService = createSubscriptionService(apiClient);
export const paymentService = createPaymentService(apiClient);

