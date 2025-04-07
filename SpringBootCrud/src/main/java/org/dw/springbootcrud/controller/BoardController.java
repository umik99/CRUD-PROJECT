package org.dw.springbootcrud.controller;


import io.swagger.v3.oas.annotations.Operation;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.dto.BoardDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;
import org.dw.springbootcrud.service.BoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@Log4j2
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @Operation(summary = "Board List", description = "get boardlist")
    @GetMapping("/list")
    public PageResponseDTO<BoardDTO> getBoardList(PageRequestDTO requestDTO) {
        return boardService.getBoardList(requestDTO);
    }

    @Operation(summary="Board read", description =  "get board detail read")
    @GetMapping("/read/{bno}")
    public BoardDTO getBoard(@PathVariable("bno") Long bno) {
        BoardDTO boardDTO = boardService.read(bno);

        return boardDTO;
    }

 }
