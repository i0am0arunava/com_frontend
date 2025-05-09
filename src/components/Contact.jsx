/* eslint-disable react/prop-types */


import { useEffect,useRef } from "react"
import { MdOutlineArchive } from "react-icons/md";
import { useState } from "react"
import {Link} from 'react-router-dom'
import styled from "styled-components";
import profImg from './prof.png';
import { FiPhone, FiVideo, FiMoreVertical } from "react-icons/fi";
import './cont.css'
export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(undefined)
  useEffect(() => {
    setCurrentUserName(currentUser.username);
    setCurrentUserImage(currentUser.avatarImage);


  }, [])


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

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index)
    changeChat(contact)

  }
  console.log("hey", contacts)


  return (



    <div className="chat-list-container">
      <div className="chat-list-header">
        <h1>Chats</h1>

               <div className="dropdown-container" style={{ position: 'relative' }} ref={dropdownRef}>
                 <button
                   className="menu-button"
                   title="More Options"
                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                 >
                   <FiMoreVertical className="micon"/>
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
    cursor: 'pointer',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}
  onClick={() => setIsDropdownOpen(false)}
>
  <Link 
    to="/scanner" 
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'inherit',
      textDecoration: 'none',
      width: '100%'
    }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 11H21V13H3V11ZM3 5H21V7H3V5ZM3 17H21V19H3V17Z" fill="currentColor"/>
    </svg>
    Linked Device
  </Link>
</li>
                   
                     </ul>
                   </div>
                 )}
               </div>
      </div>

      <div className="search-options">
        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>
        <div className="quick-filters">
          <span className="filter active">Unread</span>
          <span className="filter">Favourites</span>
          <span className="filter">Groups</span>
        </div>
      </div>
      <div className='arch'>
        <MdOutlineArchive className='icon' />
        <div className="notification-banner">
          <p>Get notified of new messages on your computer.</p>
          <button className="notification-button">Turn on desktop notifications </button>
        </div>
      </div>
      <div className="chats">
        {/* Regular chats */}
        {contacts.map((chat, index) => (
          <div
            key={chat._id}
            className={`chat-item ${index === currentSelected ? 'selected' : ''} ${chat?.unread ? 'unread' : ''}`}
            onClick={() => changeCurrentChat(index, chat)}
          >
            <div className="chat-avatar">



              <img
                src={chat.pic|| "default-profile.png"}
                alt={chat.username}
                className="avatar-image"
              />




            </div>
            <div className="chat-content">
              <div className="chat-headers">
                <h3>{chat.username}</h3>
                <span className="time">5:20</span>
              </div>
              <p className="last-message">hellow world okay I will do it  fsda sdfjsd dfhkj ddsdd</p>
            </div>
          </div>
        ))}

        {/* Archived section divider */}
        <div className="date-divider">Archived</div>

        {/* Archived chats */}


        {/* Date divider */}
        <div className="date-divider">4/20/2025</div>
      </div>
    </div>






  );
}