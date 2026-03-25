'use client'
import { api } from "@/src/axios/config";
import { UserData } from "@/src/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallBackClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {isAuthenticetd} = UserData()

    useEffect(()=>{
        const code = searchParams.get('code');
        const error = searchParams.get('error');
      
        console.log(code)
        if (error || !code) {
            router.replace('/auth');
        }
      
         api.post('/auth/exchange-token',{code}).then(
                (res)=>{  
                      localStorage.setItem('Token', res.data.accessToken);      
                      setTimeout(()=>{
 isAuthenticetd('true')
                      router.replace('/dashboard')        
                      },5000)
                               
                }
            ).catch(()=>{
                   isAuthenticetd('false')
                   router.replace('/auth');
            })
        
        
    },[router, searchParams]);

    return (
        <>
          <h1>Sing in</h1>
        </>
    )    
}
