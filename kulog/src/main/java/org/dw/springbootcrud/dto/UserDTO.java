package org.dw.springbootcrud.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.dw.springbootcrud.domain.OauthProvider;
import org.dw.springbootcrud.domain.Role;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    @NotEmpty
    private String username;

    @NotEmpty
    private String password;

    private String nickname;
    private String profileImage;

    private Role role;
    private OauthProvider oauthProvider;

    private String uuid;

    private boolean deleted;
}
