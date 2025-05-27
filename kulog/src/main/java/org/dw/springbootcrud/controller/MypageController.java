package org.dw.springbootcrud.controller;


import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.*;
import org.dw.springbootcrud.repository.UserRepository;
import org.dw.springbootcrud.service.BoardService;
import org.dw.springbootcrud.service.FileService;
import org.dw.springbootcrud.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
@Log4j2
public class MypageController {

    @Autowired
    private final UserService userService;

    @Autowired
    private final FileService fileService;

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private BoardService boardService;

    @PatchMapping("/nickname")
    public ResponseEntity<?> updateNickname(@RequestBody NicknameUpdateDTO dto, HttpSession session){
        User user = (User) session.getAttribute("user");

        try {
            userService.updateNickname(user, dto.getNickname());
            user.setNickname(dto.getNickname());
            session.setAttribute("user", user);

            return ResponseEntity.ok().build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    @PatchMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordChangeDTO dto,  HttpSession session){
        User user = (User) session.getAttribute("user");
        log.info("dd");
        try{
            userService.updatePassword(user, dto.getCurrentPassword(), dto.getNewPassword());
            return ResponseEntity.ok("비밀번호가 변경되었습니다.");
        }catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PatchMapping("/profile-image")
    public ResponseEntity<?> updateProfileImage(
            @ModelAttribute ProfileImageUpdateDTO dto,
            HttpSession session
            )throws IOException{

        User user = (User) session.getAttribute("user");

        if (dto.getFile() == null || dto.getFile().isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 없습니다.");
        }

        UserDTO updatedUserDTO = userService.updateProfileImage(user, dto.getFile());

        log.info(updatedUserDTO);
        user.setProfileImage(updatedUserDTO.getProfileImage());

        log.info(user.getProfileImage());
        log.info("패치매핑");
        session.setAttribute("user",user);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/profile-image")
    public ResponseEntity<?> deleteProfileImage(HttpSession session) {
        User user = (User) session.getAttribute("user");

        String oldPath = user.getProfileImage();

        userService.deleteProfileImage(user, oldPath);

        log.info(oldPath);
        log.info("삭제매핑");



        user.setProfileImage(null);



        session.setAttribute("user", user);
        return ResponseEntity.ok().build();

    }


    @DeleteMapping("/delete-user")
    public ResponseEntity<?> deleteUser(HttpSession session) {
        User user = (User) session.getAttribute("user");

        try{

            userService.deleteProfileImage(user, user.getProfileImage());
            userService.deleteUser(user);
            session.setAttribute("user",null);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/myboards")
    public ResponseEntity<PageResponseDTO<BoardDTO>> myBoardList(HttpSession session, PageRequestDTO pageRequestDTO) {
        User user = (User) session.getAttribute("user");

        return ResponseEntity.ok(boardService.getMyBoardList(user.getUuid(), pageRequestDTO));
    }
}
