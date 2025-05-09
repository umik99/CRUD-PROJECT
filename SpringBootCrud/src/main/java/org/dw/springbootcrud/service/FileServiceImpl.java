package org.dw.springbootcrud.service;

import jakarta.transaction.Transactional;
import net.coobird.thumbnailator.Thumbnails;
import org.codehaus.groovy.tools.shell.IO;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.UploadFile;
import org.dw.springbootcrud.dto.FileMetaDTO;
import org.dw.springbootcrud.dto.UploadFileDTO;
import org.dw.springbootcrud.repository.BoardRepository;
import org.dw.springbootcrud.repository.UploadFileRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    private static final String BASE_DIR = System.getProperty("user.dir") + File.separator + "uploads";

    private static final String UPLOAD_DIR = BASE_DIR+ File.separator+"originals";
    private static final String THUMBNAIL_DIR = BASE_DIR+ File.separator+"thumbnails";

    @Autowired
    private UploadFileRepository uploadFileRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private BoardRepository boardRepository;

    @Override
    public List<UploadFile> saveFiles(MultipartFile[] files, Board board) throws IOException {
        List<UploadFile> uploadFiles = new ArrayList<>();

        File uploadDir = new File(UPLOAD_DIR);
        File thumbDir = new File(THUMBNAIL_DIR);


        if(!uploadDir.exists()) uploadDir.mkdirs();
        if(!thumbDir.exists()) thumbDir.mkdirs();

        for (int i=0; i<files.length; i++) {
            MultipartFile file = files[i];
            if(file.isEmpty()) continue;

            String originalName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String ext = originalName.substring(originalName.lastIndexOf("."));
            String savedName = uuid + ext;

            File originalFile = new File(uploadDir, savedName);
            file.transferTo(originalFile);

            File thumbFile = new File(thumbDir, savedName);
            Thumbnails.of(originalFile).size(200, 200).toFile(thumbFile);


            UploadFile uploadFile = new UploadFile();
            uploadFile.setSavedName(savedName);
            uploadFile.setFilePath("uploads/originals/"+ savedName);
            uploadFile.setThumbnailPath("uploads/thumbnails/" + savedName);
            uploadFile.setFileOrder(i);

            uploadFile.setBoard(board);
            uploadFileRepository.save(uploadFile);

            uploadFiles.add(uploadFile);
        }
        return uploadFiles;
    }

    @Override
    public List<UploadFileDTO> findFilesByBoard(Long bno) {
        Board board = boardRepository.getOne(bno);
        List<UploadFile> uploadFiles = uploadFileRepository.findByBoardOrderByFileOrderAsc(board);

        List<UploadFileDTO> uploadFileDTOS = modelMapper.map(
                uploadFiles,
                new TypeToken<List<UploadFileDTO>>() {
                }.getType());

        return uploadFileDTOS;

    }

    @Override
    public void updateFileOrder(String savedName, Integer newOrder) {

        uploadFileRepository.updateFileOrderBySavedName(savedName, newOrder);
    }



    @Override
    public void saveNewFile(Long bno, MultipartFile file,Integer fileOrder) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        File thumbDir = new File(THUMBNAIL_DIR);
        if(!uploadDir.exists()) uploadDir.mkdirs();
        if(!thumbDir.exists()) thumbDir.mkdirs();

        if(file.isEmpty()) return;

        String originalName = file.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String ext = originalName.substring(originalName.lastIndexOf("."));
        String savedName = uuid + ext;

        File originalFile = new File(uploadDir, savedName);
        file.transferTo(originalFile);

        File thumbFile = new File(thumbDir, savedName);
        Thumbnails.of(originalFile).size(200, 200).toFile(thumbFile);


        UploadFile uploadFile = new UploadFile();
        uploadFile.setSavedName(savedName);
        uploadFile.setFilePath("uploads/originals/"+ savedName);
        uploadFile.setThumbnailPath("uploads/thumbnails/" + savedName);
        uploadFile.setFileOrder(fileOrder);


        Board board = boardRepository.getOne(bno);
        uploadFile.setBoard(board);
        uploadFileRepository.save(uploadFile);


    }


    @Transactional
    @Override
    public void deleteFile(List<FileMetaDTO> removeFiles) {
        if (removeFiles == null || removeFiles.size() == 0) {
            return;
        }
        String[] files = new String[removeFiles.size()];
        for (int i = 0; i < removeFiles.size(); i++) {
            FileMetaDTO uploadFile = removeFiles.get(i);
            files[i] = uploadFile.getName();
            uploadFileRepository.deleteBySavedName(uploadFile.getName());
        }
        deleteLocalFile(files);
    }

    @Override
    public void deleteLocalFile(String[] files) {
        if (files == null || files.length == 0) {
            return;
        }

        for(String file : files) {
            new File(UPLOAD_DIR+file).delete();
            new File(THUMBNAIL_DIR+file).delete();
        }


    }
}
