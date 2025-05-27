package org.dw.springbootcrud.config;


import lombok.RequiredArgsConstructor;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.Comment;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.CommentDTO;
import org.dw.springbootcrud.dto.UserDTO;
import org.dw.springbootcrud.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommentMapper {
    private UserDTO toUserDTO(User user) {
        if (user == null) return null;

        return UserDTO.builder()
                .username(user.getUsername())
                .nickname(user.getNickname())
                .build();
    }

    private final UserRepository userRepository;

    public Comment dtoToEntity(CommentDTO commentDTO, Board board, User user) {
        return Comment.builder().content(commentDTO.getContent())
                .anonymous(commentDTO.isAnonymous())
                .board(board)
                .writer(commentDTO.isAnonymous() ? null : user)
                .build();

    }

    public CommentDTO entityToDto(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .writerId(comment.getWriter() != null && !comment.getWriter().isDeleted() ? comment.getWriter().getUserid() : null)
                .anonymous(comment.isAnonymous())
                .commentWriterProfileImg(comment.getWriter() !=null && !comment.getWriter().isDeleted() ?comment.getWriter().getProfileImage() : "anonymous")
                .writer(comment.getWriter()==null ? "익명" :
                        (comment.getWriter().isDeleted() ? "탈퇴한 사용자" : comment.getWriter().getNickname()))
                .regDate(comment.getRegDate())
                .writerUuid(comment.getWriter()== null ? null : comment.getWriter().getUuid())
                .build();
    }
}
