import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import {  host } from "../utils/APIRoutes";
import './reg.css'
export default function Register() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate=useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        pic:"",
      });
      const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };
      const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
      };
      const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
          const { email, username, password ,pic} = values;
          const { data } = await axios.post(registerRoute, {
            username,
            email,
            password,
            pic
          });
    
          if (data.status === false) {
            toast.error(data.msg, toastOptions);
          }
          if (data.status === true) {
            localStorage.setItem(
              "chat-app-user",
              JSON.stringify(data.user)
            );
            navigate("/chat");
          }
        }
      };

      useEffect(() => {
        if (localStorage.getItem("chat-app-user")) {
          navigate("/chat");
        }
      }, []);
console.log("dasadssadsads",values)
      const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;
        if (password !== confirmPassword) {
          toast.error(
            "Password and confirm password should be same.",
            toastOptions
          );
          return false;
        } else if (username.length < 1) {
          toast.error(
            "Username should be greater than 3 characters.",
            toastOptions
          );
          return false;
        } else if (password.length < 1) {
          toast.error(
            "Password should be equal or greater than 8 characters.",
            toastOptions
          );
          return false;
        } else if (email === "") {
          toast.error("Email is required.", toastOptions);
          return false;
        }
    
        return true;
      };



      const sendFile = async (e) => {
  
        const file = e.target.files[0];
        if (file) {
          
          console.log("Selected file:", file);


          const formData = new FormData();
          formData.append("file", file);
          console.log('form')
          try {
            const response = await axios.post(`${host}/prof`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
      
            console.log("File uploaded successfully:", response?.data?.filename);
            const fileString = `${host}/profile/${response?.data?.filename}`
           
            setValues({ ...values, "pic": fileString});
           
          
          } catch (err) {
            console.error("File upload failed:", err);
          }






     
        
        }
      };
      
    
      return (
        <>
          <div className="form-container">
            <form onSubmit={(event) => handleSubmit(event)}>
              <div className="brand">
                <img src={Logo} alt="logo" />
                <h1>CHAT APP</h1>
              </div>
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={(e) => handleChange(e)}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={(e) => handleChange(e)}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => handleChange(e)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={(e) => handleChange(e)}
              />
              <input
                type="file"
                id="fileInput"
        
                accept=".png,.jpeg,.jpg"
                onChange={(e) => {
                  sendFile(e)
                }}
              />
              <button type="submit">Create User</button>
              <span>
                Already have an account ? <Link to="/login">Login.</Link>
              </span>
            </form>
          </div>
          <ToastContainer />
        </>
      );
    }