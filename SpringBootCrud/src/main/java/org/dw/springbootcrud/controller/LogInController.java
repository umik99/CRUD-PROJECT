package org.dw.springbootcrud.controller;


import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.UserDTO;
import org.dw.springbootcrud.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LogInController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @Operation(summary = "user sign up" , description = "user signup with username and password")
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserDTO userDTO) {
        userService.signup(userDTO);
        System.out.println(userDTO);
        return ResponseEntity.ok("signup success");
    }

    @Operation(summary = "user login", description="user login")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO, HttpSession session) {
        User user = userService.login(userDTO,session);
        UserDTO dto = userService.entityToDTO(user);
        return ResponseEntity.ok(dto);
     }


     //로그인된 유저확인
    @GetMapping("/user")
    public ResponseEntity<?> getUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if(user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "No User Logged In"));

        }
        UserDTO dto = userService.entityToDTO(user);
        return ResponseEntity.ok(dto);
    }


    @Operation(summary = "logout")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("logout success");
    }
}
