package org.dw.springbootcrud.controller.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class HelloWorldController {
    @GetMapping("/hello")
    public String hello() {
        return "hello world";
    }
}
