// components/QRCode.jsx
import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { host } from "../utils/APIRoutes";
import { fronthost } from "../utils/APIRoutes";
import { io } from "socket.io-client"
import "./all.css"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { v4 as uuidv4 } from 'uuid';
import { useContext } from "react";
import { ThemeContext } from "../context/theme";
import { MdOutlineTabletAndroid } from "react-icons/md";
import ani from "./ani.gif"
import { HiComputerDesktop } from "react-icons/hi2";
export default function QRCodeComponent() {
  const [loading, setLoading] = useState(false);
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

  const handleconfirm = (user) => {
    console.log("hellowerr")


    console.log(user)

    setLoading(true);
    localStorage.setItem("chat-app-user", JSON.stringify(user));
    localStorage.setItem("linked", "123456")

    setTimeout(() => {
      window.location.href = `${fronthost}/chat`;
    }, 3000);


  }






  return (



<div>
      {loading ? (
        <div className="loader-container">
          <div className='compimg'>
            <div className="icon left-icon"><MdOutlineTabletAndroid /></div>


            <div className="dots">
              <svg viewBox="0 0 300 100">
                <path d="M 0 100 Q 150 -20 300 100" />
              </svg>
            </div>
            <div className="icon right-icon"><HiComputerDesktop /></div>
          </div>
          <img className='loading' src={ani} alt="Loading..." />
          <p className="text-center mt-4">Connecting ....</p>
        </div>
      ) : (
        <>
            <div className="whatsapp-login-container">
      <div className="login-card-horizontal">
        {/* Left Content */}
        <div className="login-left">
          <div className="login-header">
            <h1 className="login-title">Log into Message Web</h1>
            <p className="login-subtitle">
              Message privately with friends and family using Message on your browser.
            </p>
          </div>
  
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <p className="step-text">Open Message on your phone</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p className="step-text">
                Tap <span className="bold-text">Menu</span> on Android, or <span className="bold-text">Settings</span> on iPhone
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p className="step-text">
                Tap <span className="bold-text">Linked devices</span> and then <span className="bold-text">Link a device</span>
              </p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <p className="step-text">Point your phone at this screen to scan the QR code</p>
            </div>
          </div>
  
          <div className="footer-section">
            <p className="help-text">Need help getting started?</p>
            <div className="footer-actions">
              <button className="phone-login-button">Log in with phone number</button>
              <div className="stay-logged-in">
                <input type="checkbox" id="stay-logged-in" className="stay-logged-checkbox" />
                <label htmlFor="stay-logged-in" className="stay-logged-label">
                  Stay logged in on this browser
                </label>
              </div>
            </div>
          </div>
        </div>
  
        {/* QR Code / Right Side */}
        <div className="qr-section">
       {qrCodeUrl &&(
            <>
              <img className="qrcode" src={qrCodeUrl} alt="Message QR Code" />
              <p className="scan-instruction">Scan this QR code with your phone's Message</p>
            </>
          ) }
        </div>
      </div>
    </div>
        </>
      )}
    </div>



   

 
  );
  
}