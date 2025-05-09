import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SuccessComponent = () => {
  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');

    if (!hasReloaded) {
        console.log("reload")
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
  }, []);

  const handleClearReloadFlag = () => {
    localStorage.removeItem('hasReloaded');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px',
      color: 'green'
    }}>
      <h1>Hello! This page will reload once.</h1>
      <Link
        to="/chat"
        onClick={handleClearReloadFlag}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '18px'
        }}
      >
        Go back to chat
      </Link>
    </div>
  );
};

export default SuccessComponent;
