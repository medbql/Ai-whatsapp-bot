'use client'
import { AppSidebar } from "@/src/app-sideBar";
import { useAuth } from "@/src/authContext";
import { SidebarProvider,SidebarTrigger } from "@/src/components/ui/sidebar";
import { useRouter } from "next/navigation";

import { ReactNode, useEffect } from "react";



export default function DashboardLayout({ children} : { children : ReactNode}) {
  const  {auth,dispatch} = useAuth();
  const router = useRouter();
  
  console.log(auth)
  useEffect(()=>{
    console.log(auth)
    if (!auth) {
      dispatch({type:'logout'})
      router.replace('/auth')
    }
  },[auth])
  
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