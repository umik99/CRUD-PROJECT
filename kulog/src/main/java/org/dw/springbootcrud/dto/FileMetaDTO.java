package org.dw.springbootcrud.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class FileMetaDTO {

    private String name;

    private int order;

    private String type;
}
