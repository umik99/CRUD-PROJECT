
import defaultIMG from '../img/default_profile.png'
import { baseProfileImageUrl } from '../config/APIConfig';


export default function DMContactList({ contacts, selectedContact, onSelect }) {
    

  return (
    <div style={{ width: "220px", borderRight: "1px solid #ddd", overflowY: "auto" }}>
      {contacts.map(contact => (
        <div
          key={contact.userid}
          onClick={() => onSelect(contact.userid)}
          style={{
            padding: 12,
            cursor: "pointer",
            background: contact.userid === selectedContact ? "#e8f2ff" : "#fff"
          }}
          className='border'
        >
          <img
        src={contact.profileImage ? baseProfileImageUrl + contact.profileImage : defaultIMG}
        alt="프로필"
        className="rounded-circle mx-2"
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
          border: "1.5px solid #dee2e6",
          cursor: "pointer"
        }}
    
      />
      <span
        className="fw-bold"
        style={{ cursor: "pointer" }}
         
    >
        <span>{contact.isDeleted ? "탈퇴한 사용자" : contact.nickname}</span>

      </span>
      {contact.unreadCount > 0 && (
      <span className="dm-badge">
        {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
        {/* 또는 그냥 "N"만 */}
        {/* N */}
      </span>
      )}
        </div>
      ))}
    </div>
  );
}
