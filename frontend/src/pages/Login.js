import React, {useEffect,useState} from 'react';
import axios from 'axios';
import {Form, Button, Alert } from 'react-bootstrap';
import Base from '../components/layouts/Base';
import BaseLayout from '../components/layouts/Base';
import '../styles/login.css';
import {useNavigate} from "react-router-dom";

function Login({setUser}){
  const [form, setForm] = useState({username:"",password:""});

  const handleChange = (e) =>{
    setForm({ ...form, [e.target.name]: e.target.value});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post("/api/login",form);

      console.log(response.data)
      console.log(response.data.username)
      if(response.data.username){
        setUser(response.data);
          window.location.href="/board"



      }else{
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");

      }

        
    
    }catch(error){
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
        
        
          <Button className="w-100" variant="primary" type="submit">
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
      </Form>
     
    </div>
        </BaseLayout>
    )
}

export default Login;