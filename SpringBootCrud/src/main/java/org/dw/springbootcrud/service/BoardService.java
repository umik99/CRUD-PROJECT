package org.dw.springbootcrud.service;

import lombok.RequiredArgsConstructor;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.dto.BoardDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;
import org.dw.springbootcrud.repository.BoardRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


public interface BoardService {

    //public List<Board> getAllBoards();


    public PageResponseDTO<BoardDTO> getBoardList(PageRequestDTO requestDTO);

    public BoardDTO read(Long bno);


}
