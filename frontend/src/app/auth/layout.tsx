'use client'

import { AuthProvider } from "@/src/authContext";
import { ReactNode } from "react";

export default function AuthLayout({children} : {children: ReactNode}){
    return (
        <div>
           <AuthProvider>{children}</AuthProvider> 
        </div>
    );
}  