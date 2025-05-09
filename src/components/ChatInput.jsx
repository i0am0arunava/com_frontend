/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from 'react';
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { ThemeContext } from "../context/theme";
import { BsEmojiSmileFill } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BsEmojiSunglasses } from "react-icons/bs";
import axios from 'axios';
import './all.css'
const ChatInput = ({ fileS, handleSendMsg, currentChat, socket, currentUser }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const currentTheme = useContext(ThemeContext)
  console.log("usecon", currentTheme)
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [type, settype] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event) => {

    let message = msg;
    message += event.emoji;
    setMsg(message);
  };


  const setMsgg = (event) => {
    console.log("event", event)
    setMsg(event.target.value)
  }








  const sendFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
      fileS(file)
      setSelectedFile(null)
    }
  };







  const sendChat = (event) => {

    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  const handleKeyDown = () => {


    socket.current.emit("typingModeOn", {
      head: "typing",
      to: currentChat._id,
      from: currentUser._id
    });

  };

  const handleKeyUp = () => {

    setTimeout(() => {
      socket.current.emit("typingModeOff", {
        head: "notyping",
        to: currentChat._id
      });
    }, 800);


  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("typingrecieve", (msg, from, to) => {
        // currentTheme.setTheme({ theme: true, from: from, to: to })
      });
    }
  }, []);
  useEffect(() => {
    if (socket.current) {
      socket.current.on("typingrecieveoff", (msg) => {
        // currentTheme.setTheme(false)
      });
    }
  }, []);

  return (
    <div className='contaaa'>
      <div className="button-container">
        <div className="file-upload">
          <label htmlFor="fileInput">
            <AiOutlinePlus style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'white' }} />
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept=".pdf,.png,.jpeg,.jpg,.doc,.docx,.gif"
            onChange={(e) => {
              sendFile(e)
            }}

          />
        </div>

        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          
          {showEmojiPicker && <Picker className="emoji-picker" onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      {selectedFile && (
        <div className="file-preview">
          {selectedFile.type === "application/pdf" ? (
            <span>{selectedFile.name}</span>
          ) : (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="preview"
              className="preview-image"
            />
          )}
        </div>
      )}
      <form className='input-container' onSubmit={(event) => sendChat(event)}>


        <input type="text" placeholder="type our message"

          onChange={(e) => setMsgg(e)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          value={msg}

        />
        <button className="finbut" type="submit">
          <IoMdSend />
        </button>
      </form>

    </div>
  );
};



export default ChatInput;
