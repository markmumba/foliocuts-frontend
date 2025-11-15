import {
    LayoutDashboard,
    Calendar,
    Users,
    Scissors,
    UserCircle,
    CreditCard,
    BarChart3,
    Settings,
    LogOut,
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
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/",
    },
    {
        title: "Appointments",
        icon: Calendar,
        url: "/appointments",
    },
    {
        title: "Staff",
        icon: Users,
        url: "/staff",
    },
    {
        title: "Services",
        icon: Scissors,
        url: "/services",
    },
    {
        title: "Customers",
        icon: UserCircle,
        url: "/customers",
    },
    {
        title: "Transactions",
        icon: CreditCard,
        url: "/transactions",
    },
    {
        title: "Reports",
        icon: BarChart3,
        url: "/reports",
    },
    {
        title: "Settings",
        icon: Settings,
        url: "/settings",
    },
];

export function AppSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

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
                            {menuItems.map((item) => (
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

