package org.dw.springbootcrud.service;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.BoardLikes;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.repository.BoardLikesRepository;
import org.dw.springbootcrud.repository.BoardRepository;
import org.dw.springbootcrud.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardLikesServiceImpl implements BoardLikesService {

    private final BoardLikesRepository boardLikesRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Override
    public boolean toogleLike(Long bno, String username, HttpSession session){
        Board board = boardRepository.findById(bno).orElseThrow();
        User user = (User) session.getAttribute("user");
     //   User user = userRepository.findByUsername(username).orElseThrow();

        Optional<BoardLikes> existing = boardLikesRepository.findByUserAndBoard(user, board);
        if(existing.isPresent()){
            boardLikesRepository.delete(existing.get());
            return false;
        } else{
            BoardLikes boardLikes = new BoardLikes();
            boardLikes.setUser(user);
            boardLikes.setBoard(board);
            boardLikesRepository.save(boardLikes);
            return true;
        }

    }

    @Override
    public Long getLikesCount(Long bno){
        Board board = boardRepository.findById(bno).orElseThrow();
        return boardLikesRepository.countByBoard(board);
    }

}
