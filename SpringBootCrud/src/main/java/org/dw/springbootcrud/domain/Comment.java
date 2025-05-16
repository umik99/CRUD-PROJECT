package org.dw.springbootcrud.domain;


import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
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


    @Size(max = 200, message = "댓글은 200자 이내여야 합니다.")
    @Column(length = 200)
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
