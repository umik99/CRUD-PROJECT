package org.dw.springbootcrud.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.config.CommentMapper;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.Comment;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.BoardDTO;
import org.dw.springbootcrud.dto.CommentDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;
import org.dw.springbootcrud.repository.BoardLikesRepository;
import org.dw.springbootcrud.repository.BoardRepository;
import org.dw.springbootcrud.repository.CommentRepository;
import org.dw.springbootcrud.repository.UserRepository;
import org.hibernate.annotations.Comments;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final CommentMapper commentMapper;
    private final ModelMapper modelMapper;

    private final UserRepository userRepository;
    private final BoardLikesRepository boardLikesRepository;


    @Override
    public void register(Long bno, CommentDTO commentDTO, String username, HttpSession session) {
        Board board = boardRepository.findById(bno).orElseThrow();
        log.info("username: {}", username); // 확인용

        User user = null;
        if (!commentDTO.isAnonymous() && username != null) {

            user = (User)session.getAttribute("user");
            /*
            user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));*/
            log.info("User entity: {}", user); // 확인용

        }
        Comment comment = commentMapper.dtoToEntity(commentDTO, board, user);
        log.info("Comment entity to save: {}", comment); // 확인용
        commentRepository.save(comment);


    }

    @Override
    public PageResponseDTO<CommentDTO> getList(Long bno, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() -1, pageRequestDTO.getSize(), Sort.by("regDate").descending());

        Board board = boardRepository.findById(bno).orElseThrow();

        Page<Comment> result = commentRepository.findByBoard(board,pageable);

        List<CommentDTO> dtoList = result.getContent().stream().map(commentMapper::entityToDto).collect(Collectors.toList());

        return PageResponseDTO.<CommentDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(dtoList)
                .total((int)result.getTotalElements())
                .build();
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    @Override
    public List<BoardDTO> recentCommentedBoards() {
        List<Comment> comments = commentRepository.findTop30ByOrderByRegDateDesc();

        List<Board> boards = comments.stream()
                .map(Comment::getBoard)
                .distinct()
                .limit(5)
                .collect(Collectors.toList());


        return boards.stream()
                .map(board ->{
                    BoardDTO boardDTO = modelMapper.map(board, BoardDTO.class);
                    User writer = board.getWriter();
                    if (writer.isDeleted()){
                        boardDTO.setWriter("탈퇴한 사용자");
                    }

                    Long likeCount = boardLikesRepository.countByBoard(board);
                    boardDTO.setLikeCount(likeCount);

                    int replyCount = commentRepository.countByBoard(board);
                    boardDTO.setReplyCount(replyCount);

                    return boardDTO;
                })
                .collect(Collectors.toList());



    }
}
