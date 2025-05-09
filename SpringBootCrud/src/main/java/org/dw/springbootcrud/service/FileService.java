package org.dw.springbootcrud.service;

import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.UploadFile;
import org.dw.springbootcrud.dto.FileMetaDTO;
import org.dw.springbootcrud.dto.UploadFileDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {

    public List<UploadFile> saveFiles(MultipartFile[] files, Board board) throws IOException;

    public List<UploadFileDTO> findFilesByBoard(Long bno);

    public void updateFileOrder(String savedName, Integer newOrder);

    public void saveNewFile(Long bno, MultipartFile file, Integer fileOrder) throws IOException;


    public void deleteFile(List<FileMetaDTO> removeFiles) throws IOException;

    public void deleteLocalFile(String[] uploadFiles);
}
