package org.dw.springbootcrud.dto;


import lombok.*;
import org.dw.springbootcrud.domain.User;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@Getter
@Setter
public class DMContactDTO {

    private Long userid;
    private String nickname;
    private String uuid;
    private String profileImage;
    private LocalDateTime lastMessageAt; // ← 추가
    private int unreadCount;
    private Boolean isDeleted;



    public DMContactDTO(Long userid, String nickname, String profileImage, String uuid, LocalDateTime lastMessageAt, int unreadCount, Boolean isDeleted) {
        this.userid = userid;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.uuid = uuid;
        this.lastMessageAt = lastMessageAt;
        this.unreadCount = unreadCount;
        this.isDeleted = isDeleted;
    }

}
