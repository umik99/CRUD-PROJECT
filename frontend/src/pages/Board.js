import React, {useEffect,useState} from 'react';
import axios from 'axios';
import {Form, Button, Accordion, Container, Row, Col, Pagination, Dropdown} from 'react-bootstrap';

import '../styles/board.css';
import {useNavigate, useSearchParams,useParams, useLocation} from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css'; // 이거 꼭 import 해야 함
import { FaArrowLeft } from "react-icons/fa";
import defaultIMG from '../img/default_profile.png'
import WriterPopoverProfile from '../components/WriterPopoverProfile';


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


function Board({user}){
  
    const {category} = useParams();

    const [searchParams,setSearchParams] = useSearchParams();
    const typeFromURL = searchParams.get("type")|| "t";
    const keywordFromURL = searchParams.get("keyword") || "";
    const currentPage = parseInt(searchParams.get("page")) || 1; 

    const baseImageUrl = "http://localhost:8080/uploads/profiles/";

    const location = useLocation(); 

    const [type, setType] = useState(typeFromURL);
    const [keyword, setKeyword] = useState(keywordFromURL);
    const [boardList, setBoardList] = useState([]);
    const [end, setEnd] = useState(1);
    const [start, setStart] = useState(1);
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(true);
    

    const [openMenuBno, setOpenMenuBno] = useState(null);

    
  

    useEffect(() =>{
        
        setKeyword(keywordFromURL)

        axios.get(`/api/board/${category}/list`, {
            params:{/*
                type:searchParams.type,
                keyword:searchParams.keyword,
                */
                type:typeFromURL,
                keyword:keywordFromURL,
                page:currentPage,
               
            }
            
        })
        .then(response=>{
            
            setBoardList(response.data.dtoList || []);
            setEnd(response.data.end);
            setStart(response.data.start);
            setNext(response.data.next);
            setPrev(response.data.prev);
            
            console.log(response.data)
    

        })
        .catch(error =>{
            console.error("Error Fetching Board Data: ",error);
        });
    },[location]);






   
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
  //      setCurrentPage(pageNumber);
        setSearchParams({type:typeFromURL,keyword:keywordFromURL,page:pageNumber});
    }


    const navigate= useNavigate();

    const handleClick = (bno) =>{
        navigate(`/board/read/${bno}`)
    }

    const handleSearch = (e) =>{
        e.preventDefault();
        
        setSearchParams({type,keyword, page:1})
        

    }

    const handleGoBack = () => {
        window.history.back();
    };
    
    const isNew = (regDate) => {
        const created = new Date(regDate);
        const now = new Date();
        const diffInHours = (now - created) / (1000 * 60 * 60);
        return diffInHours <= 24;
      };
  
    
    return (
            <Container className="mt-4 border rounded board">
                    
                        
                        <Row className="  d-flex  mt-4 align-items-center  mb-4 text-center">
                            
                                {/* 첫 번째 컬럼: 번호 */}
                                <Col className=" text-center" xs={2}  >
                                      조회수
                                </Col>

                                {/* 두 번째 컬럼: 제목 */}
                                <Col xs={5}className="text-center ">
                                    제목
                                    
                                </Col>

                                {/* 세 번째 컬럼: 작성자 */}
                                <Col xs={2} className="text-center pe-5 ">
                                    작성자
                                    
                                </Col>

                                {/* 네 번째 컬럼: 날짜 */}
                                <Col  xs={3} className="text-center">
                                    등록일
                                </Col>
                        </Row>
                
                    
                    {boardList.map((board,index) =>(


                    <Accordion defaultActiveKey="null" flush >
                     <Accordion.Item eventKey={index.toString()} key={board.bno} className="mb-3 rounded border-0 shadow-sm accordion-item-custom">
                     <Accordion.Header className="border">
                                        
                            <Row className="w-100 d-flex align-items-center text-center spread-underline">
                                                {/* 첫 번째 컬럼: 번호 */}
                                                <Col xs={2} className="pe-5 text-center">
                                                    {board.viewCount}
                                                </Col>

                                                {/* 두 번째 컬럼: 제목 */}
                                                <Col
                                                    xs={5}
                                                    className="text-center title-col"
                                                    onClick={() => handleClick(board.bno)}>
                                                {isNew(board.regDate) && (
                                                    <span className="badge bg-danger me-2">N</span> // 또는
                                                )}
                                                    <span >{board.title} </span>
                                                    <span className="text-danger">[{board.replyCount}]</span>
                                                    <span className="text-danger fw-bold ms-2" style={{ fontSize: "12px" }}>
                                                        <i className="bi bi-heart-fill me-1 " ></i>
                                                        {board.likeCount}
                                                    </span>                                
                                                </Col>

                                                {/* 세 번째 컬럼: 작성자 */}
                                                <Col xs={2} className="text-center">

                                                        <div className="d-flex align-items-center ">
                                                    
                            
                                                            <WriterPopoverProfile
                                                                    key={board.bno}
                                                                    board={board}
                                                                    user={user}
                                                                    baseImageUrl={baseImageUrl}
                                                                    defaultIMG={defaultIMG}
                                                                    isMenuOpen={openMenuBno === board.bno}
                                                                    onOpenMenu={() => setOpenMenuBno(board.bno)}
                                                                    onCloseMenu={() => setOpenMenuBno(null)}/>
                                                        </div>
                                                </Col>

                                                {/* 네 번째 컬럼: 날짜 */}
                                                <Col xs={3} className="text-center">
                                                    {formatDate(board.regDate)}
                                                </Col>
                                        </Row>
                        </Accordion.Header>
                        <Accordion.Body>
                        <div style={{
                        display: 'flex',
                        gap: '10px',
                        overflowX: 'auto',   // 가로 스크롤
                        padding: '10px'
                            }}>
                        {board.files.map(file => (
                            <div
                                key={file.savedName}
                                style={{
                                    flex: '0 0 auto',
                                    width: '200px',
                                    height: '200px',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.1s ease',
                                }}
                            >
                                <img
                                    src={`http://localhost:8080/uploads/thumbnails/${file.savedName}`}
                                    alt={file.savedName}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                       </Accordion.Body>
                     </Accordion.Item>
                     
                   </Accordion>
                    ))}
                  <div className='mt-3 container'>
                  </div>
                  <div className="mt-4 mb-4">
                        <Form className="search-form" onSubmit={handleSearch}>
                            <a href={`/register?category=${category}`} className="write-button">
                                게시글 작성
                            </a>


                            <div className="search-box">

                                <select
                                    className="search-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}>
                                    <option value="t">제목</option>
                                    <option value="c">내용</option>
                                    <option value="u">작성자</option>
                                </select>
                                <input
                                    type="text"
                                    className="search-input"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="검색어 입력"
                                />
                                <button type="submit" className="search-button">🔍</button>
                                </div>

                            <button type="button" className="back-button" onClick={handleGoBack}>
                            <FaArrowLeft/>
                            </button>
                        </Form>
                        
                    </div>
                  <div className="mt-5 d-flex justify-content-center">
                    
                  <Pagination className='custom-pagination'>{pages}</Pagination>
                  <br />
                  </div>
                    


            </Container>


        
    );

}

export default Board;