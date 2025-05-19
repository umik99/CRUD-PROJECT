import React, {useEffect,useState} from 'react';
import axios from 'axios';
import {Form, Button, Accordion, Container, Row, Col, Pagination} from 'react-bootstrap';

import '../styles/board.css';
import {useNavigate, useSearchParams,useParams, useLocation} from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css'; // 이거 꼭 import 해야 함
import { FaArrowLeft } from "react-icons/fa";




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


function Bookmark(user){

    
    const [bookmarkList, setBookmarkList] = useState([]);
    const [end, setEnd] = useState(1);
    const [start, setStart] = useState(1);
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(true);
    const [currentPage , setCurrentPage] = useState(1);
    
    const [selectMode, setSelectMode] = useState(false);
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    
    



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
        
    

        axios.get(`/api/bookmark/list`, 
            {
                params: {
                    page:currentPage,
                    size: 10},
                  
            withCredentials: true
          })
        .then(response => {
            
            
            setBookmarkList(response.data.dtoList||[]);

            setEnd(response.data.end);
            setStart(response.data.start);
            setNext(response.data.next);
            setPrev(response.data.prev);
        })
        .catch(error => {
            
          console.error("댓글 데이터 요청 중 오류:", error);
        });
    },[currentPage]);
      
      


    /* 북마크 수정하기 */
    const toggleSelectMode = () =>{
        setSelectMode(!selectMode);
        setSelected([]);
        setSelectAll(false);
        console.log(selectMode);
    };

    const toggleSelect = (bno) =>{
        setSelected(prev =>
            prev.includes(bno) ? prev.filter(id => id !==bno ) : [...prev , bno]

        );
    };

    const handleSelectAll = () =>{
        if(!selectAll){
            setSelected(bookmarkList.map (b => b.bno));

        }else{
            setSelected([]);
        }
        setSelectAll(!selectAll);
    };

    const handleDelete = () =>{
        axios.post(`/api/bookmark/delete`, selected, {
            withCredentials:true,
        })
        .then(() =>{
            setBookmarkList(prev => prev.filter(item => !selected.includes(item.bno)))
            setSelected([]);
        })
        .catch(err =>{
            console.error("삭제 실패",err);
        });

    }

    return(
        <Container className="w-75 mt-4 border flex-column rounded board">
     
            <h2 className="text-center">Bookmarks</h2>

        
       {selectMode && (
            <div className="d-flex justify-content-between align-items-center mb-3">
                {/* 왼쪽: 전체 선택 */}
                <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="selectAll"
                    checked={selectAll}
                    onChange={handleSelectAll}
                />
                <label className="form-check-label ms-2" htmlFor="selectAll">
                    전체 선택
                </label>
                </div>

                {/* 오른쪽: 편집 버튼 */}
                <button
                className="btn btn-sm btn-outline-secondary"
                onClick={toggleSelectMode}
                >
                완료
                </button>
            </div>
        )}

        {!selectMode && (
            <div className="d-flex justify-content-end mb-3">
                <button
                className="btn btn-sm btn-outline-secondary"
                onClick={toggleSelectMode}
                >
                편집
                </button>
            </div>
        )}


        {bookmarkList.map((board) => (
                <div key={board.bno} className="bookmark-item d-flex flex-column py-3 border-bottom">
                {/* 제목 + 댓글 + 좋아요 */}
                <div className="d-flex justify-content-between align-items-center">
                <div className= "d-flex align-items-start">
                {selectMode && (
                    <input
                    type="checkbox"
                    checked={selected.includes(board.bno)}
                    onChange={() => toggleSelect(board.bno)}
                    className="form-check-input me-2"
                    />
                )}

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
                    {board.writer} &nbsp; | &nbsp;  {formatDate(board.regDate)}
                    </div>
                </div>
            </div>
            ))}

        {selectMode && selected.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="text-muted small">선택된 항목: {selected.length}개</span>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>삭제하기</button>
        </div>
      )}
        
        
        <div className="mt-5 d-flex justify-content-center">
                                
            <Pagination className='custom-pagination'>{pages}</Pagination>
            <br/>
        </div>
            
            
        
        
        </Container>
        
    );

}

export default Bookmark
