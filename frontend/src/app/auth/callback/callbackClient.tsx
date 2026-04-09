'use client'
import { api } from "@/src/axios/config";
import { useAuth } from "@/src/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallBackClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {dispatch} = useAuth();

    useEffect(()=>{
        const code = searchParams.get('code');
        const error = searchParams.get('error');
      
        if (error || !code) {
            router.replace('/auth');
        }
      
         api.post('/auth/exchange-token',{code}).then(
                (res)=>{  
                    const accessToken : string = res?.data?.accessToken;
                    const userId : number  =  res?.data?.userId;
                    if (accessToken)  localStorage.setItem('Token',accessToken);
                    if (userId) localStorage.setItem('userId', String(userId));
                     dispatch({type:'isAuthenticed', auth: true})          
                     router.replace('/dashboard');                               
                }
            ).catch(()=>{
                  dispatch({type:'logout'})
            })
        
        
    },[router, searchParams]);

    return (
        <>
          <h1>Sing in</h1>
        </>
    )    
}
