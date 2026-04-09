"use client"
import { api } from "@/src/axios/config";
import { useRouter } from "next/navigation";
import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer, useState } from "react";


type Action = { type : 'isAuthenticed' , auth: boolean } | {type:'logout'};

/**
 * Reducer function to handle auth state changes.
 *
 * @param state Current auth state.
 * @param action Action to update auth state or logout.
 * @returns {boolean} Updated auth state.
 */
const reducer = (state : boolean , action  :Action) : boolean => {
    switch (action.type) {
      case 'isAuthenticed':
              return action.auth
        break;
      case 'logout':
            return false;
        break;

      default:
        return state;
    }
}

interface ReducerType{
    auth : boolean,
    dispatch : Dispatch<Action>,
}

const authStateContext = createContext<ReducerType>({
  auth: false ,
  dispatch: () => {}
});


/**
 * Initializes auth state from localStorage
 * @returns {boolean} auth state value
 */
const initialAuth = () : boolean=>{
  //avoid accessing localStorage during server rendering
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('auth')  === 'true';   
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, dispatch] = useReducer(reducer, false, initialAuth);
  const router = useRouter();

  /**
   * Store the auth state in the localStorage
   */
  useEffect(()=>{
     localStorage.setItem('auth',  String(auth));
  },[auth]);

  /**
   * Logout Effect:
   * when the auth state becom false 
   */
  useEffect(()=>{
       if (!auth) {
            (async ()=>{
              try{
                await  api.post('/auth/logout');//call logout endpoint
              }catch(err){//ignore logout api err 
              }finally{
                localStorage.removeItem('Token');//clear the token 
                localStorage.removeItem('userId');
                router.replace('/auth');//redirect to  auth page
              }
            })();
      }
  },[auth, router]);

type QueueItem ={
      resolve : (token : string) => void,
      reject : (err : unknown) => void 
}

  //store request when token is refreshing
let waitingReq : QueueItem[] = [];

const proccessQueue = (token : string | null , err: unknown | null) => {
      waitingReq.forEach(({resolve, reject})=>{
          if (err) {reject(err)}
          else if (token) { resolve(token) }
      }); 
      waitingReq = [];
} 

let isRefreshing : boolean = false; 
  
 api.interceptors.response.use(function onFulfilled(response) {
            //get the new accessToken after expired 
            const newToken  = response.headers['x-new-access-token'];
            //store it in localstorage
            if (newToken)  localStorage.setItem('Token', newToken);      
            return response;  
  
  }, async function onRejected(error) {//catch failed request
            const status : number = error?.status;
            const originalRequest = error?.config; //take the original request 

            if (status !== 401 || !originalRequest) {//catch when the status response 401 === Unauthorized
                return   Promise.reject(error)
            }

          // prevent infinite loop
          if (originalRequest._retry) {
                dispatch({ type: "logout" });
                return Promise.reject(error);
          }

            const message  = error?.response?.data?.message ;
    
            if (message !== 'EXPIRED') {        
                dispatch({type:'logout' });
                return Promise.reject(error);
            }
            
           // If refresh already in progress 
           if (isRefreshing) {
                return new Promise((resolve, reject)=>{ //waiting the token to be refreshed
                    waitingReq.push({
                            resolve: (token: string) =>{
                                  originalRequest.headers['Authorization'] = 'Bearer  ' + token;  
                                  resolve(api(originalRequest))
                            },
                            reject
                    });
                  })
           }

          originalRequest._retry = true; 
          isRefreshing = true;
          
          return new Promise<string> ( async (resolve, reject)=>{
               await  api.post('/auth/refresh')
                   .then( async ({status, data})=>{//send request to refresh token
                             if (status === 200) {
                                    const newToken : string = data?.accessToken;
                                    if (newToken) resolve(newToken);
                             }
                    }).catch((err) =>{
                         reject(err)
                    })
          }).then( async  (newToken : string)=>{
                localStorage.setItem('Token', newToken);//update the token in the localStorage               
                 api.defaults.headers.common['Authorization'] = 'Bearer  ' + newToken;//update tokrn for futue request

                proccessQueue(newToken, null);

                originalRequest.headers['Authorization'] = 'Bearer  ' + newToken;  //update the token for the original request
                return await api(originalRequest);
          }).catch((err)=>{
                 proccessQueue(null, err);
                  dispatch({type:'logout'})
                  return Promise.reject(err);
          }).finally(()=>{
                isRefreshing = false;
          })
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


/**
 * useAuth()
 * ----------
 * Acess auth state anywhere under <AuthProvider>
*/
export const useAuth = () => useContext(authStateContext);
