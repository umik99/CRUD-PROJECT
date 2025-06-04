import React, {useEffect,useState} from 'react';
import axios from 'axios';
import {Form, Button, Alert } from 'react-bootstrap';
import Base from '../components/layouts/BaseLayout';
import BaseLayout from '../components/layouts/BaseLayout';
import '../styles/login.css';
import {useNavigate} from "react-router-dom";
import { backendURL } from '../config/APIConfig';

function Login({setUser}){
  const [form, setForm] = useState({username:"",password:""});

  const handleChange = (e) =>{
    setForm({ ...form, [e.target.name]: e.target.value});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post(`${backendURL}/api/login`,form,{
        withCredentials:true,
        headers:{
          "Content-Type": "application/json"
        },
        maxRedirects:0
      });


      
      setUser(response.data);
        window.location.replace("/");



    
        
    
    }catch(error){
      alert(error.response.data);

      console.error(error);
    }
  };


  const navigate = useNavigate();

  const naviagteToSignup = () =>{
    navigate("/signup");
  };


    return (
        <BaseLayout>

      <div
            className="sign-in__wrapper mt-5"
          >
      
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
            {/* Header */}
          
            <div className="h4 mb-2 text-center">LOG IN</div>
            {/* ALert */}
      
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
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              </Form.Group>
          
          
            <Button className="mt-3 w-100" variant="primary" type="submit">
              Log In    
            </Button>

            
          <div className="mt-2 d-grid justify-content-center">
            <Button
              className="text-muted px-0"
              variant="link"
              onClick={naviagteToSignup}
            >
              회원가입
            </Button>
            
          </div>
              <div className='d-grid text-align-center justify-content-center mt-4'>
                    <a href={`${backendURL}/oauth2/authorization/google`} style={{ textDecoration: 'none' }}>
                      <button
                        type="button"
                        className="btn btn-light border d-flex align-items-center gap-2"
                        style={{
                          padding: '10px 20px',
                          fontSize: '16px',
                          width: '240px'  // 🔥 버튼 너비 통일
                        }}
                      >
                        <img
                          src="https://developers.google.com/identity/images/g-logo.png"
                          alt="Google 로고"
                          style={{ width: '20px', height: '20px' }}
                        />
                        Google 계정으로 로그인
                      </button>
                    </a>
                </div>

                <div className='d-grid justify-content-center mt-3'>
                    <a href={`${backendURL}/oauth2/authorization/kakao`} style={{ textDecoration: 'none' }}>
                      <button
                        type="button"
                        className="btn btn-warning border d-flex align-items-center gap-2"
                         style={{
                          padding: '10px 20px',
                          fontSize: '16px',
                          color: 'black',
                          backgroundColor: '#FEE500',
                          borderColor: '#FEE500',
                          width: '240px'  // 🔥 버튼 너비 통일
                        }}
                      >
                        <img
                          src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
                          alt="Kakao 로고"
                          style={{ width: '20px', height: '20px' }}
                        />
                        카카오 계정으로 로그인
                      </button>
                    </a>
              </div>
      </Form>
            
            
          
      </div>
        </BaseLayout>
    )
}

export default Login;