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
   isAuthenticetd: (auth : string) => void,
   logout: () => void
}
const UserContext = createContext<ContextType>({
  whatsappNum: [],
  setWhatsappNum: () => { },
  authenticated :  'false',
  isAuthenticetd: (auth : string) =>{}, 
  logout: ()=> { }, 
})

export const UserStore = ({ children }: { children: ReactNode }) => {
  const [whatsappNum, setWhatsappNum] = useState<WhatsAppNumber[]>([]);
  const [authenticated, _setAuthenticeted] = useState(localStorage.getItem('auth'));

  const router = useRouter();

  const logout = async ()=>{
      await api.post('/auth/logout').then(() =>{
          localStorage.removeItem('Token');
         isAuthenticetd('false')
          router.replace('/auth')
      })
  }

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
    const newToken  = response.headers['x-new-access-token'];
    
    if (newToken) {
      localStorage.setItem('Token', newToken);
      api.defaults.headers.common['Authorization'] =  'Bearer'+newToken;
    }

     return response;
    
  }, async function onRejected(error) {
    if (error.status === 401) {
      //take the original request
      const originalRequest = error.config; 
      
      if (error.response.data.message === "EXPIRED") {
            return new Promise(async (resolve,reject)=>{
                  //send request to refresh token
                  const {status, data} = await  api.post('/auth/refresh');

                  if (status === 200) {
                    //get token
                    const newToken = data.accessToken;
                      
                    if (newToken) {
                       //return the new tokrn
                        resolve(newToken)  
                    }                    
                  }else{
                    reject()
                  }

            }).then((token)=>{
              //update the token in the localStorage 
              localStorage.setItem('Token', token);

              //update tokrn for futue request
              api.defaults.headers.common['Authorization'] = 'Bearer' + token;

              //update the token for the original request
              originalRequest.headers.common['Authorization'] = 'Bearer' + token;

              //resend request with the new token
              return api(originalRequest)
            }).catch(()=>{
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
      isAuthenticetd,
      logout
   }

  

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const userData = () => useContext(UserContext);
