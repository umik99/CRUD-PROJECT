// Board 컴포넌트 내부 또는 외부
import React, { useRef, useEffect } from 'react';
import '../styles/WriterPopoverProfile.css'

export default function WriterPopoverProfile({
  board,
  baseImageUrl,
  defaultIMG,
  isMenuOpen,
  onOpenMenu,
  onCloseMenu,
  user
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
  if (board.user?.deleted) {
    return (
      <div className="mx-3 d-flex align-items-center">
      
        <span style={{ color: "#bbb", fontWeight: 600 }}>탈퇴한 사용자</span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center position-relative" ref={menuRef}>
      <img
        src={board.writerProfileImg ? baseImageUrl + board.writerProfileImg : defaultIMG}
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
        {board.writer}
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
    disabled={user.uuid === board.user.uuid}
    onClick={() => window.open(`/dm?receiverId=${board.user.userid}`, "_blank", "width=720,height=650" )}

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
    onClick={() => window.open(`/board/list/${board.user.uuid}`, "_blank")}
  >
    게시글 보기
  </button>
</div>
      )}
    </div>
  );
}
