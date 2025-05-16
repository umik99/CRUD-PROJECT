package org.dw.springbootcrud.controller;


import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.dto.*;
import org.dw.springbootcrud.repository.BoardRepository;
import org.dw.springbootcrud.repository.UploadFileRepository;
import org.dw.springbootcrud.service.BoardLikesService;
import org.dw.springbootcrud.service.BoardService;
import org.dw.springbootcrud.service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/board")
@Log4j2
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final BoardLikesService boardLikesService;
    private final UploadFileRepository uploadFileRepository;
    private final BoardRepository boardRepository;
    private final FileService fileService;


    @Operation(summary = "Board List", description = "get boardlist")
    @GetMapping("/{category}/list")
    public PageResponseDTO<BoardDTO> getBoardList(
            @PathVariable String category,
            PageRequestDTO requestDTO) {

        return boardService.getBoardList(category, requestDTO);
    }

    @Operation(summary="Board read", description =  "get board detail read")
    @GetMapping("/read/{bno}")
    public BoardDTO getBoard(@PathVariable("bno") Long bno, HttpSession session) {

        Set<Long> viewed = (Set<Long>) session.getAttribute("viewedPosts");

        if (viewed == null) {
            viewed = new HashSet<>();
            session.setAttribute("viewedPosts", viewed);

        }

        if(!viewed.contains(bno)){
            boardService.increaseViewCount(bno);
            viewed.add(bno);
        }


        return boardService.read(bno);
    }

    @Operation(summary="Board create" , description="Board create")
    @PostMapping("/register")
    public ResponseEntity<?> registerBoard(
            @RequestPart("category") String category,
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart("user") UserDTO user,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            HttpSession session

    ) {


        try {


            BoardDTO boardDTO = new BoardDTO();
            boardDTO.setCategory(category);
            boardDTO.setTitle(title);
            boardDTO.setContent(content);
            boardDTO.setUser(user);


            boardService.register(boardDTO, files,session);

            return ResponseEntity.ok().build();

        }catch(IOException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    @PostMapping("/like/{bno}")
    public ResponseEntity<?> toggleLike(@PathVariable Long bno, Principal principal, HttpSession session) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        String username = principal.getName();
        boolean liked = boardLikesService.toogleLike(bno, username,session);
        return ResponseEntity.ok(Map.of("liked",liked));

    }

    @GetMapping("/like/{bno}")
    public ResponseEntity<?> getLike(@PathVariable Long bno) {
        return ResponseEntity.ok(boardLikesService.getLikesCount(bno));
    }

    @PostMapping(value = "/modify/{bno}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> modifyBoard(
            @PathVariable Long bno,
            @RequestPart("boardDTO") BoardDTO boardDTO,
            @RequestPart(value = "files", required = false) MultipartFile[] files ) throws IOException {

        List<UploadFileDTO> fileDTOS = fileService.findFilesByBoard(bno);


        List<FileMetaDTO> removeFiles = new ArrayList<>(boardDTO.getRemoveFiles());


        fileService.deleteFile(removeFiles);


        if (bno == null) {
            return ResponseEntity.badRequest().body("bno must not be null");
        }
        boardDTO.setBno(bno);

        List<FileMetaDTO> fileMetaDTOS = boardDTO.getMeta();



        Deque<MultipartFile> fileQueue = new ArrayDeque<>();

        if (files != null) {
            fileQueue.addAll(Arrays.asList(files));
        }

        Map<String, Integer> currentOrderMap = fileDTOS.stream()
                .collect(Collectors.toMap(UploadFileDTO::getSavedName, UploadFileDTO::getFileOrder));

        for (FileMetaDTO fileMetaDTO : fileMetaDTOS) {


            if(fileMetaDTO.getType().equals("existing")){
                String savedName = fileMetaDTO.getName();
                Integer newOrder = fileMetaDTO.getOrder();
                Integer currentOrder = currentOrderMap.get(savedName);

                if(!Objects.equals(currentOrder,newOrder)){
                    fileService.updateFileOrder(savedName, newOrder);

                }

            }else{

                if (!fileQueue.isEmpty()) {
                    MultipartFile newFile = fileQueue.poll();
                    if (newFile != null) {

                        Integer fileOrder = fileMetaDTO.getOrder();

                        fileService.saveNewFile(bno, newFile, fileOrder);
                    }
                }
            }

        }
        boardService.modify(boardDTO);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{bno}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long bno) {

        boardService.deleteBoard(bno);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/main/recentBoards")
    public ResponseEntity<List<BoardDTO>> getRecentBoards() {

        List<BoardDTO> recentBoards = boardService.recentBoards();

        return ResponseEntity.ok(recentBoards);




    }
 }
