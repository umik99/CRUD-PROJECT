

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import '../styles/mypage.css'; 
import { redirect, useNavigate } from 'react-router-dom';
import { baseProfileImageUrl } from '../config/APIConfig';
import defaultImage from '../img/default_profile.png';
import { backendURL } from '../config/APIConfig';

const ProfileImage = ({ user, onSubmit }) => {

  const navigate = useNavigate();

 

  
  const [newFile, setNewFile] = useState(null);
  const [resetToDefault, setResetToDefault] = useState(false);
  
  const [message, setMessage] = useState('');

  
useEffect(() => {
  if (!user) {
    alert("로그인이 필요합니다.");

    navigate('/login');
  }
}, [user]);
 
const handleGoBack = () => {
        window.location.href='/mypage';
    };


  
  
  return (

<Container className="mypage-container text-center">
  <h3 className="mypage-title">프로필 이미지 변경</h3>


  <Form.Group className="mb-3">
  <Form.Control
    type="file"
    id="profile-upload"
    accept="image/*"
    multiple={false}
    style={{ display: 'none' }}
    onChange={(e) => {
      setNewFile(e.target.files[0]);
      setResetToDefault(false);
    }}
  />
  <div>
      <img
        src={
          resetToDefault
      ? defaultImage
      : newFile
        ? URL.createObjectURL(newFile)
        : user?.profileImage
          ? baseProfileImageUrl + user.profileImage
          : defaultImage
        }
        alt="프로필 이미지"
        className="profile-preview"
      />
    </div>

<div className="d-flex justify-content-center gap-3 mt-3 profile-button-group">
  <label htmlFor="profile-upload"   className="btn btn-outline-secondary btn-sm custom-btn mb-0"
>
    이미지 선택
  </label>

  <Button
    variant="outline-danger"
    size="sm"
    className="custom-btn"
    onClick={() => {
      setResetToDefault(true);
      setNewFile(null);
    }}
  >
    기본으로 설정
  </Button>
</div>
</Form.Group>



  {/* 저장 버튼 */}
  <Button
    variant="primary"
    size="sm"
    className='mt-3 menu-button'
    onClick={async () => {
      try {
        if (resetToDefault) {
          await axios.delete(`${backendURL}/api/mypage/profile-image`, { withCredentials: true });
          setMessage('기본 이미지로 변경되었습니다.');
        } else if (newFile) {
          const formData = new FormData();
          formData.append('file', newFile);

          await axios.patch(`${backendURL}/api/mypage/profile-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
        
          });
          console.log(user)
          setMessage('프로필 이미지가 변경되었습니다.');
        } else {
          setMessage('변경 사항이 없습니다.');
        }
      } catch (err) {
        setMessage('변경 실패');
        console.error(err);
      }
    }}
  >
    저장
  </Button>

  <Button 
    variant="primary"
    size="sm"
    className='mt-3 menu-button'
    onClick={handleGoBack}
    >
    뒤로가기
  </Button >

  {/* 메시지 */}
  {message && <div className="text-muted mt-3">{message}</div>}
</Container>

    
  );
};

export default ProfileImage;
