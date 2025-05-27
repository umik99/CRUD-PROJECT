import React, {useEffect,useState} from 'react';
import axios from 'axios';
import {Form, Button, Alert } from 'react-bootstrap';
import Base from '../components/layouts/BaseLayout';
import BaseLayout from '../components/layouts/BaseLayout';
import '../styles/login.css';
import {useNavigate} from "react-router-dom";

function Signup(){

  const [errorMsg, setErrorMsg] = useState('');
const allowedRegex = /^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]*$/;

  
const [form, setForm] = useState({
  username: "",
  password: "",
  confirmPassword: ""
});
const [pwWarning, setPwWarning] = useState(""); // 경고 메시지

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "password" || name === "confirmPassword") {
    if (!allowedRegex.test(value)) {
      setPwWarning("영어, 숫자, 특수문자만 입력 가능합니다.");
      // 입력은 그대로 반영 (or return으로 무시하려면 아래 주석 해제)
      // return;
    } else {
      setPwWarning(""); // 경고 없애기
    }
  }

  setForm((prev) => ({
    ...prev,
    [name]: value
  }));
};

  const handleSubmit= async(e) =>{
    e.preventDefault();
    setErrorMsg('');

    if (form.password !== form.confirmPassword) {
    setErrorMsg("비밀번호가 일치하지 않습니다.");
    return;
  }

    try{
        await axios.post("/api/signup", form);
        alert("회원가입 성공! 로그인하세요.");
        window.location.href = '/login';

        

    }catch(error){
    if (error.response && error.response.status === 409) {
      // 서버에서 409 Conflict 반환 시
      setErrorMsg("이미 존재하는 사용자명입니다.");
    } else {
      setErrorMsg("회원가입 중 오류가 발생했습니다.");
    }
    
    }

  };

  const navigate = useNavigate();

  const naviagteToLogin = () =>{
    navigate("/login");
  };

  
  

  
  

    return (
        <BaseLayout>

<div
      className="sign-in__wrapper mt-5"
    >
      
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
       
        <div className="h4 mb-2 text-center">회원가입</div>
        {/* ALert */}

      {errorMsg && (
        <div className="text-danger mt-2">{errorMsg}</div>
      )}
    
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </Form.Group>
         <Form.Group className="mb-4" controlId="password">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
          </Form.Group>
    

        <Button className="w-100" variant="primary" type="submit">
            Sign up
        </Button>

         
    
        <div className="d-grid justify-content-center mt-2" >
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={naviagteToLogin}
          >
            로그인
          </Button>
        </div>
      </Form>
     
    </div>
        </BaseLayout>
    )
}

export default Signup;