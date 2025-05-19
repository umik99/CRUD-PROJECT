package org.dw.springbootcrud.controller;


import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.UserDTO;
import org.dw.springbootcrud.service.UserService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Log4j2
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

    @GetMapping("/loginsuccess")
    public void loginSuccess(@AuthenticationPrincipal OAuth2User principal
                             , HttpServletResponse response, HttpSession session) throws IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) auth;
        String registrationId = oauthToken.getAuthorizedClientRegistrationId();

        String email = null;
        String name = null;

        if ("google".equals(registrationId)) {
            email = principal.getAttribute("email");
            name = principal.getAttribute("name");

        } else if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = principal.getAttribute("kakao_account");
            if (kakaoAccount != null) {
                email = (String) kakaoAccount.get("email"); // 있을 수도 있고 없을 수도 있음
                if(email ==null){
                    email = registrationId+"_"+principal.getAttribute("id");
                }
                Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                if (profile != null) {
                    name = (String) profile.get("nickname");
                }
            }
        }


        User user=userService.processOAuthPostLogin(email, name, session);

        response.sendRedirect("http://localhost:3000/");

    }
}
