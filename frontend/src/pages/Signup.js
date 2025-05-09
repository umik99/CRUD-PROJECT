import React, {useEffect,useState} from 'react';
import axios from 'axios';
import {Form, Button, Alert } from 'react-bootstrap';
import Base from '../components/layouts/BaseLayout';
import BaseLayout from '../components/layouts/BaseLayout';
import '../styles/login.css';
import {useNavigate} from "react-router-dom";

function Signup(){

  const [form, setForm] =useState({username:"", password:""});

  const handleChange= (e) =>{
    setForm({...form ,[e.target.name]:e.target.value});
  }

  const handleSubmit= async(e) =>{
    e.preventDefault();
    try{
        await axios.post("/api/signup", form);
        alert("회원가입 성공! 로그인하세요.");
        window.location.href = '/login';

        

    }catch(error){
        console.log(error);
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
       
        <div className="h4 mb-2 text-center">SIGN UP</div>
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
        <Form.Group className="mb-4" controlId="password">
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