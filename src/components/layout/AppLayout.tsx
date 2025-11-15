import { SidebarProvider } from "../ui/sidebar";
import { AppHeader } from "./Header";
import { AppSidebar } from "./SideBar";     
import { SidebarInset } from "../ui/sidebar";   

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="p-4">
                <AppHeader />
                <main className="w-full ">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
} 

