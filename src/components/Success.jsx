import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import './all.css'
import dev from "./device.png"
const SuccessComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      console.log("reload");
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }

    // Set a timeout to hide loading after 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer
  }, []);






  
  const handleClearReloadFlag = () => {
    localStorage.removeItem('hasReloaded');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading device information...</p>
      </div>
    );
  }

  return (
    <div className="containersuccess">
      {/* Device Image Section */}
      <div className="deviceImageContainer">
        <img 
          src={dev}
          alt="Device Preview"
          className="deviceImage"
        />
        <div className="previewBadge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '4px' }}>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="#0A84FF"/>
          </svg>
          Preview
        </div>
      </div>
  
      {/* Header */}
      <div className="header">
        <div className="iconCircle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14z" fill="white"/>
          </svg>
        </div>
        <h1 className="title">HP Victus -Gaming Laptop</h1>
      </div>
  
      {/* Status Bar */}
      <div className="statusBar">
        <div className="statusItem">
          <span style={{ fontSize: '16px' }}>Location :  Jaipur,Rajasthan,India</span>
        </div>
        <div className="statusItem">
          <span style={{ fontSize: '16px' }}>54% battery</span>
        </div>
      </div>
  
      {/* Action Buttons */}
      <div className="actionButtonsContainer">
        <button className="actionButton">
         Last Active 
        </button>
  
        <button className="actionButton">
          Secure device
        </button>
  
   
        <Link
          to="/chat"
          onClick={handleClearReloadFlag}
          className={`actionButton destructiveButton`}
        >
          Go back to chat
        </Link>
      </div>
    </div>
  );
};


export default SuccessComponent;
