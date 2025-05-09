package org.dw.springbootcrud.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.dw.springbootcrud.domain.Role;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    @NotEmpty
    private String username;

    @NotEmpty
    private String password;

    private Role role;

    private Long userId;
}
