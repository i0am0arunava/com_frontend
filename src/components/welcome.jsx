import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import "./wel.css"
import welcome from './welcome.png'
export default function Welcome({ currentUser }) {

    useEffect(() => {
        const checkUser = async () => {
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/login");
            }
            console.log("hellow2")
        };

        checkUser();
    }, []);
  return (
    <div className="maincontainer">
      <div>
        <img
          src={welcome}
          alt="Welcome"
        />
      </div>
      <h1>Welcome to Your App</h1>
      <p>
        Send and receive messages without keeping your phone online. Use this app on up to 4 linked devices and 1 phone at the same time.
      </p>
      <p> Your personal messages are end-to-end encrypted</p>
    </div>
  );
}