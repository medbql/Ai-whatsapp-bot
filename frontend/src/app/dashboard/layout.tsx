'use client'
import { AppSidebar } from "@/src/app-sideBar";
import { AuthProvider, useAuth } from "@/src/authContext";
import { api } from "@/src/axios/config";
import { SidebarProvider,SidebarTrigger } from "@/src/components/ui/sidebar";
import { createContext, ReactNode, useEffect, useState } from "react";

export  interface WnumbersType {
    id: number,
    number: string,
    linked: boolean,
    user_id: number
}

type userType = {
  userId: number | null , 
  wNumbers : WnumbersType[],
}

export const userContext = createContext<userType>({
  userId: null,
  wNumbers : []
});



export default function DashboardLayout({ children} : { children : ReactNode}) {
  const [userId, setUserId] = useState<number| null>(()=>{
      if (typeof window === 'undefined' ) return null;
      const userId : number =  Number(localStorage.getItem('userId')); 
      return userId;
  });

  const [wNumbers, setWNumbers] = useState<WnumbersType[]>([]);

  useEffect(()=>{
    const getUserNumber = async  () : Promise<void> =>{
        try {
          await api.get(`/numbers/${userId}`).then(
            ({status, data}) => (status === 201 ) && setWNumbers(data.data) 
          )
        } catch (error) { };
    };
    if (userId) getUserNumber();
  },[userId]);


  
  return(
    <userContext.Provider value={{
      userId,
      wNumbers 
    }}>
        <div>
           <AuthProvider>
            <SidebarProvider>
             <AppSidebar />
                       <main className="min-h-screen w-full h-screen  p-4 md:p-8">
            <SidebarTrigger />        
              {children}
            </main>
            </SidebarProvider>
            </AuthProvider>
        </div>
        </userContext.Provider>
    )
}