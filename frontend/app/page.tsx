"use client";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { api } from "@/axios/config";

export default function Home() {
  const [startSession, setStartSession] = useState(false);
  const [qr, setQr] = useState(null);
  useEffect(() => {
    // Get the qr code for scan 
    const getQrCode = async () => {
      console.log('start req...')
      try {
        const response = await api.get('/');
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
      <div className="bg-white/10 h-[60%] flex justify-between items-center mt-20 p-15 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="h-full w-1/2 pt-15 pl-10 ">
          <h1 className="text-4xl font-medium mb-20">Start Your AI-chatbot Now.</h1>
          <Button onClick={() => setStartSession(!startSession)} className="h-11 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl" >Start Now</Button>
        </div>
        <div className="bg-white/10 w-0.5 h-full"></div>
        <div className={` ${!startSession && 'bg-black'}  h-[250px] w-[250px] border mr-55`}>

          {startSession && <QRCode size={248} value={qr || ''} />}
        </div>
      </div>
    </div >
  );
}
