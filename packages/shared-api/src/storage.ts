/**
 * Storage interface for token management
 * Allows different implementations for web (localStorage) and mobile (AsyncStorage)
 */
export interface StorageAdapter {
    getItem(key: string): Promise<string | null> | string | null;
    setItem(key: string, value: string): Promise<void> | void;
    removeItem(key: string): Promise<void> | void;
}

/**
 * Default web storage adapter using localStorage
 */
export const localStorageAdapter: StorageAdapter = {
    getItem: (key: string) => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(key);
        }
        return null;
    },
    setItem: (key: string, value: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, value);
        }
    },
    removeItem: (key: string) => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(key);
        }
    },
};

/**
 * Navigation adapter for redirects
 * Allows different implementations for web (window.location) and mobile (navigation)
 */
export interface NavigationAdapter {
    navigate(path: string): void;
}

/**
 * Default web navigation adapter
 */
export const windowNavigationAdapter: NavigationAdapter = {
    navigate: (path: string) => {
        if (typeof window !== "undefined") {
            window.location.href = path;
        }
    },
};

/**
 * Factory for creating AsyncStorage adapter (React Native)
 * Usage: createAsyncStorageAdapter(AsyncStorage)
 */
export function createAsyncStorageAdapter(asyncStorage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}): StorageAdapter {
    return {
        getItem: (key: string) => asyncStorage.getItem(key),
        setItem: (key: string, value: string) => asyncStorage.setItem(key, value),
        removeItem: (key: string) => asyncStorage.removeItem(key),
    };
}

/**
 * Factory for creating Expo Router navigation adapter
 * Usage: createExpoNavigationAdapter(router)
 */
export function createExpoNavigationAdapter(router: {
    replace(path: string): void;
}): NavigationAdapter {
    return {
        navigate: (path: string) => router.replace(path),
    };
}
