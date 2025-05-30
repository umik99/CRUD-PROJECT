import axios from "axios";
import React, { useCallback, useEffect, useState ,useRef} from "react";
import { useNavigate , useLocation } from "react-router-dom";
import {Container, Form, Button} from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaTrashAlt } from 'react-icons/fa'; // 휴지통 아이콘
import {GoogleMap, Marker, useJsApiLoader, Autocomplete} from "@react-google-maps/api";
import {APIKEY, LIBRARIES} from "../config/APIConfig";
import '../styles/read.css';

const japanCenter = { lat: 35.6895, lng: 139.6917 }; // 도쿄

const mapContainerStyle={
  width:"100%",
  height:"300px",
};

const JAPAN_BOUNDS = {
  north: 45.551483,
  south: 24.396308,
  west: 122.93457,
  east: 153.986672,
};


function Register({user}) {



    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const category = searchParams.get("category");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles,  setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const autocompleteRef = useRef(null);

    const [position, setPosition] = useState(null);
    const [showMap, setShowMap] = useState(false);




    const {isLoaded} = useJsApiLoader({
      googleMapsApiKey :APIKEY,
      libraries : LIBRARIES,

    })

    const handleMapClick = useCallback((event) => {
    setPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        setPosition({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };
  
  const handlePlaceReset =() =>{
    setPosition(null);
    setShowMap(false);
  }
  const handleMapClose = () => setShowMap(false);

  
    useEffect(() =>{
        if (!user){
            
            alert("로그인이 필요합니다.");
            navigate("/login");
        }

    },[user, navigate]);
    

    const handleSubmit= async (e) =>{
        e.preventDefault();
        setIsSubmitting(true);
    

    try{

      const boardDTO = {
        
          category:category,
          title, content, user,
          latitude:position?.lat||null,
          longitude:position?.lng || null,
          
        };

        const formData = new FormData();

  
        const jsonBlob = new Blob(
          [JSON.stringify(boardDTO)],
          { type: "application/json" }
      );
      formData.append("boardDTO", jsonBlob);

        const response = await axios.post(`/api/board/register`, formData, {
       
            withCredentials:true
        });


        alert("등록 성공!")
        navigate(`/board/${category}`);
    }catch(error){
        console.error("등록 실패",error);
        alert("등록에 실패했습니다.");
    }finally{
        setIsSubmitting(false);
    }

}

  const handleFileChange = (e)=>{
    const newFiles = Array.from(e.target.files);  // 새로 선택된 파일들


    setSelectedFiles(prevFiles => {
      const existingFileMap = new Map(prevFiles.map(file => [file.name + file.size, file]));
      
      const filteredNewFiles = newFiles.filter(file => {
        const key = file.name + file.size;
        return !existingFileMap.has(key); // 중복이면 제외
      });
  
      return [...prevFiles, ...filteredNewFiles];
    });
  
    e.target.value = '';

  }

  const handleRemovePreview = (indexToRemove) => {
    setPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
  
  useEffect(() =>{
    const newPreviews = selectedFiles.map((file)=>({
      name:file.name,
      url : URL.createObjectURL(file),


    }));

    setPreviews(newPreviews)
    return () =>{

      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    }
  },[selectedFiles]);
    


  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
  
    if (!destination) return;
  
    // 드래그가 휴지통 영역으로 끝났을 때 삭제 처리
    if (destination.droppableId === 'droppable-trash') {
      // 삭제하려는 파일의 인덱스를 찾음
      const indexToRemove = source.index;
      handleRemovePreview(indexToRemove); // 기존 삭제 함수 호출
      return; // 삭제 후 처리 종료
    }
  
    // 파일 순서 변경 로직
    const reorderedFiles = Array.from(selectedFiles); // 기존 배열 복사
    const [removed] = reorderedFiles.splice(source.index, 1); // 원본에서 이동할 파일 제거
    reorderedFiles.splice(destination.index, 0, removed); // 이동한 파일을 새로운 위치에 삽입
  
    setSelectedFiles(reorderedFiles); // 순서 변경된 배열 업데이트
  };









    return (
        <Container className="mt-4  border board rounded ">
           <div className="mt-4">
             <h3>게시글 작성</h3>
        <Form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>제목</label>
          <input
            className="form-control "
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>내용</label>
          <textarea
            className="form-control"
            rows="7"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

      {/* 지도 위치 선택 */}
      <div className="form-group mt-4 mb-4">
          <button
    type="button"
    className="btn btn-outline-secondary mb-3"
    onClick={() => setShowMap(true)}
  >지도에서 위치 선택</button>
      {position && (
        <div className="mt-2 mb-2">
          위치 선택됨
          <button
          type="button"
          className="btn btn-sm btn-outline-danger ms-2"
          onClick={() =>handlePlaceReset()} 
          >선택 취소</button>
          </div>
      )}
      { isLoaded && showMap &&(
          <>

        
              {/* Place 검색창 */}
              <Autocomplete
                onLoad={ref => (autocompleteRef.current = ref)}
                onPlaceChanged={handlePlaceChanged}
                options={{
                  componentRestrictions: { country: "jp" }, // 일본 한정
                  types: ["establishment"], // 음식점, 가게 등
                }}
              >
                <input
                  type="text"
                  placeholder="음식점, 장소 검색"
                  style={{ width: "100%", height: "40px", fontSize: "16px", marginBottom: "8px" }}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={position?position : japanCenter}
                zoom={15}
                options={{
                  restriction: {
                    latLngBounds: JAPAN_BOUNDS,
                    strictBounds: true,
                  },
                }}
                onClick={handleMapClick}
              >
                <Marker
                  position={position?position : japanCenter}
                  draggable={true}
                  onDragEnd={handleMapClick}
                />
              </GoogleMap>
                    <button
            type="button"
            className="btn btn-secondary mb-2"
            onClick={() => handleMapClose()}
          >
            닫기</button>
            </>
        )}
      
      </div>
     


      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>사진 파일 첨부</Form.Label>
        <Form.Control type="file" multiple
         accept=".jpg,.jpeg,.png"  onChange={handleFileChange} />
        
      </Form.Group>

      <DragDropContext onDragEnd={handleOnDragEnd}>
  <Droppable droppableId="droppable-preview" direction="horizontal">
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: '10px',
          gap: '10px',
        }}
      >
        {previews.map((preview, index) => (
          <Draggable key={preview.name} draggableId={preview.name} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  ...provided.draggableProps.style,
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
                  src={preview.url}
                  alt={preview.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder} {/* 드래그 중에 자리를 비워둘 공간 */}
      </div>
    )}
  </Droppable>
  
  {/* 아래쪽에 휴지통 영역을 추가 */}
  <Droppable droppableId="droppable-trash">
    {(provided,snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
          background: '#f4f4f4',
          borderRadius: '8px',
          marginTop: '20px',
          cursor: 'pointer',
          background: snapshot.isDraggingOver ? '#f9d6d6' : '#f0f0f0',  // 드래그 중일 때 배경색 변경

        }}
      >
        <FaTrashAlt size={30} color="#888" />
        <span style={{ marginLeft: '10px', fontSize: '18px', color: '#888' }}>
          Drag images here to delete
        </span>
      </div>
    )}
  </Droppable>
</DragDropContext>

      <Button className=" mb-3 btn   btn-primary mt-3" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "작성 중..." : "작성"}
        </Button>
        </Form>
        </div>
        </Container>
        
  );
}

export default Register;