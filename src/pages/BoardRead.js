import React, { useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import BaseLayout from '../components/layouts/Base';
import {Container, Carousel} from 'react-bootstrap';

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





function BoardRead(){
    
    
    const [board, setBoard] = useState(null);
    const {bno} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        axios.get(`/api/board/read/${bno}`
        
        ).then(response=>{

            if(response.data){

                setBoard(response.data)
                setLoading(false);

                
            } else{
                navigate("/board");

            }

            
        }).catch((error)=>{
            console.error("Error fetching board: ",error);
            
            navigate("/board");
        });

    }, [bno, navigate]);


    if(loading){
        console.log("loading")
        return <div>Loading...</div>
    }
   
    return(
        
            <Container className="container-sm mt-5 border border-info rounded my-3">
                <h2 className="d-flex justify-content-center border-bottom py-2">{board.title}</h2>
                <div className="mt-4 mb-4 d-flex justify-content-end">
                <div className="badge border border-success text-dark p-2 text-start">
                    <div className="">{board.writer}  |  {formatDate(board.regDate)}</div>
                    
                </div>
                </div>
                {/* 슬라이드 */}
                <div className="card my-3 d-flex justify-content-center text-center">
                <Carousel className="mt-4 w-50 mx-auto border rounded border-success" >
                    <Carousel.Item>
                      <img
                      className="d-block w-100"
                      src="/assets/ExampleCarouselImage.jpeg"/>
          
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                      className="d-block w-100"
                      src="/assets/ExampleCarouselImage.jpeg"/>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                      className="d-block w-100"
                      src="/assets/ExampleCarouselImage.jpeg"/>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                      className="d-block w-100"
                      src="/assets/ExampleCarouselImage.jpeg"/>
                    </Carousel.Item>
                   
                </Carousel>
                

        

                            
                {/* 게시글 내용 */}
                    <div className="mt-4 card-body">
                        <div className="card-text custom-card">{board.content}</div>
                    </div>
                </div>

            </Container>
        
    )
}

export default BoardRead;