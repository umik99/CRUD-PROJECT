import React, { useEffect, useState } from "react";
import DMContactList from "./DMContactList";
import DMChatRoom from "./DMChatRoom";
import { Container } from "react-bootstrap";
import '../styles/Dm.css';

export default function DMWindow({user}) {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  // 1. URL파라미터로 receiverId 읽어서 contacts 불러올 때 파라미터로 전달
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const receiverId = params.get("receiverId");
    fetch(`/api/message/contacts${receiverId ? `?receiverId=${receiverId}` : ""}`)
      .then(res => {
     
      return res.json();
    })
      .then(data => {
        console.log(data)
        setContacts(data);
        // 2. receiverId 있으면 바로 채팅창 선택
        if (receiverId) setSelectedContact(Number(receiverId));
      });
  }, []);


  useEffect(() => {
  function onLogoutEvent(e) {
    if (e.key === "logout-event") {
      alert("로그인이 필요합니다.");
      window.close();
    }
  }
  window.addEventListener("storage", onLogoutEvent);
  return () => window.removeEventListener("storage", onLogoutEvent);
}, []);

  useEffect(() => {
  const interval = setInterval(() => {
    fetch("/api/check") 
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          alert("로그인이 필요합니다.");
          window.close();
        }
      });
  }, 3000);
    return () => clearInterval(interval);
  },[]);
   

   useEffect(() =>{
          if (!user ){
              
              alert("로그인이 필요합니다.");
              window.close();
          }
  
      },[user]);

    
  return (
    <div>

    <h2 className="text-center">1:1 채팅</h2>
    <div style={{ display: "flex", height: "600px", width: "700px" }}>
      <DMContactList
        contacts={contacts}
        selectedContact={selectedContact}
        onSelect={setSelectedContact}
      />
      <DMChatRoom
        contact={contacts.find(c => c.userid === selectedContact)}
        selectedContactId={selectedContact}
      />
    </div>
    
    </div>
  );
}
