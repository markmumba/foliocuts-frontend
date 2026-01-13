import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";
import type { StorageAdapter, NavigationAdapter } from "./storage";
import { localStorageAdapter, windowNavigationAdapter } from "./storage";

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export interface ApiClientConfig {
    baseURL: string;
    storage?: StorageAdapter;
    navigation?: NavigationAdapter;
}

export class ApiClient {
    private client: AxiosInstance;
    private storage: StorageAdapter;
    private navigation: NavigationAdapter;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: unknown) => void;
        reject: (reason?: unknown) => void;
    }> = [];

    constructor(config: ApiClientConfig) {
        this.storage = config.storage || localStorageAdapter;
        this.navigation = config.navigation || windowNavigationAdapter;

        this.client = axios.create({
            baseURL: config.baseURL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor: Add access token to headers
        this.client.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                const token = await this.getToken("accessToken");
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor: Handle 401 errors and refresh token
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            async (error: AxiosError) => {
                const originalRequest = error.config as RetryableRequestConfig | undefined;
                const status = error.response?.status;

                if (status === 401 && originalRequest && !originalRequest._retry) {
                    if (
                        originalRequest.url?.includes("/auth/login") ||
                        originalRequest.url?.includes("/auth/register")
                    ) {
                        return Promise.reject(error);
                    }

                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then(async (token) => {
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${token}`;
                                }
                                return this.client(originalRequest);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    const refreshToken = await this.getToken("refreshToken");

                    if (!refreshToken) {
                        await this.clearAuthStorage();
                        this.navigation.navigate("/login");
                        return Promise.reject(error);
                    }

                    try {
                        const response = await axios.post(
                            `${this.client.defaults.baseURL}/auth/refresh`,
                            { refreshToken },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        const {
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken,
                        } = response.data.data;

                        await this.setToken("accessToken", newAccessToken);
                        await this.setToken("refreshToken", newRefreshToken);

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        }

                        this.processQueue(null, newAccessToken);
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        this.processQueue(refreshError as Error, null);
                        await this.clearAuthStorage();
                        this.navigation.navigate("/login");
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private processQueue(error: Error | null, token: string | null = null) {
        this.failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    private async getToken(key: string): Promise<string | null> {
        const value = this.storage.getItem(key);
        return value instanceof Promise ? await value : value;
    }

    private async setToken(key: string, value: string): Promise<void> {
        const result = this.storage.setItem(key, value);
        if (result instanceof Promise) {
            await result;
        }
    }

    private async removeToken(key: string): Promise<void> {
        const result = this.storage.removeItem(key);
        if (result instanceof Promise) {
            await result;
        }
    }

    private async clearAuthStorage(): Promise<void> {
        await this.removeToken("accessToken");
        await this.removeToken("user");
        await this.removeToken("refreshToken");
    }

    get instance(): AxiosInstance {
        return this.client;
    }
}

export function createApiClient(config: ApiClientConfig): ApiClient {
    return new ApiClient(config);
}


