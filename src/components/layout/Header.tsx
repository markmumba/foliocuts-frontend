import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";

export function AppHeader() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-16 items-center gap-4 w-full">
                <SidebarTrigger className="md:hidden" />

                <div className="flex flex-1 items-center gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
                            <Input
                                type="search"
                                placeholder="Search appointments, customers, staff..."
                                className="pl-9 h-9 bg-muted/50 border-border"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
                    </Button>

                    <div className="flex items-center gap-2 border-l border-border pl-2">
                        <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="hidden md:flex flex-col items-start">
                            <span className="text-sm font-medium text-foreground">
                                {user?.fullName || "User"}
                            </span>
                            <span className="text-xs text-foreground-muted">
                                {user?.role || "Role"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/settings")}
                                aria-label="Settings"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                aria-label="Logout"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
