// /frontend/src/App.js

import axios from 'axios';
import './App.css';
import {Routes, Route} from 'react-router-dom'
import {useEffect, useState} from "react";
import Board from './pages/Board';
import BoardRead from './pages/BoardRead';
import Login from './pages/Login';
import Signup from'./pages/Signup';
import Logout from './pages/Logout';
import BaseLayout from './components/layouts/BaseLayout';
import Register from './pages/Register';
import Modify from './pages/Modify';
import MainPage from './pages/MainPage';
import Bookmark from './pages/Bookmark';


function App() {
  
  const [user, setUser] = useState(undefined);

  useEffect(() =>{
    
    axios.get("/api/user")
    .then(response => {
      
      setUser(response.data)
    })
    .catch( error =>{
      if(error.response && error.response.status == 401){
        setUser(null);
      }
    });

  },[]);

 

  
  return(
    <div>
    {user === undefined  ? (  
      <p>로딩 중...</p>  // 🔥 user 값이 설정될 때까지 로딩 표시
    ) : (
      <Routes >
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/board/:category" element={<BaseLayout user={user}><Board /></BaseLayout>} />
        <Route path="/logout" element={<Logout setUser={setUser} />} />
        <Route path="/board/read/:bno" element={<BaseLayout user={user}> <BoardRead user = {user} /></BaseLayout>}/>
        <Route path="/register" element={<BaseLayout user={user}><Register user={user}/></BaseLayout>}></Route>
        <Route path="/modify/:bno" element={<BaseLayout user={user}> <Modify user = {user} /></BaseLayout>}/>
        <Route path="/bookmark" element= {<BaseLayout user={user}><Bookmark user ={user}></Bookmark></BaseLayout>}/>
        <Route path="/" element={<BaseLayout user={user}><MainPage/></BaseLayout>} />

      </Routes>
    )}
  </div>
)
} 

export default App;