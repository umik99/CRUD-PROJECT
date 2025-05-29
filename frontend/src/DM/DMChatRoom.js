import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function formatDate(sendAt) {
  if (!sendAt) return "";
  const date = new Date(sendAt);

  const MM = ("0" + (date.getMonth() + 1)).slice(-2);
  const dd = ("0" + date.getDate()).slice(-2);
  const HH = ("0" + date.getHours()).slice(-2);
  const mm = ("0" + date.getMinutes()).slice(-2);

  return `${MM}월${dd}일 ${HH}시${mm}분`;
}

export default function DMChatRoom({ contact, selectedContactId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);



  useEffect(() => {
    if (selectedContactId) {
      axios.get(`/api/message/history/${selectedContactId}`)
        .then(res => {

        return setMessages(res.data)});
    
    }
  }, [selectedContactId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedContactId) return;
    await axios.post("/api/message/send", {
      receiverId: selectedContactId,
      content: input.trim()
    });
    setInput("");
    const res = await axios.get(`/api/message/history/${selectedContactId}`);
    setMessages(res.data);
  };

if (!contact) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#999", fontSize: "1.1em"
      }}>
        대화 상대를 선택하세요.
      </div>
    );
  }
  return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        flex: 1, overflowY: "auto", padding: 16, background: "#f6f8fa",
        display: "flex", flexDirection: "column"
      }}>
        {messages.map((msg,i) => {

          const isMine = msg.senderId !== contact.userid; // 내가 보낸 메시지

          const curTime = formatDate(msg.sendAt);
          const prevMsg = messages[i-1];
          const prevTime = prevMsg ? formatDate(prevMsg.sendAt) : null;
          const showTime = curTime !== prevTime || i === messages.length-1;

          const align = isMine ? "flex-end" : "flex-start";
          const balloonColor = isMine ? "#d0e9ff" : "#f0f0f0";

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: align,
                margin: "8px 0"
              }}>
              <div style={{
                background: balloonColor,
                padding: "10px 15px",
                borderRadius: "16px",
                minWidth: "60px",
                maxWidth: "70%",
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                wordBreak: "break-all",
                fontSize: "1em",
              }}>
                {msg.content}
              </div>
              {showTime && (
              <div style={{
                fontSize: "0.83em", color: "#888", marginTop: 3, display: "flex", alignItems: "center", gap: 6
              }}>
                {curTime}
                {/* 내 메시지에만 읽음/안읽음 표시 */}
                
                {isMine && (
                  <span style={{ color: msg.isRead ? "#0b8" : "#888" }}>
                    {msg.isRead ? "읽음" : "안읽음"}
                  </span>
                )}
              </div>
              )}
            </div>

          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{
        padding: 12, borderTop: "1px solid #eee", background: "#fff", display: "flex"
      }}>
        <input
          value={input}
          disabled={contact.isDeleted}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
          style={{
            flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: "1em"
          }}
          placeholder={contact.isDeleted ? "탈퇴한 사용자에게는 메시지를 보낼 수 없습니다." : ""}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || !selectedContactId || contact.isDeleted}
          style={{
            marginLeft: 10, padding: "8px 22px", borderRadius: 8, border: "none",
            background: "#2471f5", color: "#fff", fontWeight: "bold", fontSize: "1em"
          }}>
          전송
        </button>
      </div>
    </div>
  );
}