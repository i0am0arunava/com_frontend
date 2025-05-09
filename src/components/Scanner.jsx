import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Ap.css';


import reactLogo from '../assets/logo.svg'
import { io } from "socket.io-client"
function App() {
  const [scannedData, setScannedData] = useState(null);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [scanStatus, setScanStatus] = useState('Scanning...');
  const [result,setResult] =useState()
  const scannerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = 'http://localhost:5000';
  const navigate=useNavigate();
 
  const socket = useRef()






  useEffect(() => {
    socket.current = io(API_BASE_URL);
    
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);














  function parseStringToJson(str) {
    const lines = str.split('\n');
    const result = {};
  
    lines.forEach(line => {
      const trimmedLine = line.trim().replace(/"/g, '');
      const parts = trimmedLine.split(':').map(part => part.trim());
      
      if (parts.length >= 2) {
        const key = parts[0];
        const value = parts.slice(1).join(':').trim();
        
        if (key === 'Name' || key === 'Event Id') {
          result[key] = value;
        }
      }
    });
  
    return str;
  }

  const addData = async (data) => {
    const { Name, "Event Id": EventId } = parseStringToJson(data);
    
  
    const user = await JSON.parse(localStorage.getItem("chat-app-user"));





    try {
      const token="arun"
      socket?.current?.emit("scanning", user);
      const response = await axios.post(`${API_BASE_URL}/scanner`, {
      id:data
      });
      console.log(response.data);
      setResult(response.data.success); 
      if (response.data) {
        navigate('/success'); // Passing scan data to success page
      }
      // Store the result
      setScanStatus(response.data.success ? 'Scan successful!' : 'Verification failed');
    } catch (error) {
      console.error(error);
      setScanStatus('Scan failed. Try again.');
    } finally {
      setLoading(false); 
     // Stop loading no matter success or error
    }
  };
  
  


  useEffect(() => {
    if (!isScannerActive) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScannedData(decodedText);
    addData(decodedText)
        setIsScannerActive(false);
        scanner.clear();
      },
      (error) => {
        console.warn(`QR Code no match: ${error}`);
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner ", error);
        });
      }
    };
  }, [isScannerActive]);

  const handleScanAgain = () => {
    setScannedData(null);
    setIsScannerActive(true);
    setScanStatus('Scanning...');
  };

  return (
    <div className="app-container">
      {/* New App Header with Logo */}
      <header className="app-header">
        <div className="logo-container">
        <div className="app-logo">
        <img src={reactLogo} className="logo react" alt="React logo"   style={{ width: '70px', height: '70px' }} />
</div>
          <div className="app-header-text">
            <h1>QR Scan Pro</h1>
            <p>Event Management System</p>
          </div>
        </div>
      </header>

      {/* Main Scanner Card */}
      <div className="scanner-card">
        <div className="scanner-header">
          <h2 className="app-title">QR Code Scanner</h2>
          <p className="app-subtitle">Point your camera at a QR code</p>
        </div>
        
        <div className="scanner-wrapper">
  {isScannerActive ? (
    <>
      <div id="qr-reader" className="qr-scanner"></div>
      <div className="scan-status">{scanStatus}</div>
      <div className="scanner-guide">
        <div className="guide-line top-left"></div>
        <div className="guide-line top-right"></div>
        <div className="guide-line bottom-left"></div>
        <div className="guide-line bottom-right"></div>
      </div>
      <div className="scanning-animation"></div>
    </>
  ) : loading ? (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <h3>Verifying Scan...</h3>
    </div>
  ) : (
    <>
    
        <div className="scan-preview">
          <div className="scan-success-icon">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
          </div>
          <h3 className="scan-result-title">Scan Complete!</h3>
          <div className="scan-result-data">
            <pre>{scannedData}</pre>
          </div>
        </div>
   
    </>
  )}
</div>



        <div className="scanner-actions">
          {!isScannerActive && (
            <button 
              onClick={handleScanAgain}
              className="scan-again-button"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
              </svg>
              Scan Another Code
            </button>
          )}
          
          <button 
         
            className="test-button"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17H13V7H11V17Z" />
            </svg>
            Test Connection
          </button>
        </div>
      </div>
      
      <div className="app-footer">
        <p>Scanner Developed By <span className="developer-name">i0am0arunav</span> © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}

export default App;