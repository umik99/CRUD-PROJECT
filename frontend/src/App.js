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
import Mypage from './pages/Mypage';
import NicknameChange from './pages/NicknameChange';
import PasswordChange from './pages/PasswordChange';
import ProfileImage from './pages/ProfileImage';
import UserBoardList from './pages/UserBoardList';
import MyBoardList from './pages/MyBoardList';
import DMWindow from './DM/DMWindow';
import { backendURL } from './config/APIConfig';

function App() {
  
  const [user, setUser] = useState(undefined);
  

  useEffect(() =>{
    
    axios.get(`${backendURL}/api/user`, {withCredentials:true})
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
        <Route path="/board/:category" element={<BaseLayout user={user}><Board user={user} /></BaseLayout>} />
        <Route path="/logout" element={<Logout setUser={setUser} />} />
        <Route path="/board/read/:bno" element={<BaseLayout user={user}> <BoardRead user = {user} /></BaseLayout>}/>
        <Route path="/register" element={<BaseLayout user={user}><Register user={user}/></BaseLayout>}></Route>
        <Route path="/modify/:bno" element={<BaseLayout user={user}> <Modify user = {user} /></BaseLayout>}/>
        <Route path="/bookmark" element= {<BaseLayout user={user}><Bookmark user ={user}></Bookmark></BaseLayout>}/>
        <Route path="/mypage" element= {<BaseLayout user={user}><Mypage user ={user} ></Mypage></BaseLayout>}/>
        <Route path="/mypage/nickname" element= {<BaseLayout user={user}><NicknameChange user={user}></NicknameChange></BaseLayout>}/>
        <Route path="/mypage/password" element= {<BaseLayout user={user}><PasswordChange user={user}></PasswordChange></BaseLayout>}/>
        <Route path="/mypage/profile-image" element= {<BaseLayout user={user}><ProfileImage user={user}></ProfileImage></BaseLayout>}/>
        <Route path="/board/list/:uuid" element= {<BaseLayout user={user}><UserBoardList/></BaseLayout>}/>
        <Route path="/mypage/myboards" element={<BaseLayout user={user}><MyBoardList user={user}></MyBoardList></BaseLayout>}></Route>

        <Route path="/dm" element={<DMWindow user={user}></DMWindow>}></Route>
        <Route path="/" element={<BaseLayout user={user}><MainPage/></BaseLayout>} />

      </Routes>
    )}
  </div>
)
} 

export default App;