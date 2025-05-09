// components/QRCode.jsx
import { useEffect, useState,useRef } from 'react';
import QRCode from 'qrcode';
import {  host } from "../utils/APIRoutes";
import {  fronthost } from "../utils/APIRoutes";
import { io } from "socket.io-client"
import "./all.css"
import { v4 as uuidv4 } from 'uuid';
import { useContext } from "react";
import { ThemeContext } from "../context/theme";
export default function QRCodeComponent() {

  const [qrCodeUrl, setQrCodeUrl] = useState('');
 const socket = useRef()
  useEffect(() => {
    socket.current = io(host);
    socket.current.emit("add-scanner", "arun");
    const generateQR = async () => {
      try {
        const randomUsername = `user_${Math.random().toString(36).substring(2, 8)}`;
        const randomEmail = `${randomUsername}@example.com`;
        
        const payload = {
          id: uuidv4(),
          username: randomUsername,
          email: randomEmail,
          timestamp: Date.now(),
          nonce: uuidv4(),
        };
        
        const qrData = await QRCode.toDataURL(JSON.stringify(payload));
        setQrCodeUrl(qrData);
      } catch (err) {
        console.error('Error generating QR Code', err);
      }
    };

    generateQR();
  }, []);





  useEffect(() => {

    socket?.current?.on("confirm", handleconfirm);


    return () => {
 
      socket?.current?.off("confirm", handleconfirm);
   
    };
  }, []);

  const handleconfirm=(user)=>{
    console.log("hellowerr")


console.log(user)
  

    localStorage.setItem("chat-app-user", JSON.stringify(user));
    localStorage.setItem("linked","123456")
    
    window.location.href = `${fronthost}/chat`;
    
    }






  return (
    <div className="flex flex-col items-center justify-center mt-10 qrcode">
      <h1 className="text-lg font-semibold mb-4">QR Code for ID=1234</h1>
      {qrCodeUrl ? (
        <img className="qrcode" src={qrCodeUrl} alt="QR Code" />
      ) : (
        <p>Generating QR Code...</p>
      )}
    </div>
  );
}
