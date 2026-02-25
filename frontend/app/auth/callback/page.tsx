'use client'
import { api } from "@/axios/config";
import { userData } from "@/src/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallBack() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {isAuthenticetd} = userData()

    useEffect(()=>{
        const code = searchParams.get('code');
        const error = searchParams.get('error');
      

        if (error || !code) {
            router.replace('/auth');
        }
      
         api.post('/auth/exchange-token',{code}).then(
                (res)=>{  
                      localStorage.setItem('Token', res.data.accessToken);      
                      isAuthenticetd('true')
                      router.replace('/dashboard')                  
                }
            ).catch(err=>{
                   isAuthenticetd('false')
                   router.replace('/auth');
            })
        
        
    },[router, searchParams])

    return(
        <>
        <h2>sing in...</h2>
        </>
    )
}
