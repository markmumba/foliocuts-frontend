import { createContext, useState, useEffect, useCallback, useContext, type ReactNode } from "react";
import type { User } from "@digital-barbershop/shared-types";
import { authService } from "@/lib/api";

export type { User };

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (accessToken: string, refreshToken: string, user: User) => void;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearStoredAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

const getStoredAuth = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');

    let user: User | null = null;
    if (userStr) {
        try {
            const parsed = JSON.parse(userStr);
            user = {
                id: parsed.id,
                email: parsed.email,
                fullName: parsed.fullName,
                phone: parsed.phone,
                role: parsed.role,
                status: parsed.status,
                tenantId: parsed.tenantId,
                createdAt: parsed.createdAt,
            };
        } catch (error) {
            console.error('Failed to parse stored user:', error);
            clearStoredAuth();
        }
    }

    return { accessToken, refreshToken, user };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const stored = getStoredAuth();
        if (stored.accessToken && stored.user) {
            setAccessToken(stored.accessToken);
            setRefreshToken(stored.refreshToken);
            setUser(stored.user);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback((newAccessToken: string, newRefreshToken: string, newUser: User) => {
        console.log('Login called with user:', newUser);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        const userJson = JSON.stringify(newUser);
        console.log('Storing user to localStorage:', userJson);
        localStorage.setItem('user', userJson);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(newUser);
        setError(null);
    }, []);

    const logout = useCallback(() => {
        clearStoredAuth();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setError(null);
    }, []);

    const refreshAccessToken = useCallback(async () => {
        const stored = getStoredAuth();
        if (!stored.refreshToken) {
            logout();
            throw new Error('No refresh token available');
        }

        try {
            const response = await authService.refreshToken({
                refreshToken: stored.refreshToken
            });

            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            // Update tokens in storage and state
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            return newAccessToken;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            logout();
            throw error;
        }
    }, [logout]);

    const updateUser = useCallback((updatedUser: User) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    }, []);

    const value: AuthContextType = {
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        error,
        login,
        logout,
        refreshAccessToken: async () => {
            await refreshAccessToken();
        },
        updateUser,
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
