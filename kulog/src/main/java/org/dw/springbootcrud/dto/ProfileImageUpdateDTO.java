package org.dw.springbootcrud.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileImageUpdateDTO {

    public MultipartFile file;
}
