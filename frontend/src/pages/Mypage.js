import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/mypage.css';
import defaultIMG from '../img/default_profile.png';

export default function Mypage({ user }) {

  const navigate = useNavigate();
  const baseImageUrl = "http://localhost:8080/uploads/profiles/";


  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, navigate]);

  const menuItems = [
    { label: '작성글 보기', path: '/mypage/myboards' },
    { label: '프로필 사진 변경', path: '/mypage/profile-image' },
    { label: '닉네임 변경', path: '/mypage/nickname' },
    { label: '비밀번호 변경', path: '/mypage/password' },
  ];

  const handleDelete = async () => {
    
    if (!window.confirm("탈퇴하시겠습니까?")) return;

    try {
      await axios.delete("/api/mypage/delete-user", { withCredentials: true });
      alert("회원 탈퇴가 완료되었습니다.");
    window.location.replace("/");
    } catch (err) {
      alert("회원 탈퇴 실패: " + (err.response?.data || err.message));
    }
  };


  return (
    <Container className="mypage-container">
      <h3 className="mypage-title">마이페이지</h3>
      <img
        src={user?.profileImage ? baseImageUrl + user.profileImage : defaultIMG}
        alt="프로필"
        className="profile-image"
      />
      <h4 className="nickname">{user?.nickname || ''}</h4>

      {/* 메뉴 버튼들 */}
      {menuItems.map((item) => {
        // 닉네임/비밀번호 변경은 소셜 계정이면 비활성화
        const isSocial = user?.oauthProvider === "SOCIAL";
        const isDisabled =
          isSocial && (item.label === "닉네임 변경" || item.label === "비밀번호 변경");

        return (
          <span key={item.path} className="menu-link d-block mb-2">
            <Link
              to={isDisabled ? "#" : item.path}
              tabIndex={isDisabled ? -1 : 0}
              style={{
                pointerEvents: isDisabled ? "none" : "auto",
                textDecoration: "none"
              }}
            >
              <Button
                variant="outline-secondary"
                className="menu-button"
                disabled={isDisabled}
                style={isDisabled ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              >
                {item.label}
              </Button>
            </Link>
          </span>
        );
      })}

      <Button 
        
        className='delete-button'
        onClick={handleDelete} variant='danger'>
        회원 탈퇴
      </Button>
    </Container>
  );
}
