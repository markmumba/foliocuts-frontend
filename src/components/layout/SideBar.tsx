import {
    LayoutDashboard,
    Users,
    Scissors,
    UserCircle,
    CreditCard,
    BarChart3,
    Settings,
    LogOut,
    List,
    Building2,
    Store,
    Moon,
    Sun,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useTenantContext } from "@/context/TenantContext";
import { formatRole } from "@/utils/utilities";
import { Role } from "@/types/enums";
import { useTheme } from "next-themes";

type MenuItem = {
    title: string;
    icon: typeof LayoutDashboard;
    url: string;
    roles?: Role[];
};

const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/",
        roles: [Role.OWNER, Role.ADMIN, Role.RECEPTIONIST, Role.BARBER, Role.SERVICE_GIRL],
    },
    {
        title: "My Shop",
        icon: Store,
        url: "/dashboard/my-shop",
        roles: [Role.OWNER],
    },
    {
        title: "Tenants",
        icon: Building2,
        url: "/dashboard/tenants",
        roles: [Role.ADMIN],
    },
    {
        title: "Staff",
        icon: Users,
        url: "/dashboard/staff",
        roles: [Role.OWNER, Role.RECEPTIONIST],
    },
    {
        title: "Service Types",
        icon: List,
        url: "/dashboard/service-types",
        roles: [Role.ADMIN, Role.OWNER, Role.RECEPTIONIST],
    },
    {
        title: "Services",
        icon: Scissors,
        url: "/dashboard/services",
        roles: [Role.OWNER, Role.RECEPTIONIST],
    },
    {
        title: "Customers",
        icon: UserCircle,
        url: "/dashboard/customers",
        roles: [Role.OWNER, Role.RECEPTIONIST],
    },
    {
        title: "Records",
        icon: CreditCard,
        url: "/dashboard/records",
        roles: [Role.OWNER],
    },
    {
        title: "Subscription Templates",
        icon: CreditCard,
        url: "/dashboard/subscription-templates",
        roles: [Role.ADMIN],
    },
    {
        title: "Reports",
        icon: BarChart3,
        url: "/reports",
        roles: [Role.OWNER, Role.ADMIN],
    },
    {
        title: "Settings",
        icon: Settings,
        url: "/dashboard/settings",
        roles: [Role.OWNER, Role.ADMIN],
    },
];

export function AppSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const { tenant } = useTenantContext();
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const filteredMenuItems = useMemo(() => {
        if (!user) return [];
        return menuItems.filter((item) => !item.roles || item.roles.includes(user.role as Role));
    }, [user]);

    // Get tenant display name and subtitle
    const tenantName = tenant?.businessName || 'FolioCuts';
    const tenantSubtitle = tenant?.subdomain
        ? `@${tenant.subdomain}`
        : tenant?.phoneNumber || 'Barbershop Platform';

    return (
        <Sidebar variant="sidebar">
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center border border-secondary/20">
                        <span className="text-primary font-bold text-xl">💈</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-bold text-lg text-sidebar-foreground truncate" title={tenantName}>
                            {tenantName}
                        </span>
                        <span className="text-xs text-sidebar-foreground/70 truncate" title={tenantSubtitle}>
                            {tenantSubtitle}
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredMenuItems.map((item) => {
                                const isActive =
                                    location.pathname === item.url ||
                                    location.pathname.startsWith(item.url + "/");

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:hover:bg-primary/90"
                                        >
                                            <a
                                                href={item.url}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(item.url);
                                                }}
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border">
                {user && (
                    <div className="px-2 py-3 mb-2">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent/50">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <span className="text-primary font-semibold text-sm">
                                    {user.fullName?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase() ?? "U"}
                                </span>
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-medium text-sidebar-foreground truncate">
                                    {user.fullName ?? "User"}
                                </span>
                                <span className="text-xs text-sidebar-foreground/70 truncate">
                                    {formatRole(user.role)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Toggle theme"
                        >
                            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span>Toggle theme</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Logout"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <button onClick={handleLogout}>
                                <LogOut />
                                <span>Logout</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

