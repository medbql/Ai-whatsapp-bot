import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/src/app-sideBar";
import { UserStore } from "@/src/contextApi";
import { ReactNode } from "react";

export default function DashboardLayout({ children} : { children : ReactNode}) {
    return(
        <div>
            <SidebarProvider>
             <AppSidebar />
                       <main className="min-h-screen w-full h-screen  p-4 md:p-8">
            <SidebarTrigger />
        
              <UserStore>{children}</UserStore>
            </main>
            </SidebarProvider>
        </div>
    )
}