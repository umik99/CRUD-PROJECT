import React, {useEffect,useState} from 'react';
import axios from 'axios';
import {Form, Button, Accordion, Container, Row, Col, Pagination} from 'react-bootstrap';

import '../styles/board.css';
import {useNavigate, useSearchParams, useLocation} from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css'; // 이거 꼭 import 해야 함


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

function Board(){
  

    const [searchParams,setSearchParams] = useSearchParams();
    const typeFromURL = searchParams.get("type")|| "t";
    const keywordFromURL = searchParams.get("keyword") || "";
    const currentPage = parseInt(searchParams.get("page")) || 1; // 기
    // 본값 1

    const location = useLocation(); // 🔥 URL 변경 감지용!

    const [type, setType] = useState(typeFromURL);
    const [keyword, setKeyword] = useState(keywordFromURL);
    const [boardList, setBoardList] = useState([]);
    const [end, setEnd] = useState(1);
    const [start, setStart] = useState(1);
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(true);
    
    
    

    useEffect(() =>{
        
        setKeyword(keywordFromURL)

        axios.get('/api/board/list', {
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
    
  
    
    return (
            <Container className="mt-4 border-info border rounded">
                <div className="navbar ">
                    <Form className="form-inline d-flex justify-content-end  w-100  gap-2" onSubmit={handleSearch}>
                        <Button href="/register" className="mx-2 px-3 btn btn-success">글쓰기</Button>

                    
                        
                        <select className="form-control-sm" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="t" selected>제목</option>
                            <option value="c">내용</option>
                            <option value="u">작성자</option>
                        </select>
                        <input
                            className="form-control-sm border border-dark mr-ms-2"
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="검색어 입력"
                        />
                        <Button type="submit" className="btn btn">Search</Button>
                        <Button type="button" className="absolute btn btn-danger btn" onClick={handleGoBack}>
                        Back
                        </Button>
                   
                    </Form>
                        
                        </div>
                        
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
                
                    
                    {boardList.map(board =>(


                     <Accordion defaultActiveKey="0" flush >
                     <Accordion.Item eventKey="1">
                       <Accordion.Header className="border">
                        
                       <Row className="w-100 d-flex align-items-center text-center spread-underline">
                                {/* 첫 번째 컬럼: 번호 */}
                                <Col xs={2} className="pe-5 text-center">
                                    {board.viewCount}
                                </Col>

                                {/* 두 번째 컬럼: 제목 */}
                                <Col xs={5} className="text-center " onClick={()=>handleClick(board.bno)}>
                                    <span >{board.title} </span>
                                    <span className="text-danger">[{board.replyCount}]</span>
                                    <span className="text-danger fw-bold ms-2" style={{ fontSize: "12px" }}>
                                        <i className="bi bi-heart-fill me-1 " ></i>
                                        {board.likeCount}
                                    </span>                                
                                </Col>

                                {/* 세 번째 컬럼: 작성자 */}
                                <Col xs={2} className="text-center">
                                    {board.writer}
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
                  <div className="mt-5 d-flex justify-content-center">
                    
                  <Pagination size="lg">{pages}</Pagination>
                  <br />
                  </div>
                    

            </Container>


        
    );

}

export default Board;