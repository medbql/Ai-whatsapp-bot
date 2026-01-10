"use client"
import { Button } from '@/components/ui/button';
import { ChangeEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { api } from "@/axios/config";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { userData } from '@/src/authContext';



interface propsForm {
  isOpen: boolean,
  isClose: () => void,
}

interface form {
  botName: string,
  botModel: string,
  number_id: number
}


const BotForm = ({ isOpen, isClose }: propsForm) => {
  const { whatsappNum } = userData();
  const [fields, setFiles] = useState<form>({
    botName: '',
    botModel: '',
    number_id: 0
  })
  console.log(fields)

  const handelChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value)
    setFiles((prev) => ({ ...prev, [name]: value }))

  }
  const addBoot = async () => {
    try {
      await api.post('/boots', { ...fields }).then(
        ({ status }) => status === 201 && isClose()
      )
    } catch (error) {

    }
  }


  return isOpen ? <>
    {createPortal(
      <div className='fixed  z-10 top-0 bottom-0 right-0 left-0 bg-white/20 backdrop-brightness-50'>
        <div className=' w-full h-full flex flex-col items-center '>
          <Card className='w-1/2 h-3/7 bg-white/90 mx-auto  my-auto border border-emerald-300/50 rounded-2xl shadow-lg '>
            <CardHeader>
              <CardTitle className='underline text-xl text-emerald-500 font-semibold'>Craete Your ChatBot:</CardTitle>
              <CardAction>
                <Button onClick={isClose} className='bg-emerald-600'> <X className='' /> </Button>
              </CardAction>
            </CardHeader>
            <CardContent className='px-8 w-full ' >
              <label className='text-gray-600 pl-1' >chatbot name:</label>
              <Input value={fields.botName} onChange={handelChange} className='my-2 focus-visible:ring-emerald-500  ' type='text' name='botName' placeholder='Enter your chatbot name...' />

              <label className='text-gray-600 pl-1' > model:</label>
              <Input value={fields.botModel} onChange={handelChange} className='my-2 focus-visible:ring-emerald-500' type='text' name='botModel' placeholder='Enter your chatbot model...' />

              <label className='text-gray-600 pl-1' > number:</label>
              <NativeSelect className="w-200 my-2 " onChange={handelChange} name="number_id">

                {
                  whatsappNum.map((num, idx) => (
                    <NativeSelectOption key={idx} value={num.id} >{num.number}</NativeSelectOption>
                  ))
                }
              </NativeSelect>
            </CardContent>
            <CardFooter className='flex justify-end'>
              <Button onClick={addBoot} className='bg-emerald-600'>create chatBot</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      , document.body)}
  </> : null


}

type formFields = {
  model: string,
  name: string,
  number: string
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [boots, setBoots] = useState<formFields[]>([])
  useEffect(() => {

    (async () => {
      await api.get('/boots/1').then(
        ({ status, data }) => {
          status === 201 && setBoots(data.data)
        }
      )
    })()
  }, [])

  const startBoot = async (sessionId: string): Promise<void> => {
    try {
      await api.post('/whatsapp', { sessionId: sessionId }).then(
        ({ status, data }) => {
          status === 201 ? console.log("work") : console.log(data)
        }
      )
    } catch (error) {

    }
  }

  return (
    <div className=" bg-white/10 w-full h-[80%] mx-auto  mt-20 p-15 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20  md:p-8">
      <div className="w-full flex justify-between items-center ">
        <span>
          <h1 className="underline text-2xl mb-3 text-white">ChatBots:</h1>
          <p className="text-white">Manage your Ai-powered Whatsapp chatBots.</p>
        </span>
        <Button onClick={() => setIsOpen(true)} className="bg-emerald-600">
          add a chatbot
        </Button>
        <BotForm isOpen={isOpen} isClose={() => setIsOpen(false)} />
      </div>

      <div className="w-full h-[1px] mb-5 bg-white/20 backdrop-blur-lg mt-4 " ></div>
      <div className="w-full pt-5 flex flex-wrap gap-4 ">
        {boots.map((boot, idx) => (
          <div key={idx} className="w-1/3 p-3 flex flex-col  h-25 content-center bg-white/80 backdrop-brightness-50 border border-emerald-400 rounded-xl shadow-lg">
            <div className=" flex justify-between">
              <p className="ml-3 text-emerald-500 font-medium">{boot.name}</p>
              <p className={`ml-3 mb-3  font-medium`}>{boot.model}</p>
            </div>
            <Button onClick={() => startBoot(boot.number)} className="bg-emerald-600" >On</Button>
          </div>
        ))}
      </div>
    </div >
  );


}
export default ChatBot;
