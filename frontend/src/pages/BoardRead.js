import React, { useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import BaseLayout from '../components/layouts/BaseLayout';
import {Pagination, Row, Col, Card, Button, Container, Carousel, Form} from 'react-bootstrap';
import '../styles/read.css';

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





function BoardRead({user}){
    
    
    const [board, setBoard] = useState(null);
    const {bno} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [comment, setComment] =useState("");
    const [isAnonymous, setIsAnonymous] = useState(() => !user);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [likeCount, setLikeCount] = useState(0);


    const [commentList, setCommentList] = useState([]);
    const [end, setEnd] = useState(1);
    const [start, setStart] = useState(1);
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(true);
    const [files, setFiles]  =useState([]);

    
    
    useEffect(()=>{
        axios.get(`/api/board/read/${bno}`
        
        ).then(response=>{

            if(response.data){

                setBoard(response.data)
                setLoading(false);

                setFiles(response.data.files)
            
                
            } else{
                navigate("/board");

            }

            
        }).catch((error)=>{
            console.error("Error fetching board: ",error);
            
            navigate("/board");
        });

    }, [bno, navigate]);


    const handleSubmit= async (e) =>{
        e.preventDefault();
        
    

        try{
        
        let commentDTO = {
            content:comment, isAnonymous, 
            writer:user ? user.username : null
        };

        if (commentDTO.content.length >= 200) {
            commentDTO.content = commentDTO.content.slice(0, 200);
            }
        


        await axios.post(`/api/comment/${bno}`, commentDTO,{
            withCredentials:true,
            headers :{
                "Content-Type": "application/json"
            }
        });

       
        setCurrentPage(1);
        setComment("");
        await fetchComments();  

       

       
    }catch(error){
        console.error("등록 실패",error);
        
    }}

    const fetchComments = () =>{
        
    
        if (!bno) return; // bno 없으면 요청 안 보냄

        axios.get(`/api/comment/${bno}`, 
            {
                params: {
                    page:currentPage,
                    size: 10},
                  
            withCredentials: true
          })
        .then(response => {
            
            
            setCommentList(response.data.dtoList||[]);

            setEnd(response.data.end);
            setStart(response.data.start);
            setNext(response.data.next);
            setPrev(response.data.prev);
            
        })
        .catch(error => {
          console.error("댓글 데이터 요청 중 오류:", error);
        });
      };
  


    
     useEffect(() =>{
        if(bno) fetchComments();
    }, [bno])
    
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


    useEffect(()=>{
        axios.get(`/api/board/like/${bno}`)
        .then(response=>{
            
            setLikeCount(response.data)
        }
        )

    },[]);
        
      
    
    const handleLikeClick = async () => {
        try{
            await axios.post(`/api/board/like/${bno}`, {}, { withCredentials: true });

            const response = await axios.get(`/api/board/like/${bno}`);
            setLikeCount(response.data);
        }catch(error){
            console.error("Error fetching board: ",error);
            alert("로그인한 회원만 좋아요가 가능합니다.");
            
    
        };
    };

    const handleDelete = async(bno) =>{
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if(!confirmDelete) return;

        try{
            await axios.delete(`/api/board/delete/${bno}`);
            alert("삭제되었습니다.");
            window.location.href="/";
        }catch(error){
            console.log("오류 발생");
        }
    }

    const handleCommentDelete = async(id) =>{
         const confirmCommentDelete = window.confirm("댓글을 삭제하시겠습니까?");
         if(!confirmCommentDelete) return;

         try{
            await axios.delete(`/api/comment/${id}`)
            alert("삭제되었습니다.");
            fetchComments();
            
         }catch(error){
            console.log("오류 발생");
         }
    
    }


    const handleModify = async(bno) =>{
      navigate(`/modify/${bno}`,{state:{board , files}})
   
   }


    if(loading){
        console.log("loading")
        return <div>Loading...</div>
    }
   
    
    return(
        
        <Container className="container-sm mt-5 border  rounded my-3 board">
                <div className="mt-2 position-relative border-bottom py-2">
                    <h2 className="text-center">{board.title}</h2>

                    <div className=" top-0 end-0 mt-3 me-2 badge border border-primary text-dark p-2 text-start">
                        작성자: {board.writer} | {formatDate(board.regDate)}
                    </div>
                </div>
                {/* 슬라이드 */}
                <div className="card my-3 d-flex justify-content-center text-center" >
                <Carousel className="custom-carousel mt-4 w-75 mx-auto border border-success" >
                    {files.length > 0 ? (
                        files.map(file => (
                            <Carousel.Item key={file.savedName}>
                                <img
                                    className=" carousel-image" 
                             
                                    src={`http://localhost:8080/uploads/originals/${file.savedName}`}
                                    alt={file.savedName}
                                />
                            </Carousel.Item>
                        ))
                    ) : (
                        <Carousel.Item>
                            <img
                                className="d-block w-100" 
                                style={{
                                    maxWidth: '1200px',
                                    height: '398px',
                                    objectFit: 'cover',
                                    margin: '0 auto'
                                }}
                                src="http://localhost:8080/uploads/originals/default.jpg" // 기본 이미지 경로
                                alt="기본 이미지"
                            />
                        </Carousel.Item>
                    )}
                </Carousel>

        

                            
                {/* 게시글 내용 */}
                <div className="mt-5 card-body">
                    <div className="card-text custom-card">{board.content}</div>
                </div>
                
                {user && user.userId === board.user.userId && (
                    <div className="d-flex justify-content-end mb-4 me-4">
                        <Button type="submit" className="back-button" onClick={() =>handleModify(bno)}>수정하기</Button>
                        <Button type="button" className="back-button" onClick={() =>handleDelete(bno)}>게시글 삭제</Button>
                    </div>
                    )}


                <div className="d-flex justify-content-center me-4 mb-3">
                <button
                    className="btn btn-outline-danger btn-sm like-button w-auto"
                    onClick={handleLikeClick}
                >
                    ❤️ 좋아요 ({likeCount})
                </button>
                </div>
                </div>



            {/* 댓글처리 시작 */}
            <div className="card my-3 d-flex justify-content-center">
                <div className="mt-4 card-body">

                    <div className="mt-4">
                    {commentList.map((comment, index) => (
                        <Card key={index} className="mb-3 m-4 shadow-sm">
                        <Card.Body>
                            <Row className="mb-2">
                            <Col xs={6} className="fw-bold">
                                🖋 {comment.writer}
                            </Col>
                            <Col xs={6} className="text-end text-muted" style={{ fontSize: '0.85rem' }}>
                                {formatDate(comment.regDate)}
                                
                            </Col>
                            </Row>
                            
                            <Row>
                            <Col>
                                <div style={{ whiteSpace: 'pre-wrap' }}>{comment.content}
                                {user && user.userId=== comment.writerId && (
                            <div className="d-flex justify-content-end">
                                <Button type="button" className="btn-sm btn-danger" onClick={() =>handleCommentDelete(comment.id)}>Delete</Button>
                            </div>
                            
                            )}
                            </div>
                            </Col>
                            </Row>
                        </Card.Body>
                        </Card>
                    ))}
                    </div>
                                

                    <Pagination className='custom-pagination justify-content-center'> {pages}</Pagination>

                    <Form onSubmit={handleSubmit}>
                        <div className="form-group">
                    {/* label은 위에 */}
                        {user && (
                            <label className="mx-2 mb-1"> {user.username}</label>
                        )}

                        {/* textarea + button 나란히 배치 */}
                        <div className="d-flex align-items-center">
                            <textarea
                            className="form-control me-2"
                            rows="3"
                            style={{ resize: "none" }}
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            />
                            
                            </div>
                        </div>

                            <Button className=" mb-3 btn   btn-primary mt-3" type="submit">
                                등록
                            </Button>
                    </Form>


                </div>
            </div>

                  

            </Container>
            
        
    )
}

export default BoardRead;