"use client";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { api } from "@/axios/config";
import { Camera, Circle, LoaderCircle, MonitorSmartphone, Plus, PlusIcon, QrCode, Settings, Smartphone, Verified, X } from "lucide-react";
import { createPortal } from "react-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { userData } from "@/src/authContext";



interface linkedSessionProps {
  startSession: boolean,
  isClose: () => void,
  sessionId: string
}


//-----------------LinkedSession component---------------------------------------//
//-------------------------------------------------------------------------------//

const LinkedSession = ({ startSession, isClose, sessionId }: linkedSessionProps) => {
  const [qr, setQr] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    // Get the qr code for scan 
    const getQrCode = async () => {
      try {
        setIsloading(true);
        
        //connect to webSocket server
        const ws = new WebSocket('ws://localhost:8080');

        //open connection
        ws.onopen = () => {

          const clientId = JSON.stringify({sessionId:sessionId})   
          
          //send client id
          ws.send(clientId);
        }

        //recive messge from the server
        ws.onmessage = (event) => {

          interface LinkedStatus {
            status : string,
            qr?: string
          }  

          //get the data from the server
          const data : LinkedStatus = JSON.parse(event.data);

          //check the status of linked device after scannig
          if (data.status === 'open') {
            setConnected(true);
            setQr(null);

            //close connection of the channel with server
            ws?.close();
            
            //close the portal after connecting  
            setTimeout(() => (setConnected(false), isClose()), 1000)
          }else if (data.status === 'notStarted') {
            console.log(data)  
            setQr(data.qr || null)
          }
        };

        //send request to get the qr code 
        await api.get(`/whatsapp/${sessionId}`).then(
          ({ status, data }) => {
            //check the status of response 
            status === 201 ? setQr(data.QrCode)
              : status === 200 && isClose()
          }
        )

      } catch (error) {
        console.error('Error :', error);
        throw error;
      } finally {
        setIsloading(false)
      }
    
    };

    //if startSession true call the getQrCode func
    startSession && getQrCode();
    !startSession && setQr(null);//return the qr code empty

  }, [startSession])

  return startSession && createPortal(
    <div className="fixed z-10 top-0 bottom-0 left-0 right-0 bg-white/10 w-3/4 h-[80%] mx-auto mt-20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
      <div className="w-full mb-10  pt-3 pr-5 flex justify-end">
        <Button onClick={isClose} className="bg-emerald-700">
          <X />
        </Button>
      </div>
      <div className="w-full h-5/6 flex justify-between items-center  p-15 pt-0 ">
        <div className="h-full w-1/2 pt-0 pl-10 ">

          <h1 className="text-3xl font-medium mb-2 text-emerald-500 underline">Connection proccess:</h1>
          <p className="text-gray-300 mb-10">Follow the step-by-step timeline to connect your Whatsapp account. </p>

          <span className="flex items-center ">
            <div className="w-12 h-12 flex justify-center items-center border border-gray-300 rounded-full bg-gray-300/70"><Smartphone className="size-6" /> </div>
            <p className="ml-3 text-white " >Open your Whatsapp.</p>
          </span>
          <div className=" w-12 h-7 flex justify-center" >
            <div className="w-1 h-full bg-emerald-600 shadow-lg" ></div>
          </div>

          <span className="flex items-center ">
            <div className="w-12 h-12 flex justify-center items-center border border-gray-300 rounded-full bg-gray-300/70"><Settings className="size-6" /> </div>
            <p className="ml-3 text-white " >Go to settings.</p>
          </span>
          <div className=" w-12 h-7 flex justify-center" >
            <div className="w-1 h-full bg-emerald-600 shadow-lg" ></div>
          </div>

          <span className="flex items-center ">
            <div className="w-12 h-12 flex justify-center items-center border border-gray-300 rounded-full bg-gray-300/70"><MonitorSmartphone className="size-6" /> </div>
            <p className="ml-3 text-white " >Linkend devices.</p>
          </span>
          <div className=" w-12 h-7 flex justify-center" >
            <div className="w-1 h-full bg-emerald-600 shadow-lg" ></div>
          </div>

          <span className="flex items-center ">
            <div className="w-12 h-12 flex justify-center items-center border border-gray-300 rounded-full bg-gray-300/70"><QrCode className="size-6" /> </div>
            <p className="ml-3 text-white " >Linkend a Device</p>
          </span>
          <div className=" w-12 h-7 flex justify-center" >
            <div className="w-1 h-full bg-emerald-600 shadow-lg" ></div>
          </div>

          <span className="flex items-center ">
            <div className="w-12 h-12 flex justify-center items-center border border-gray-300 rounded-full bg-gray-300/70"><Camera className="size-6" /> </div>
            <p className="ml-3 text-white " >Scan your QRcode</p>
          </span>
          <div className=" w-12 h-7 flex justify-center" >
            <div className="w-1 h-full bg-emerald-600 shadow-lg" ></div>
          </div>

          <span className="flex items-center ">
            <div className="w-12 h-12 flex justify-center items-center border border-gray-300 rounded-full bg-gray-300/70"><Verified className="size-6" /> </div>
            <p className="ml-3 text-white " >Confirme connection</p>
          </span>

        </div>
        <div className="bg-white/10 w-0.5 h-full"></div>
        <div >
          {(qr !== null && !isLoading && !connected) ? (<>
            <div className={` ${!startSession && 'bg-transparent'}  h-[250px] w-[250px] border rounded-xl overflow-hidden mb-3 mr-25`}>
              {startSession && <QRCode size={248} value={qr || ''} />}
            </div>
            <Button className="h-11 ml-15  bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl" >Refresh the QRcode</Button>
          </>
          ) : isLoading && <LoaderCircle className="size-16 text-white animate-spin" />}
          {connected && (
            <div className="h-[250px] w-[250px] mr-25 flex flex-col justify-center items-center">
              <Verified className="text-white size-16" />
              <p className="text-white font-medium">Connected Successfly.</p>
            </div>
          )}

        </div>
      </div>
    </div>, document.body)

}



