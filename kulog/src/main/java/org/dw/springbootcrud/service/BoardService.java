package org.dw.springbootcrud.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.BoardDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;
import org.dw.springbootcrud.repository.BoardRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


public interface BoardService {

    //public List<Board> getAllBoards();


    public PageResponseDTO<BoardDTO> getBoardList(String cateogry, PageRequestDTO requestDTO);

    public BoardDTO read(Long bno, User user);

    public void register(BoardDTO boardDTO, MultipartFile[] files, HttpSession session) throws IOException;

    public void increaseViewCount(Long bno);

    public void deleteBoard(Long bno);

    public BoardDTO modify(BoardDTO boardDTO);

    public List<BoardDTO> recentBoards();

    public PageResponseDTO<BoardDTO> getBoardListByWriter(String uuid, PageRequestDTO pageRequestDTO);

    public PageResponseDTO<BoardDTO> getMyBoardList(String uuid, PageRequestDTO pageRequestDTO);

}
