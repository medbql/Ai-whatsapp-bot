"use client"
import { api } from "@/axios/config";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface WhatsAppNumber {
  id: number,
  number: string;
  linked: boolean;
}



interface ContextType {
  whatsappNum: WhatsAppNumber[],
  setWhatsappNum: () => void,
  authenticated: string,
   isAuthenticetd: (auth : string) => void
}
const UserContext = createContext<ContextType>({
  whatsappNum: [],
  setWhatsappNum: () => { },
  authenticated :  'false',
  isAuthenticetd: (auth : string) =>{},  
})

export const UserStore = ({ children }: { children: ReactNode }) => {
  const [whatsappNum, setWhatsappNum] = useState<WhatsAppNumber[]>([]);
  const [authenticated, _setAuthenticeted] = useState(localStorage.getItem('auth'));


  useEffect(() => {
    (async () => {
      await api.get('/numbers/1').then(
        ({ status, data }) => {
          status === 201 && setWhatsappNum(data.data)
        }
      )
    })()
  }, [])


  const isAuthenticetd = (auth : string)=>{
    _setAuthenticeted(auth)
    localStorage.setItem('auth',auth)
  }

api.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.status === 401) {

      if (error.response.data.message === "EXPIRED") { 
            const response =   api.post('/auth/refresh');
            response.then(({status, data})=>{
              if (status === 200) {
                 localStorage.setItem('Token', data.accessToken )
                 isAuthenticetd('true')
              }
            }).catch((error)=>{
              isAuthenticetd('false')
            })
      }else{
      isAuthenticetd('false')
      }     
    }else{
      return error
    }
  });

  
      const value: ContextType = {
      whatsappNum,
      setWhatsappNum: () => { },
      authenticated,
      isAuthenticetd
    }

  

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const userData = () => useContext(UserContext);
