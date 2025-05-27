package org.dw.springbootcrud.dto;


import lombok.*;

@Data
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordChangeDTO {
    private String currentPassword;
    private String newPassword;
}
