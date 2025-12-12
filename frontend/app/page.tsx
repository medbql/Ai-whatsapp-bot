"use client";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { api } from "@/axios/config";
import { Camera, Circle, LoaderCircle, MonitorSmartphone, QrCode, Settings, Smartphone, Verified, X } from "lucide-react";
import { createPortal } from "react-dom";

interface linkedSessionProps {
  startSession: boolean,
  isClose: () => void,
}


//-----------------LinkedSession component-----------//
//---------------------------------------------------//
const LinkedSession = ({ startSession, isClose }: linkedSessionProps) => {
  const [qr, setQr] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {


    // Get the qr code for scan 
    const getQrCode = async () => {
      console.log('start req...')
      try {
        setIsloading(true);

        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
          ws.send(JSON.stringify({
            sessionId: '+212 693223328'
          }))
        }
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.status === 'open') {
            setConnected(true);
            setQr(null);

            ws?.close();

            setTimeout(() => (setConnected(false), isClose()), 5000)
          }
        };
        await api.post('/linkDevice', { sessionId: '+212 693223328' }).then(
          ({ status, data }) => {
            status === 201 ? setQr(data.response.QrCode)
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

    startSession && getQrCode();
    !startSession && setQr(null)
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

export default function Home() {

  const [startSession, setStartSession] = useState(false);

  return (
    <div className=" bg-white/10 w-full h-[80%] mx-auto  mt-20 p-15 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20  md:p-8">
      <div className="w-full flex justify-between items-center ">
        <span>
          <h1 className="underline text-2xl mb-3 text-white">Whatsapp Profiles:</h1>
          <p className="text-white">Connect and manage your Whatsapp Business accounts.</p>
        </span>

        <Button onClick={() => setStartSession(true)} className="bg-emerald-600">
          Add Profile
        </Button>
        <LinkedSession startSession={startSession} isClose={() => setStartSession(false)} />
      </div>

      <div className="w-full h-[1px] bg-white/20 backdrop-blur-lg mt-4 " ></div>
    </div >
  );
}
