package org.dw.springbootcrud.domain;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String content;

    private boolean anonymous;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="board_bno")
    private Board board;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_userid",nullable=true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User writer;

}
