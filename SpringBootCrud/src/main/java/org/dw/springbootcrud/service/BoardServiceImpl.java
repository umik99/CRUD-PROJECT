package org.dw.springbootcrud.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.dto.BoardDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;
import org.dw.springbootcrud.repository.BoardRepository;
import org.dw.springbootcrud.repository.BoardSearch;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    @Autowired
    private final BoardRepository boardRepository;

    @Autowired
    private final BoardSearch boardSearch;
    private final ModelMapper modelMapper;



    @Override
    public PageResponseDTO<BoardDTO> getBoardList(PageRequestDTO requestDTO) {
        Pageable pageable = requestDTO.getPageable("bno");

        Page<Board> result = boardSearch.searchAll(
                requestDTO.getType(),
                requestDTO.getKeyword(),
                pageable
        );

        List<BoardDTO> dtoList = result.getContent().stream()
                .map(board -> modelMapper.map(board, BoardDTO.class)).collect(Collectors.toList());

        return PageResponseDTO.<BoardDTO>withAll()
                .pageRequestDTO(requestDTO)
                .dtoList(dtoList)
                .total((int)result.getTotalElements())
                .build();
    }

    @Override
    public BoardDTO read(Long bno) {
        Board board = boardRepository.getOne(bno);
        return modelMapper.map(board, BoardDTO.class);
    }

}
