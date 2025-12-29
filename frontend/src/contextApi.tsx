"use client"
import { api } from "@/axios/config";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface WhatsAppNumber {
  id: number,
  number: string;
  linked: boolean;
}

interface ContextType {
  whatsappNum: WhatsAppNumber[],
  setWhatsappNum: () => void
}
const UserContext = createContext<ContextType>({
  whatsappNum: [],
  setWhatsappNum: () => { }

})

export const UserStore = ({ children }: { children: ReactNode }) => {
  const [whatsappNum, setWhatsappNum] = useState<WhatsAppNumber[]>([]);
  useEffect(() => {
    (async () => {
      await api.get('/numbers/1').then(
        ({ status, data }) => {
          status === 201 && setWhatsappNum(data.data)
        }
      )
    })()
  }, [])


  const value: ContextType = {
    whatsappNum,
    setWhatsappNum: () => { }
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const userData = () => useContext(UserContext);
