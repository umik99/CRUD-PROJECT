import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Container, Form, Button} from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaTrashAlt } from 'react-icons/fa'; // 휴지통 아이콘

function Register({user}) {


    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles,  setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    

  
    console.log(selectedFiles);
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

        const formData = new FormData();
        formData.append("title",title);
        formData.append("content",content);
        formData.append("user",new Blob([JSON.stringify(user)], { type: "application/json" }));;
        
        selectedFiles.forEach(file =>{
          formData.append("files",file);
        })


        const fileOrderInfo = selectedFiles.map((file, index) => ({
          name: file.name, 
          order: index
        }));
        formData.append("meta", new Blob([JSON.stringify(fileOrderInfo)], { type: "application/json" }));


        const response = await axios.post("/api/board/register",formData, {
           
            withCredentials:true,
        });

        alert("등록 성공!")
        navigate("/board");
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
  
    // 목적지(destination)가 없으면 종료
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
        <Container className="mt-4 border-info border rounded ">
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