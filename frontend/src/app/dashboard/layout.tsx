'use client'
import { AppSidebar } from "@/src/app-sideBar";
import { UserData } from "@/src/authContext";
import { SidebarProvider,SidebarTrigger } from "@/src/components/ui/sidebar";
import { ReactNode, useEffect } from "react";



export default function DashboardLayout({ children} : { children : ReactNode}) {
  const {authenticated,logout} = UserData();   
  console.log(authenticated)
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