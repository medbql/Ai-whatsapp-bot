"use client";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { api } from "@/axios/config";
import { Camera, MonitorSmartphone, Phone, QrCode, Settings, Smartphone, Verified } from "lucide-react";

export default function Home() {
  const [startSession, setStartSession] = useState(false);
  const [qr, setQr] = useState(null);
  useEffect(() => {
    // Get the qr code for scan 
    const getQrCode = async () => {
      console.log('start req...')
      try {
        const response = await api.post('/linkDevice', { sessionName: 'med2' });
        console.log(response)
        setQr(response.data.code);

      } catch (error) {
        console.error('Error :', error);
        throw error;
      }
    };

    startSession && getQrCode();

  }, [startSession])


  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-4 md:p-8">
      <div className="bg-white/10 w-3/4 h-[80%] mx-auto flex justify-between items-center mt-20 p-15 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
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
          <div className={` ${!startSession && 'bg-transparent'}  h-[250px] w-[250px] border rounded-xl overflow-hidden mb-3 mr-25`}>

            {startSession && <QRCode size={248} value={qr || ''} />}
          </div>
          <Button onClick={() => setStartSession(!startSession)} className="h-11 ml-15  bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl" >Start Now</Button>
        </div>
      </div>
    </div >
  );
}
