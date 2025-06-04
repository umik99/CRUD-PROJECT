import React, { useEffect, useState } from "react";
import axios from 'axios';

import '../styles/mainpage.css';
import  osakaImg from '../img/오사카.jpeg';
import  tokyoImg from '../img/도쿄.jpeg';
import  fukuokaImg from '../img/후쿠오카.jpeg';
import  hokkaidoImg from '../img/홋카이도.jpeg';
import others from '../img/기타.jpeg';
import defaultIMG from '../img/default_profile.png';
import { baseProfileImageUrl } from "../config/APIConfig";
import { backendURL } from "../config/APIConfig";

export default function MainPage() {
  const isLoggedIn = false;
  const [boardList, setBoardList] = useState([]);
  const [commentedBoardList, setCommentedBoardList] =useState([]);

  const categories = [
    { title: "오사카", image: osakaImg, link: "/board/osaka" },
    { title: "도쿄", image: tokyoImg, link: "/board/tokyo" },
    { title: "후쿠오카", image: fukuokaImg, link: "/board/fukuoka" },
    { title: "홋카이도", image: hokkaidoImg, link: "/board/hokkaido" },
    // ...
  ];    


  

 

    useEffect(() =>{
          

      axios.get(`${backendURL}/api/board/main/recentBoards`)
      .then(response=>{
          
          setBoardList(response.data || []);


      })
      .catch(error =>{
          console.error("Error Fetching Board Data: ",error);
      });
  },[]);


  useEffect(() =>{
          

    axios.get(`${backendURL}/api/comment/main/recentCommentedBoards`)
    .then(response=>{
        
        setCommentedBoardList(response.data || []);


    })
    .catch(error =>{
        console.error("Error Fetching Board Data: ",error);
    });
},[]);


const isNew = (regDate) => {
  const created = new Date(regDate);
  const now = new Date();
  const diffInHours = (now - created) / (1000 * 60 * 60);
  return diffInHours <= 24;
};

  return (
  <div >
      <section className="intro-section">
      <h1>🍜 일본 여행 맛집, KULOG</h1>
      <p>여행자들이 직접 추천한 숨겨진 맛집을 지금 바로 만나보세요.</p>
    </section>
      <section className="category-list">
        {categories.map((cat, index) => (
          <a key={index} href={cat.link} className="category-item">
            <img src={cat.image} alt={cat.title} />
            <div className="text-content">
              <h2>{cat.title}</h2>
              <p> 유저들이 추천한 {cat.title}의 로컬 맛집을 확인해보세요.</p>
            </div>
          </a>
        ))}
          <a className="category-item" href="/board/etc">
            <img src={others} alt="기타" />
            <div className="text-content">
              <h2>기타 지역</h2>
              <p> 유저들이 추천한 일본 곳곳의 맛집을 확인해보세요.</p>
            </div>
          </a>
      </section>
      <section className="post-section">
        <div className="post-container">
          <div className="post-block">
            <h2>🆕 최근 게시글</h2>
            <ul className="list-unstyled">
  {boardList.map((board) => (
    <li key={board.bno} className="board-item shadow-sm p-3 mb-3 rounded bg-white">
      <a href={`/board/read/${board.bno}`} className="text-decoration-none text-dark d-block">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-1 fw-semibold"> {isNew(board.regDate) && (
                                                    <span className="badge bg-danger me-2">N</span> // 또는
                                                )}{board.title}</h5>
          <span className="text-muted small">조회수 : {board.viewCount}</span>
        </div>

        <div className="d-flex justify-content-start align-items-center gap-3 mt-2">
          <span className="text-danger small">
            💬 {board.replyCount}
          </span>
          <span className="text-danger small">
            ❤️ {board.likeCount}
          </span>
          <span className="text-muted small">
            
          <div className="d-flex align-items-center ">

                            <img
                                src={board.writerProfileImg? baseProfileImageUrl + board.writerProfileImg : defaultIMG}
                                alt="프로필"
                                className="rounded-circle mb-2 mx-2"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    objectFit: 'cover',
                                    border: '1.5px solid #dee2e6',
                                
                            }}
                            />
                          
                        {board.writer}
                        </div>          
                  </span>
        </div>
      </a>
    </li>
  ))}
</ul>
          </div>
          <div className="post-block">
            <h2>💬 최근에 댓글 달린 글</h2>
              <ul className="list-unstyled">
          {commentedBoardList.map((board) => (
            <li key={board.bno} className="board-item shadow-sm p-3 mb-3 rounded bg-white">
               <a href={`/board/read/${board.bno}`} className="text-decoration-none text-dark d-block">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-1 fw-semibold">  {isNew(board.regDate) && (
                                                    <span className="badge bg-danger me-2">N</span> // 또는
                                                )} {board.title}</h5>
                  <span className="text-muted small">조회수 : {board.viewCount}</span>
                </div>

                <div className="d-flex justify-content-start align-items-center gap-3 mt-2">
                  <span className="text-danger small">
                    💬 {board.replyCount}
                  </span>
                  <span className="text-danger small">
                    ❤️ {board.likeCount}
                  </span>
                  <span className="text-muted small">
                  
                   <div className="d-flex align-items-center ">

                                <img
                                    src={board.writerProfileImg? baseProfileImageUrl + board.writerProfileImg : defaultIMG}
                                    alt="프로필"
                                    className="rounded-circle mb-2 mx-2"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'cover',
                                        border: '1.5px solid #dee2e6',
                                    
                                }}
                                />
                              
                  {board.writer}
                  </div>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
          </div>
        </div>
      </section>








    </div>


  );
}