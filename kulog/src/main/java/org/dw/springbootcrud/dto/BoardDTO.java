package org.dw.springbootcrud.dto;

import lombok.*;
import org.springframework.data.jpa.repository.Meta;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class BoardDTO {
    private Long bno;

    @NotEmpty
    @Size(min = 3, max = 100)
    private String title;

    @NotEmpty
    private String content;

    @NotEmpty
    private String writer;


    private String writerProfileImg;

    private LocalDateTime regDate;
    private LocalDateTime modDate;

    private String category;


    private Boolean bookmarked;

    private List<FileMetaDTO> meta; //수정용

    private List<UploadFileDTO> files; //업로드용

    private List<FileMetaDTO> removeFiles; //수정용

    private UserDTO user;


    private int replyCount;

    private int viewCount;

    private Long likeCount;

}
