"use client"
import { api } from "@/src/axios/config";
import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer } from "react";


type Action = { type : 'isAuthenticed' ,auth : boolean} | {type:'logout'};


const reducer = (state : boolean , action  :Action) : boolean => {
    switch (action.type) {
      case 'isAuthenticed':
              localStorage.setItem('auth',  String(action.auth));
              console.log('action', action.auth)
              return action.auth;
        break;
      case 'logout':
            localStorage.removeItem('Token');
            localStorage.setItem('auth',  String(false))
            return false;
        break;

      default:
        return state;
    }
}

interface StatesType{
    auth : boolean,
    dispatch : Dispatch<Action>
}

const authStateContext = createContext<StatesType>({
  auth: false,
  dispatch: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [auth, dispatch] = useReducer(reducer,false );

  useEffect(()=>{
     console.log('effect')
      dispatch({type:'isAuthenticed', auth: Boolean(localStorage.getItem('autth')) || false })
  },[])


 api.interceptors.response.use(function onFulfilled(response) {
  
    const newToken  = response.headers['x-new-access-token'];  
    if (newToken) {
      localStorage.setItem('Token', newToken);      
    }
     return response;
    
  }, async function onRejected(error) {
    if (error.status === 401) {
      //take the original request
      const originalRequest = error.config; 
      
      if (error.response.data.message === "EXPIRED") {
            return new Promise<string>(async (resolve,reject)=>{
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
                    reject('error')
                  }
            }).then(async (token : string)=>{
              //update the token in the localStorage 
              localStorage.setItem('Token', token);

              //update tokrn for futue request
              api.defaults.headers.common['Authorization'] = 'Bearer' + token;

              //update the token for the original request
             originalRequest.headers['Authorization'] = 'Bearer' + token;

              //resend request with the new token
              return await api(originalRequest)
            }).catch(() =>{
              dispatch({type:'logout' })
            })

      }else{
        dispatch({type:'logout' })
      }
    }else{
      return error
    }
});



  return (     
    <authStateContext.Provider value={{
      auth,
      dispatch
    }}>
      {children}
    </authStateContext.Provider>
  )
}

export const useAuth = () => useContext(authStateContext);
