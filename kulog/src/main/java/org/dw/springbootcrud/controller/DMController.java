package org.dw.springbootcrud.controller;

import jakarta.servlet.http.HttpSession;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.DMContactDTO;
import org.dw.springbootcrud.dto.DMMessageDTO;
import org.dw.springbootcrud.repository.UserRepository;
import org.dw.springbootcrud.service.DMService;
import org.dw.springbootcrud.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/message")
public class DMController {

    @Autowired
    private final DMService dmService;

    @Autowired
    private final UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestBody DMMessageDTO dto, HttpSession session) {
        System.out.println("Content: " + dto.getContent());

        User sender = (User) session.getAttribute("user");
        if (sender == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        dto.setSenderId(sender.getUserid());


        dmService.sendMessage(dto);
        return ResponseEntity.ok().build();


    }

    @GetMapping("/history/{otherId}")
    public ResponseEntity<List<DMMessageDTO>> history(@PathVariable Long otherId, HttpSession session) {
        User me = (User) session.getAttribute("user");
        if (me == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<DMMessageDTO> list = dmService.getHistory(me.getUserid(), otherId);

        return ResponseEntity.ok().body(list);
    }


    @GetMapping("/contacts")
    public ResponseEntity<List<DMContactDTO>> getContacts(
            @RequestParam(value = "receiverId", required = false) Long receiverId,
            HttpSession session) {

        User me = (User) session.getAttribute("user");
        if (me == null) throw new RuntimeException("로그인 필요");

        return ResponseEntity.ok(dmService.getContacts(me, receiverId));

        }




}