//-----------------add Number component-------------------------------------------//
//-------------------------------------------------------------------------------//


interface propsForm {
  isOpen: boolean,
  isClose: () => void,
}


const NumberForm = ({ isOpen, isClose }: propsForm) => {
  const [WhatsappNum, setWhatsappNum] = useState<string>('');
  const [isLoading, setIsloading] = useState<boolean>(false);

  const saveNumber = async (): Promise<void> => {
    try {
      setIsloading(true)
      WhatsappNum.length === 14 && await api.post('/numbers', { number: WhatsappNum, user_id: 1 }).then(
        ({ status }) => {
          status === 201 && isClose()
        }
      )
    } catch (error) {

    }
  }


  return isOpen ? <>
    {createPortal(
      <div className='fixed  z-10 top-0 bottom-0 right-0 left-0 bg-white/20 backdrop-brightness-50'>
        <div className=' w-full h-full flex flex-col items-center '>
          <Card className='w-1/2 h-1/3 bg-white/90 mx-auto  my-auto border border-emerald-300/50 rounded-2xl shadow-lg '>
            <CardHeader>
              <CardTitle className='underline text-xl text-emerald-500 font-semibold'>Add a new number:</CardTitle>
              <CardAction>
                <Button onClick={isClose} className='bg-emerald-600'> <X className='' /> </Button>
              </CardAction>
            </CardHeader>
            <CardContent className='px-8' >
              <label className='text-gray-600 pl-1' >Number:</label>
              <Input className='my-2 focus-visible:ring-emerald-500' value={WhatsappNum} onChange={(e) => setWhatsappNum(e.target.value)} type='tel' name='phoneNumber' placeholder='+212 6111111111' />

            </CardContent>
            <CardFooter className='flex justify-end'>
              <Button onClick={saveNumber} className='bg-emerald-600'>create chatBot</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      , document.body)}
  </> : null


}

//-----------------Profiles component---------------------------------------------//
//-------------------------------------------------------------------------------//


export default function Home() {
  const [startSession, setStartSession] = useState<string | boolean | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { whatsappNum } = userData();





  return (
    <div className=" bg-white/10 w-full h-[80%] mx-auto  mt-20 p-15 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20  md:p-8">
      <div className="w-full flex justify-between items-center ">
        <span>
          <h1 className="underline text-2xl mb-3 text-white">Whatsapp Profiles:</h1>
          <p className="text-white">Connect and manage your Whatsapp Business accounts.</p>
        </span>

      </div>

      <div className="w-full h-[1px] bg-white/20 backdrop-blur-lg my-4 " ></div>
      <div className="w-full pt-5 flex flex-wrap gap-4 ">
        {
          whatsappNum.map((session, idx) => (
            <div key={idx} className="w-1/3 p-3 flex flex-col  h-25 content-center bg-white/80 backdrop-brightness-50 border border-emerald-400 rounded-xl shadow-lg">
              <div className=" flex justify-between">

                <p className="ml-3 text-emerald-500 font-medium">{session.number}</p>
                <p className={`ml-3 mb-3 ${session.linked ? 'text-emerald-500' : 'text-red-500'}  font-medium`}>{session.linked ? 'Online' : 'Offline'}</p>
              </div>
              <Button onClick={() => { setStartSession(session.number.trimEnd()) }} className="bg-emerald-600" >Connected</Button>
              <LinkedSession startSession={startSession === session.number.trimEnd()} isClose={() => setStartSession(false)} sessionId={session.number.trimEnd()} />
            </div>
          ))
        }
        <div className="w-1/3 p-3 flex items-center h-25 content-center bg-white/80 backdrop-brightness-50 border border-emerald-400 rounded-xl shadow-lg">
          <div onClick={() => setIsOpen(true)} className="w-15 ml-4 p-2 bg-white/10 backdrop-blur-lg h-15 border border-emerald-400 rounded-full">
            <PlusIcon className="size-10 text-emerald-500 font-medium" />
          </div>
          <p className="ml-3 text-emerald-500 font-medium">Add a profile...</p>
        </div>
        <NumberForm isOpen={isOpen} isClose={() => setIsOpen(false)} />
      </div>
    </div >
  );
}
