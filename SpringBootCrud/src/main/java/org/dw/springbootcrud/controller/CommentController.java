package org.dw.springbootcrud.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.dto.CommentDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;
import org.dw.springbootcrud.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
@Log4j2
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{bno}")
    public ResponseEntity<?> register(@PathVariable Long bno,
                                      @RequestBody CommentDTO commentDTO,
                                      HttpSession session){

        String username = (commentDTO.isAnonymous())?null: commentDTO.getWriter();
        commentService.register(bno, commentDTO, username, session);
        return ResponseEntity.ok().build();

    }

    @GetMapping("/{bno}")
    public ResponseEntity<PageResponseDTO<CommentDTO>> getCommentList(
            @PathVariable Long bno, PageRequestDTO pageRequestDTO){

        return ResponseEntity.ok(commentService.getList(bno, pageRequestDTO));

    }



    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){

        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }



}
