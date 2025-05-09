package org.dw.springbootcrud.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.dw.springbootcrud.domain.User;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CommentDTO {

    private Long id;
    private String content;

    @JsonProperty("isAnonymous")
    private boolean anonymous;

    private String writer;

    private Long writerId;

    private LocalDateTime regDate;
}
