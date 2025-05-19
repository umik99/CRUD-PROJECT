package org.dw.springbootcrud.service;

import jakarta.servlet.http.HttpSession;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.Bookmark;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.BoardDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;
import org.dw.springbootcrud.repository.BoardLikesRepository;
import org.dw.springbootcrud.repository.BoardRepository;
import org.dw.springbootcrud.repository.BookmarkRepository;
import org.dw.springbootcrud.repository.CommentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    @Autowired
    ModelMapper modelMapper = new ModelMapper();

    @Autowired
    BoardRepository boardRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    BoardLikesRepository boardLikesRepository;

    @Autowired
    BookmarkRepository bookmarkRepository;

    public void toggleBookmark(User user, Long bno){
        Board board = boardRepository.findById(bno).orElseThrow();
        Optional<Bookmark> existing = bookmarkRepository.findByUserAndBoard(user, board);

        if(existing.isPresent()){
            bookmarkRepository.delete(existing.get());
        }else{
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setBoard(board);
            bookmarkRepository.save(bookmark);
        }

    }

    public PageResponseDTO<BoardDTO> getBookmarkedBoards(User user, PageRequestDTO pageRequestDTO){
        Pageable pageable = pageRequestDTO.getPageable("regDate");

        Page<Bookmark> result = bookmarkRepository.findByUser(user,pageable);

        List<BoardDTO> dtoList = result.getContent().stream()
                .map(bookmark ->{
                    Board board = bookmark.getBoard();
                    BoardDTO dto = modelMapper.map(board, BoardDTO.class);
                    Long likeCount = boardLikesRepository.countByBoard(board);
                    dto.setLikeCount(likeCount);

                    int replyCount = commentRepository.countByBoard(board);
                    dto.setReplyCount(replyCount);

                    return dto;
                }).collect(Collectors.toList());

        return PageResponseDTO.<BoardDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(dtoList)
                .total((int) result.getTotalElements())
                .build();
    }




}
