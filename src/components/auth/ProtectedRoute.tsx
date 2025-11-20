import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Loader2Icon } from "lucide-react";
import { AccessDenied } from "./AccessDenied";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    requireLayout?: boolean;
}

/**
 * ProtectedRoute component that:
 * 1. Checks if user is authenticated
 * 2. Optionally checks if user has required role(s)
 * 3. Optionally wraps content in AppLayout
 * 4. Redirects to login if not authenticated
 * 5. Shows access denied if role doesn't match
 */
export function ProtectedRoute({
    children,
    allowedRoles,
    requireLayout = true
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-foreground-muted">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user status is active (optional - you might want to allow PENDING users)
    if (user && user.status !== "ACTIVE") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-8">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-primary mb-2">Account Pending</h2>
                    <p className="text-foreground-muted mb-4">
                        Your account is {user.status.toLowerCase()}. Please wait for activation or contact support.
                    </p>
                </div>
            </div>
        );
    }

    // Check role-based access
    if (allowedRoles && user && user.role && !allowedRoles.includes(user.role)) {
        return <AccessDenied requiredRoles={allowedRoles} currentRole={user.role} />;
    }

    // Render children with or without layout
    if (requireLayout) {
        return <AppLayout>{children}</AppLayout>;
    }

    return <>{children}</>;
}

