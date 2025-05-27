package org.dw.springbootcrud.dto;

import lombok.*;

import java.io.File;

@Data
@Builder
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class UploadFileDTO {


    private String savedName;

    private Integer fileOrder;






}
