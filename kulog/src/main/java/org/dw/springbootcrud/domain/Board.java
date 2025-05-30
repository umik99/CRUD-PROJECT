package org.dw.springbootcrud.domain;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Board extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bno;

    @Column(length= 500, nullable = false)
    private String title;

    @Column(length=5000, nullable = false)
    private String content;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_userid")
    private User writer;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<BoardLikes> boardLikes = new ArrayList<>();

    @Column(nullable=false)
    private int viewCount =0;

    @OneToMany(mappedBy= "board" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UploadFile> files = new ArrayList<>();

    @Column(nullable = true)
    private String category;

    @OneToMany(mappedBy = "board" , cascade = CascadeType.REMOVE ,orphanRemoval = true)
    @ToString.Exclude
    private List<Bookmark> bookmarked = new ArrayList<>();

    @Column
    private Double latitude;

    @Column
    private Double longitude;
}
