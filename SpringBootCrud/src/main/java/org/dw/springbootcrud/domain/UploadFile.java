package org.dw.springbootcrud.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class UploadFile {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String savedName;
    private String filePath;
    private String thumbnailPath;

    private Integer fileOrder;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name= "board_id")
    private Board board;

}
