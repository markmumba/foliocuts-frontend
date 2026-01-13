import { ShieldX, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

interface AccessDeniedProps {
    requiredRoles?: string[];
    currentRole?: string;
}

export function AccessDenied({ requiredRoles, currentRole }: AccessDeniedProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-8">
            <Empty className="max-w-md">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <ShieldX className="w-6 h-6" />
                    </EmptyMedia>
                    <EmptyTitle>Access Denied</EmptyTitle>
                    <EmptyDescription>
                        {requiredRoles
                            ? `You don't have permission to access this page. This page requires one of the following roles: ${requiredRoles.join(", ")}.`
                            : "You don't have permission to access this page."}
                        {currentRole && (
                            <span className="block mt-2">Your current role: <strong>{currentRole}</strong></span>
                        )}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={() => navigate("/")} className="gap-2">
                        <Home className="w-4 h-4" />
                        Go to Dashboard
                    </Button>
                </EmptyContent>
            </Empty>
        </div>
    );
}

