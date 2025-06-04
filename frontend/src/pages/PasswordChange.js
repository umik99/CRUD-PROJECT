

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import '../styles/mypage.css'; 
import { redirect, useNavigate } from 'react-router-dom';
import { backendURL } from '../config/APIConfig';


const PasswordChange = ({ user, onSubmit }) => {

  const navigate = useNavigate();

 
  
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');

useEffect(() => {
  if (!user) {
    alert("로그인이 필요합니다.");

    navigate('/login');
  }
}, [user]);
 



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
    setMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
    }else if(newPassword == currentPassword){
        setMessage('현재 비밀번호와 새 비밀번호가 일치합니다.');
        return;
    }

    try {
    
    
        const response = await axios.patch(
            `${backendURL}/api/mypage/password`,
            {   currentPassword: currentPassword,
                newPassword:newPassword},
            {withCredentials:true}
            
        )
       


        setMessage('비밀번호가 성공적으로 변경되었습니다.');
        window.location.href="/mypage";

    } catch (error) {
      setMessage('현재 비밀번호가 일치하지 않습니다.');
    }
  };

  
  return (
    <Container className="mypage-container">
      <h3 className="mypage-title">비밀번호 변경</h3>

      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group className="mb-3">
          <Form.Label>현재 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </Form.Group>
         <Form.Group className="mb-3">
          <Form.Label>새 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
         <Form.Group className="mb-3">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) =>setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        {message && <div className="text-muted mb-2">{message}</div>}

        <Button type="submit" className="menu-button">비밀번호 변경</Button>
      </Form>
    </Container>
  );
};

export default PasswordChange;
