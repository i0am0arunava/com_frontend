
/* eslint-disable react/prop-types */
import { useContext } from "react";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ThemeContext } from "../context/theme";
import Logout from "./Logout";
import ReactPlayer from 'react-player'
import axios from "axios";
import ChatInput from "./ChatInput";
import { recieveMessageRoute, sendMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";
import "./all.css";
import profImg from './pdf.svg';
import { FiPhone, FiVideo, FiMoreVertical } from "react-icons/fi";
import { IoIosShareAlt } from "react-icons/io";
import { GrFormPreviousLink } from "react-icons/gr";
import peer from "./service/peer";
import { useNavigate } from 'react-router-dom';
import {  host } from "../utils/APIRoutes";
const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messags, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [file, setFile] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState();
  const [isMe, setIsMe] = useState(false);
  const [button, setbutton] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const scrollRef = useRef();


  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem("current");
    navigate('/chat');
window.location.reload();
  

  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);






  const handleSendMsg = async (msg) => {
    console.log("asdads")
    socket.current.emit("send-msg", {
      from: currentUser._id,
      to: currentChat._id,
      message: msg
    });





    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    const msgs = [...messags];
    msgs.push({ fromSelf: true, me: currentUser._id, you: currentChat._id, message: msg });
    setMessages(msgs);

  }

  const filesend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log('form')
    try {
      const response = await axios.post(`${host}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File uploaded successfully:", response?.data?.filename);
      const fileString = `${host}/uploads/${response?.data?.filename}`

      socket.current.emit("send-msg", {
        from: currentUser._id,
        to: currentChat._id,
        message: fileString,
      });
      const msgs = [...messags];
      msgs.push({ fromSelf: true, me: currentUser._id, you: currentChat._id, message: fileString });
      setMessages(msgs);

      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: fileString,
      });
    } catch (err) {
      console.error("File upload failed:", err);
    }
  }

  useEffect(() => {
    const messager = async () => {
      const response = await axios.post(recieveMessageRoute, {
        from: currentUser._id,
        to: currentChat._id
      })
      setMessages(response.data)
    };

    messager();
  }, [currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", handleMessagechatapp);
      socket.current.on("link-recieve", linkmessage);

    }
    return () => {
      socket?.current?.off("msg-recieve", handleMessagechatapp);
      socket?.current?.off("link-recieve", linkmessage);// Clean up the listener
    };
  }, []);

  const handleMessagechatapp = useCallback((msg, from, to) => {
    console.log("Message received:", msg, "from:", from, "to:", to);
    setArrivalMessage({
      fromSelf: false,
      me: from,
      you: to,
      message: msg,
    });
  }, [setArrivalMessage]);

  // For link messages
  const linkmessage = useCallback((msg, from, to, fromSelf) => {
    console.log("Link received:", msg, "from:", from, "to:", to);
    setArrivalMessage({
      fromSelf,
      me: from,
      you: to,
      message: msg,
    });
  }, [setArrivalMessage]);



















  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messags]);

  console.log("mmmm", messags)
  const extractFileName = (url) => {
    return url.split("/").pop();
  };



  const handleVideoCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      setIsVideoCallActive(!isVideoCallActive);
      const offer = await peer.getOffer();
      socket?.current?.emit("user:call", { from: currentUser._id, to: currentChat._id, offer });
      setIsMe(true)
    } catch (err) {
      console.error("Failed to get media devices", err);
      alert("Could not access camera/microphone. Please check permissions.");
    }
  }, [currentUser._id, socket, currentChat._id]);




  useEffect(() => {

    socket?.current?.on("incomming:call", handleIncommingCall);
    socket?.current?.on("call:accepted", handleCallAccepted);
    socket?.current?.on("peer:nego:needed", handleNegoNeedIncomming);
    socket?.current?.on("peer:nego:final", handleNegoNeedFinal);



    return () => {
      socket?.current?.off("incomming:call", handleIncommingCall);
      socket.current?.off("call:accepted", handleCallAccepted);
      socket?.current?.off("peer:nego:needed", handleNegoNeedIncomming);
      socket?.current?.off("peer:nego:final", handleNegoNeedFinal);



    };
  }, []);



























  const handleIncommingCall = useCallback(async ({ from, offer }) => {
    console.log("from", from)
    console.log("from", offer)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    setIsVideoCallActive(!isVideoCallActive);
    const ans = await peer.getAnswer(offer)
    socket.current?.emit("call:accepted", { to: from, from: currentUser._id, ans });

  },
    [socket, currentUser._id]
  );
  //senderside


  const sendStreams = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream);
    }
    setbutton(!button)
  }, []);
  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );
  // const sendStreams= async () => {

  //   for (const track of myStream.getTracks()) {
  //     peer.peer.addTrack(track, myStream);
  //   }
  // }









  //recevier side
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);






  //when anyone needs negotiation 
  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket?.current?.emit("peer:nego:needed", { to: currentChat?._id, from: currentUser?._id, offer });
  }, [currentChat?._id, currentUser?._id]);
  // when anyone needs negotiation  this listioner call handleNegoNeeded
  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);


  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket?.current?.emit("peer:nego:done", { to: from, from: currentUser?.id, ans });
    },
    [currentUser?._id]
  );
  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);






  console.log("remote", remoteStream)











  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="user-info">
        <div className="navigate" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <GrFormPreviousLink />
    </div>
          <div className="avatar">
            <img
              src={currentChat?.pic || "default-profile.png"}
              className="avatar-image"
            />
          </div>
          <div className="user-details">
            <h3 className="usernamess">{currentChat.username}</h3>
            <p className="last-seen">last seen today at 2:08 am</p>
          </div>

        </div>

        {/* Right side icons */}
        <div className="chat-actions">
          <button className="icon-button" title="Voice Call">
            <FiPhone size={20} />
          </button>
          <button className="icon-button" title="Video Call" onClick={handleVideoCall}   >
            <FiVideo size={20} />
          </button>

          <div className="dropdown-container" style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              className="icon-button"
              title="More Options"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FiMoreVertical size={20} />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu" style={{
                position: 'absolute',
                right: 0,
                backgroundColor: 'white',
                minWidth: '160px',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                borderRadius: '4px',
                zIndex: 1
              }}>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      // Add functionality for option 1
                      setIsDropdownOpen(false);
                    }}
                  >
                    Option 1
                  </li>
                  <li
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      // Add functionality for option 2
                      setIsDropdownOpen(false);
                    }}
                  >
                    Option 2
                  </li>
                  <li
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      // Add functionality for option 3
                      setIsDropdownOpen(false);
                    }}
                  >
                    Option 3
                  </li>
                </ul>
              </div>
            )}
          </div>


        </div>
      </div>
      <div className="chat-messages">
        {messags.map((message) => {
          if (
            (message.me === currentUser._id && message.you === currentChat._id) ||
            (message.you === currentUser._id && message.me === currentChat._id)
          ) {
            const msg = message.message;
            const isImage = /\.(jpg|jpeg|png|gif)$/i.test(msg);
            const isPDF = /\.pdf$/i.test(msg);
            const isWord = /\.(docx|doc)$/i.test(msg);
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                  <div className="content ">
                    {isImage ? (

                      <div className={` ${message.fromSelf ? "sicon" : "riicon"}`}>
                        <div className="iconx">

                          <IoIosShareAlt />

                        </div>
                        <div className="imgcon">
                          <img src={msg} alt="sent" className="chat-image" style={{ width: "500px", borderRadius: "10px" }} onLoad={() => scrollRef.current?.scrollIntoView({ behavior: "smooth" })} />

                        </div>
                      </div>
                    ) : isPDF || isWord ? (

                      <div className={` ${message.fromSelf ? "sicon" : "riicon"}`}>
                        <div className="iconx">

                          <IoIosShareAlt />

                        </div>
                        <div className="pdf-message">
                          <div className={`pdf-preview ${message.fromSelf ? "sendP" : "recP"} `}>
                            <div className="pdf-header">
                              <span className="forwarded">Forwarded</span>
                            </div>
                            <div className="pdf-thumbnail">
                              <div className="pdf-preview-container">


                              </div>
                            </div>
                            <div className="pdfinfo">
                              <div className="pficon">
                                {isWord ? (
                                  <div className="pficon">
                                    <img
                                      src={profImg} // Word icon
                                      className="pdf-overlay-icon"
                                      alt="Word"
                                    />
                                  </div>
                                ) : (
                                  <div className="pficon">
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                      className="pdf-overlay-icon"
                                      alt="PDF"
                                    />
                                  </div>
                                )}

                              </div>
                              <div className="pdf-info">
                                <p>Document.pdf</p>
                                <div className="pdf-meta">
                                  <span>1 page</span>
                                  <span>•</span>
                                  <span>PDF</span>
                                  <span>•</span>
                                  <span>182 KB</span>
                                </div>
                                <div className="pdf-actions">
                                  <a
                                    href={message.message}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`pdf-view-btn`}
                                  >
                                    View
                                  </a>
                                  <a
                                    href={message.message}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`pdf-download-btn  ${message.fromSelf ? "sendb" : "recb"}`}
                                  >
                                    {isWord ? (
                                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 15V3M12 15L8 11M12 15L16 11M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    ) : (
                                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 15V3M12 15L8 11M12 15L16 11M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </a>

                                </div>
                              </div>
                            </div>

                          </div>
                        </div>


                      </div>

                    ) : (
                      <p className="text">{msg}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>


      <ChatInput className="InputBox" fileS={filesend} handleSendMsg={handleSendMsg} currentChat={currentChat} socket={socket} currentUser={currentUser} />
      {isVideoCallActive && (
        <div className={`video-call-container ${isMinimized ? "minimized" : ""}`}>
          {/* Header bar with minimize/close controls */}
          <div className="video-call-header">
            <div className="caller-info">
              <img
                src={currentChat?.pic || profImg}
                alt={currentChat.username}
                className="caller-avatar"
              />
              <span className="caller-name">{currentChat.username}</span>
              <span className="call-status">
                {remoteStream ? "Video call" : "Calling..."}
              </span>
            </div>
            <div className="call-controls-header">
              <button
                className="minimize-button"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="white" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="white" d="M19 13H5v-2h14v2z" />
                  </svg>
                )}
              </button>

            </div>
          </div>

          {/* Main video content (hidden when minimized) */}
          {!isMinimized && (
            <div className="video-content">
              {/* Remote video */}
              <div className="remote-video-wrapper">
                {remoteStream ? (
                  <>
                    <ReactPlayer
                      className="remote-video"
                      playing
                      muted={false}
                      height="100%"
                      width="100%"
                      url={remoteStream}
                    />
                    {!isMe && button && (



                      <div className="callfrom">
                        <div className="waiting-avatar-container">
                          <div className="pulse-ring"></div>
                          <div className="pulse-ring delay"></div>
                          <img
                            src={currentChat?.pic}
                            alt={currentChat.username}
                            className="waiting-call"
                          />
                        </div>

                        <div className="waiting-call-text">Call from {currentChat.username}...</div>



                      </div>





                    )}
                  </>


                ) : (
                  <div className="waiting-screen">
                    <div className="waiting-avatar">
                      <img
                        src={currentChat?.pic || profImg}
                        alt={currentChat.username}
                      />
                    </div>
                    <div className="waiting-text">Calling {currentChat.username}<p>.</p></div>

                  </div>
                )}
              </div>

              {/* Local video (small pip) */}
              {myStream && (
                <div className="local-video-wrapper">
                  <ReactPlayer
                    className="local-video"
                    playing
                    muted={true}
                    height="100%"
                    width="100%"
                    url={myStream}
                  />
                </div>
              )}
            </div>
          )}

          {/* Footer controls (hidden when minimized) */}
          {!isMinimized && (
            <div className="video-call-footer">
              <button
                className="control-button mute"
                onClick={() => {
                  if (myStream) {
                    const audioTrack = myStream.getAudioTracks()[0];
                    if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
                  }
                }}
              >
                <div className="control-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="white" d="M12 3.7v.9l1.3 1.3c.4-.2.8-.3 1.3-.3 1.7 0 3 1.3 3 3v4c0 .5-.1.9-.3 1.3l1.3 1.3c.5-.8.7-1.7.7-2.6V8c0-2.8-2.2-5-5-5-.7 0-1.4.1-2 .4zm3.2 12.5l1.8 1.8 1.4-1.4-16-16L1 3.3l4.3 4.3H4c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h3v3c0 .6.4 1 1 1h6c.3 0 .6-.1.8-.3l2.2 2.2 1.2-1.2zM10 17H8v-2.9l2 2V17zm6-5c0 .6-.1 1.2-.3 1.7l1.5 1.5c.5-1 .8-2.1.8-3.2v-2h-2v1.5l.5.5h.5v1zM12 5c.5 0 1 .1 1.4.3L12 7.1V5z" />
                  </svg>
                </div>
                <span>Mute</span>
              </button>

              <button
                className="control-button camera"
                onClick={() => {
                  if (myStream) {
                    const videoTrack = myStream.getVideoTracks()[0];
                    if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
                  }
                }}
              >
                <div className="control-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="white" d="M17 10.5V7c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" />
                  </svg>
                </div>
                <span>Camera</span>
              </button>

              <button
                className="control-button end-call"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <div className="control-icon red">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="white" d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                  </svg>
                </div>
                <span>End</span>
              </button>

              {!isMe && myStream && button && (
                <button
                  className="control-button accept-call"
                  onClick={sendStreams}
                >
                  <div className="control-icon green">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path fill="white" d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                    </svg>
                  </div>
                  <span>Accept</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatContainer;