package org.dw.springbootcrud.dto;

import lombok.*;

@Builder
@Data
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NicknameUpdateDTO {
    private String nickname;
}
