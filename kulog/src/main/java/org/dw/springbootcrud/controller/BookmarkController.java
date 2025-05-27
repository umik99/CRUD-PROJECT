package org.dw.springbootcrud.controller;


import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.coyote.Response;
import org.dw.springbootcrud.domain.Bookmark;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.BoardDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;
import org.dw.springbootcrud.repository.BookmarkRepository;
import org.dw.springbootcrud.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmark")
@Log4j2
@RequiredArgsConstructor
public class BookmarkController {

    @Autowired
    private final BookmarkService bookmarkService;
    @Autowired
    private BookmarkRepository bookmarkRepository;

    @PostMapping("/{bno}")
    public ResponseEntity<?> toggleBookmark(@PathVariable("bno") Long bno, HttpSession session){


        User user = (User) session.getAttribute("user");

        if (user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        bookmarkService.toggleBookmark(user,bno);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/list")
    public ResponseEntity<PageResponseDTO<BoardDTO>> getBookmarkedBoards(PageRequestDTO pageRequestDTO, HttpSession session){
        User user = (User) session.getAttribute("user");

        return ResponseEntity.ok(bookmarkService.getBookmarkedBoards(user, pageRequestDTO));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteBookmarks(@RequestBody List<Long> bnoList, HttpSession session){
        User user = (User) session.getAttribute("user");
        if (user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        bookmarkRepository.deleteByUserAndBoardBnoIn(user,bnoList);
        return ResponseEntity.ok().build();
    }
}
