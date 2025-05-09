
import styled from "styled-components"
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import axios from "axios";
import Contacts from "../components/Contact";
import Welcome from "../components/welcome";
import ChatContainer from "../components/ChatContainer";
import Logout from "../components/Logout";
import { io } from "socket.io-client"
import './chat.css'
import Logo from "../assets/logo.svg";

import { MdMessage } from "react-icons/md";
import { FaSearch, FaRegComment, FaRegUser, FaRegBell, FaEllipsisH } from "react-icons/fa";
export default function Chat() {

    const socket = useRef()

    console.log("ss", socket)


    const [contacts, setContacts] = useState([]);

    const [currentChat, setCurrentChat] = useState(undefined)
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("chat-app-user")));
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/login");
            }
            console.log("hellow2")
        };

        checkUser();
    }, []);

    useEffect(() => {
     const linked =JSON.parse(localStorage.getItem("linked"))


     if(linked){
        socket.current = io(host);
        socket.current.emit("add-user", `linked?${currentUser._id}`);



     }
      else if(currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);

        }


    }, [currentUser]);



    useEffect(() => {
        const fetchData = async () => {
            const userData = await JSON.parse(localStorage.getItem("chat-app-user"));
            console.log("hellow2")
            setCurrentUser(userData);
        };

        fetchData();
    }, []);

    console.log("sa", currentUser)


    // eslint-disable-next-line no-constant-condition
    useEffect(() => {
        const fetchconta = async () => {
            if (currentUser) {
                console.log("Avatar image is set. Current user:", currentUser);


                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data)

            } else {
                console.log("Avatar image is not set. Navigating to /setAvatar.");
                navigate("/chat");
            }

        };

        fetchconta();
    }, []);


    console.log(contacts)
    const handleChatChange = (chat) => {
        console.log("handle chat", chat)
        localStorage.setItem('current', JSON.stringify(chat));


        setCurrentChat(chat)
    }
    useEffect(() => {
        const df = async () => {
            const dfg = await JSON.parse(localStorage.getItem('current')) || []

            setCurrentChat(dfg)
        };

        df(); // call the function
    }, []);
    console.log("ggg",currentChat)
    return (
        <div className="main-cont">

            <div className={`container ${currentChat?.length==0 || currentChat==undefined ? "" : "mobile-chat-active"}`}>
                <div className="l5">

                    <div className="left-sidebar">
                        {/* Top section */}
                        <div className="sidebar-top">
                        <div className="sidebar-icon">
                        <MdMessage className="icon"/>
                                
                            </div>
                            <div className="sidebar-icon">
                                <FaSearch className="icon" />
                            </div>

                            <div className="sidebar-icon">
                                <FaRegUser className="icon" />
                            </div>

                            <div className="sidebar-divider"></div>

                            <div className="sidebar-icon">
                                <FaRegBell className="icon" />
                            </div>

                            <div className="sidebar-icon">
                                <FaEllipsisH className="icon" />
                            </div>

                            <div className="sidebar-icon">
                                <FaEllipsisH className="icon" />
                            </div>

                          

                            <div className="sidebar-icon">
                                <FaRegBell className="icon" />
                            </div>
                        </div>

                        {/* Bottom section */}
                        <div className="sidebar-bottom">
                        <div className="logout">
                                <Logout currentUser={currentUser} currentChat={currentChat} />
                            </div>
                            <div className="prof">
                                <img src={currentUser?.pic} className="avatar-image" alt="User Avatar" />
                            </div>
                           


                        </div>
                    </div>



                    <Contacts className="chatmobile"contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
                </div>



                <div className="r5">




                    {currentChat === undefined || currentChat?.length==0? (
                        <Welcome currentUser={currentUser} />
                    ) : (
                        <ChatContainer currentChat={currentChat}
                            currentUser={currentUser} socket={socket}
                        />
                    )}
                </div>


            </div>



        </div>
    )
}

