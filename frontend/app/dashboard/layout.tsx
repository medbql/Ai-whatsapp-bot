'use client'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/src/app-sideBar";
import { userData, UserStore } from "@/src/authContext";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function DashboardLayout({ children} : { children : ReactNode}) {
  const {authenticated,logout} = userData();   
  const router = useRouter();

  useEffect(()=>{
     if (authenticated === 'false' ) {
        logout()
    } 
  },[authenticated])
  
  return(
        <div>
            <SidebarProvider>
             <AppSidebar />
                       <main className="min-h-screen w-full h-screen  p-4 md:p-8">
            <SidebarTrigger />
        
              {children}
            </main>
            </SidebarProvider>
        </div>
    )
}