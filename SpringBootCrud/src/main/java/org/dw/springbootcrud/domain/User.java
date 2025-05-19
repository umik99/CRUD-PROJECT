package org.dw.springbootcrud.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userid;


    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private String email;

    @Enumerated(EnumType.STRING) // 🔥 Role을 String으로 저장
    @Column(nullable = false)
    private Role role; // ROLE_USER, ROLE_ADMIN 중 하나 저장

    @OneToMany(mappedBy="writer", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<Board> boards = new ArrayList<>();


    @OneToMany(mappedBy="user" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<Bookmark> bookmarks = new ArrayList<>();


}
