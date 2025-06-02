import React, { useEffect,useState} from 'react';
import axios from 'axios';
import {Form, Button, Accordion, Container, Row, Col, Pagination} from 'react-bootstrap';

import '../styles/board.css';
import {useNavigate, useSearchParams,useParams, useLocation} from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css'; // 이거 꼭 import 해야 함
import { FaArrowLeft } from "react-icons/fa";
import defaultIMG from '../img/default_profile.png';
import { baseProfileImageUrl } from '../config/APIConfig';




const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date).replace(/\./g, '-').replace(/\s/g, '');
  };


function UserBoardList(){

    
    const [boardList, setBoardList] = useState([]);
    const [end, setEnd] = useState(1);
    const [start, setStart] = useState(1);
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(true);
    const [currentPage , setCurrentPage] = useState(1);
    
    const {uuid} = useParams();

    
    const navigate = useNavigate();



    /* 페이지처리 */
    let pages=[];   
        pages.push(
            <Pagination.Prev disabled={prev===false}
            onClick={() => handlePageChange(start-1)}/>
        )
        for(let i=start;i<=end;i++){

            
            
            pages.push(
                <Pagination.Item key={i} active={i === currentPage}
                onClick = {() => handlePageChange(i)}>
                {i}
                </Pagination.Item>,
            );
        }
        pages.push(
            <Pagination.Next disabled={next===false}
                onClick={() =>handlePageChange(end+1)}
            />
        )
        //페이지 변경 처리
        const handlePageChange = (pageNumber) =>{
            setCurrentPage(pageNumber);
            
        }
    
         

    useEffect (() =>{
        
    

        axios.get(`/api/board/list/${uuid}`, 
            {
                params: {
                    page:currentPage,
                    size: 10,
                   
                },
                  
            withCredentials: true
          })
        .then(response => {
            
            
            setBoardList(response.data.dtoList||[]);

            setEnd(response.data.end);
            setStart(response.data.start);
            setNext(response.data.next);
            setPrev(response.data.prev);
        })
        .catch(error => {
            
          console.error("댓글 데이터 요청 중 오류:", error);
        });
    },[currentPage]);
      
      


   

    return(
        <Container className="w-75 mt-4 border flex-column rounded board">
     
    <h2 className="text-center">작성글 목록</h2>

        


        {boardList.map((board) => (
                <div key={board.bno} className="bookmark-item d-flex flex-column py-3 border-bottom">
                {/* 제목 + 댓글 + 좋아요 */}
                <div className="d-flex justify-content-between align-items-center">
                <div className= "d-flex align-items-start">
           

                    <a
                    href={`/board/read/${board.bno}`}
                    style={{ textDecoration: 'none', color: '#212529' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >                    
                        <span>{board.title} </span>
                        <span className="text-danger">[{board.replyCount}]</span>
                            <span className="text-danger fw-bold ms-2" style={{ fontSize: "12px" }}>
                                <i className="bi bi-heart-fill me-1 " ></i>
                                {board.likeCount}
                            </span>     
                    </a>
                    </div>
                    <div className="text-muted small">
                    
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
                              
                  {board.writer} &nbsp; | &nbsp;  {formatDate(board.regDate)}
                  </div>  
                    </div>
                </div>
            </div>
            ))}

     
        
        
        <div className="mt-5 d-flex justify-content-center">
                                
            <Pagination className='custom-pagination'>{pages}</Pagination>
            <br/>
        </div>
            
            
        
        
        </Container>
        
    );

}

export default UserBoardList
