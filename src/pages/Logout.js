import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    axios.post("/api/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null); // 🔥 유저 상태 초기화
        navigate("/board"); // 🔥 로그인 페이지로 이동
      })
      .catch(error => console.error("Logout failed:", error));
  }, [setUser, navigate]);

  return <p>Logging out...</p>;
}

export default Logout;