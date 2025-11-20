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
import { formatRole } from "@/utils/utilities";
import { Role } from "@/types/enums";

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
        roles: [Role.OWNER, Role.RECEPTIONIST],
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
        url: "/customers",
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
    console.log(user);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const filteredMenuItems = useMemo(() => {
        if (!user) return [];
        return menuItems.filter((item) => !item.roles || item.roles.includes(user.role as Role));
    }, [user]);

    return (
        <Sidebar variant="sidebar">
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center border border-secondary/20">
                        <span className="text-primary font-bold text-xl">💈</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-sidebar-foreground">FolioCuts</span>
                        <span className="text-xs text-sidebar-foreground/70">Barbershop Platform</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <a href={item.url} onClick={(e) => {
                                            e.preventDefault();
                                            navigate(item.url);
                                        }}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
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

