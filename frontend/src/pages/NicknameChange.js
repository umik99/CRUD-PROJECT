

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import '../styles/mypage.css'; 
import { redirect, useNavigate } from 'react-router-dom';
import { backendURL } from '../config/APIConfig';


const NicknameChange = ({ user, onSubmit }) => {

  const navigate = useNavigate();

 
  
  
  const [nickname, setNickname] = useState(user?.nickname||null);
  const [message, setMessage] = useState('');

useEffect(() => {
  if (!user) {
    alert("로그인이 필요합니다.");

    navigate('/login');
  }
}, [user]);
 


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
    
        const response = await axios.patch(
            `${backendURL}/api/mypage/nickname`,
            {nickname},
            {withCredentials:true}
            
        )
       


        setMessage('닉네임이 성공적으로 변경되었습니다.');
        window.location.href="/mypage";

    } catch (error) {
      setMessage('닉네임 변경 실패');
    }
  };

  
  return (
    <Container className="mypage-container">
      <h3 className="mypage-title">닉네임 변경</h3>

      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group className="mb-3">
          <Form.Label>새 닉네임</Form.Label>
          <Form.Control
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </Form.Group>

        {message && <div className="text-muted mb-2">{message}</div>}

        <Button type="submit" className="menu-button">닉네임 변경</Button>
      </Form>
    </Container>
  );
};

export default NicknameChange;
