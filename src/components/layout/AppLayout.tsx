import { SidebarProvider } from "../ui/sidebar";
// import { AppHeader } from "./Header";
import { AppSidebar } from "./SideBar";     
import { SidebarInset } from "../ui/sidebar";   

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="!m-0 !p-0 md:!m-0 md:!ml-0 md:!p-0">
                {/* <AppHeader /> */}
                <main className="w-full">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
} 

