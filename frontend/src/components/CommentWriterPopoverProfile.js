import React, { useRef, useEffect } from 'react';
import '../styles/WriterPopoverProfile.css'

export default function CommentWriterPopoverProfile ({
  comment,
  baseProfileImageUrl,
  defaultIMG,
  isMenuOpen,
  onOpenMenu,
  user,
  onCloseMenu
}) {
  const menuRef = useRef();

  // 바깥 클릭시 닫힘
  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onCloseMenu();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMenuOpen, onCloseMenu]);

  // 탈퇴유저 처리
  if (comment.writer === '탈퇴한 사용자') {
    return (
      <div className="mx-3 d-flex align-items-center">
      
        <span style={{ color: "#bbb", fontWeight: 600 }}>탈퇴한 사용자</span>
      </div>
    );
  }

   if (comment.writer === '익명') {
    return (
      <div className="mx-3 d-flex align-items-center">
      
        <span style={ {fontWeight: 600 }}>익명</span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center position-relative" ref={menuRef}>
      <img
        src={comment.commentWriterProfileImg ? baseProfileImageUrl + comment.commentWriterProfileImg : defaultIMG}
        alt="프로필"
        className="rounded-circle mx-2"
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
          border: "1.5px solid #dee2e6",
          cursor: "pointer"
        }}
      onClick={(e) => {
    e.stopPropagation(); // <- 아코디언 클릭 막기
    isMenuOpen ? onCloseMenu() : onOpenMenu();
  }}
      />
      <span
        className="fw-bold"
        style={{ cursor: "pointer" }}
         onClick={(e) => {
    e.stopPropagation(); // <- 아코디언 클릭 막기
    isMenuOpen ? onCloseMenu() : onOpenMenu();
  }}>
        {comment.writer}
      </span>
      {isMenuOpen && (
        <div
  style={{
    position: "absolute",
    top: "40px",
    left: 0,
    zIndex: 1000,
    background: "#fff",
    border: "1px solid #dee2e6",
    borderRadius: "10px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
    minWidth: "120px",
    padding: "8px 0"
  }}
>
  {user ? (
  <button
    className="custom-menu-item"
    disabled={user.uuid === comment.writerUuid}
    onClick={() => window.open(`/dm?receiverId=${comment.writerId}`, "_blank","width=720,height=650")}

    // ...style, onClick 등
  >
    1:1 채팅
  </button>
) : (
  <button
    className="custom-menu-item"
    disabled
    style={{
      color: "#aaa", cursor: "not-allowed", pointerEvents: "none"
    }}
    title="로그인 후 이용가능"
  >
    1:1 채팅
  </button>
)}
  <hr className="menu-divider" />
  <button
    className="custom-menu-item"
    onClick={() => window.open(`/board/list/${comment.writerUuid}`, "_blank")}
  >
    게시글 보기
  </button>
</div>
      )}
    </div>
  );
}
