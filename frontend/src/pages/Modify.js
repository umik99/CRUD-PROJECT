import axios from "axios";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {Container, Form, Button} from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaTrashAlt } from 'react-icons/fa'; // 휴지통 아이콘
import {GoogleMap, Marker, useJsApiLoader, Autocomplete} from "@react-google-maps/api";
import { APIKEY, LIBRARIES} from "../config/APIConfig.js";


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



function Modify({user}){


    const navigate = useNavigate();

    const location = useLocation();
    
    const board = location.state?.board;
    const authorizedToEdit = location.state?.authorizedToEdit;
    

    const autocompleteRef = useRef(null);

    const [showMap, setShowMap] = useState(false);



    useEffect(() => {
  if (!board || !authorizedToEdit) {
    alert("잘못된 접근입니다.");
    navigate("/");
  }
}, [board, authorizedToEdit, navigate]);


 




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

    const {isLoaded} = useJsApiLoader({
      googleMapsApiKey :APIKEY,
      libraries : LIBRARIES,

  })

  




    const existingFiles = location.state?.files || [];


    const [title, setTitle] = useState(board?.title||'');
    const [content, setContent] = useState(board?.content||'');
    const [position, setPosition] = useState({
      lat : board?.latitude || null,
      lng : board?.longitude || null,

    })
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    const [allFiles , setAllFiles] = useState(() =>
      (existingFiles || []).map((file, index) => ({
        name: file.savedName,
        type: 'existing',
        order: index,
        previewURL: `http://localhost:8080/uploads/thumbnails/${file.savedName}`
      }),)
    );

    const [removeFiles, setRemoveFiles] = useState([]);


    useEffect(() =>{
        if (!user ){
            
            alert("로그인이 필요합니다.");
            navigate("/login");
        }

    },[user, navigate]);
  

  

    const handleSubmit= async (e) =>{
        e.preventDefault();
        setIsSubmitting(true);
    

    try{
        const boardDTO = {
          title, content, user,
          removeFiles,
          latitude:position?.lat||null,
          longitude:position?.lng||null,
          meta: allFiles.map(file => ({
            name: file.name,
            order: file.order,  // 파일 순서
            type: file.type, }))
        };

        const formData = new FormData();

        allFiles.filter(file => file.type=='new').forEach(file =>{
          formData.append("files",file.file);
        });

        const jsonBlob = new Blob(
          [JSON.stringify(boardDTO)],
          { type: "application/json" }
      );
      formData.append("boardDTO", jsonBlob);

        const response = await axios.post(`/api/board/modify/${board.bno}`, formData, {
       
            withCredentials:true
        });

        alert("수정 성공!")
        navigate(`/board/read/${board.bno}`, { replace: true });
    }catch(error){
        console.error("등록 실패",error);
        alert("등록에 실패했습니다.");
    }finally{
        setIsSubmitting(false);
    }
}

const handleAddNewFiles = (e)=>{
  const selected = e.target.files;
  const newFileEntries = Array.from(selected).map((file,index)=>({
    file,
    name:file.name,
    type:'new',
    order:allFiles.length+index,
    previewURL:URL.createObjectURL(file),
  }))

  setAllFiles(prev =>[...prev , ...newFileEntries])

}

 
    
const reorderFiles = (filesArray) => {
  return filesArray.map((file, index) => ({
    ...file,
    order: index
  }));
};

 
  const handleRemoveFile = (indexToRemove) =>{
    const fileToRemove = allFiles[indexToRemove];

  if (fileToRemove.type === 'existing') {
    setRemoveFiles(prev => [...prev, fileToRemove]);
  } else if (fileToRemove.type === 'new') {
    // 새 파일이면 revokeObjectURL도 수행
    URL.revokeObjectURL(fileToRemove.previewUrl);
  }

  // allFiles 배열에서 제거
 
  const newFiles = allFiles.filter((_, i) => i !== indexToRemove);
  setAllFiles(reorderFiles(newFiles));
}

  const handleOnDragEnd = (result) => {
      const { source, destination } = result;
    
      // 목적지(destination)가 없으면 종료
      if (!destination) return;
    
      // 드래그가 휴지통 영역으로 끝났을 때 삭제 처리
      if (destination.droppableId === 'droppable-trash') {
        // 삭제하려는 파일의 인덱스를 찾음
        const indexToRemove = source.index;
        handleRemoveFile(indexToRemove); // 기존 삭제 함수 호출
        return; // 삭제 후 처리 종료
      }
    
      // 파일 순서 변경 로직
      const reorderedFiles = Array.from(allFiles); // 기존 배열 복사
      const [removed] = reorderedFiles.splice(source.index, 1); // 원본에서 이동할 파일 제거
      reorderedFiles.splice(destination.index, 0, removed); // 이동한 파일을 새로운 위치에 삽입
    
      
      setAllFiles(reorderFiles(reorderedFiles)); // 순서 변경된 배열 업데이트


      console.log(reorderedFiles)
    };
  

    const handleGoBack = () => {
      window.history.back();
    };
return (
        <Container className="mt-4 border board rounded ">
           <div className="mt-4">
             <h3>게시글 수정</h3>
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
      {position?.lat && (
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
                center={position.lat?position : japanCenter}
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
                  position={position.lat?position : japanCenter}
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
     
      <Form.Group controlId="formFileLg" className="mb-3">
        <Form.Label>사진 파일 첨부</Form.Label>
        <Form.Control type="file"
        accept=".jpg,.jpeg,.png" 
        multiple
        onChange={handleAddNewFiles} />
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
        {allFiles.map((preview, index) => (
  <Draggable key={preview.name + index} draggableId={preview.name + index} index={index}>
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
          src={preview.previewURL}
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





      <Button className=" mx-2 back-button mt-3" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "작성 중..." : "수정하기"}
        </Button>
        <Button type="button" className=" mx-2 mt-3 back-button" onClick={handleGoBack}>
                            취소
          </Button>
        </Form>
        </div>
        </Container>
        
  );


}

export default Modify;