package org.dw.springbootcrud.service;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.UploadFile;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.BoardDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;
import org.dw.springbootcrud.dto.UploadFileDTO;
import org.dw.springbootcrud.repository.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.View;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    @Autowired
    private final BoardRepository boardRepository;

    @Autowired
    private final BoardSearch boardSearch;
    private final ModelMapper modelMapper;

    @Autowired
    private FileService fileService;

    @Autowired
    private final CommentRepository commentRepository;

    @Autowired
    private final BoardLikesRepository boardLikesRepository;

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private View view;
    @Autowired
    private UploadFileRepository uploadFileRepository;


    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Override
    public PageResponseDTO<BoardDTO> getBoardList(String category, PageRequestDTO requestDTO) {
        Pageable pageable = requestDTO.getPageable("bno");

        Page<Board> result = boardSearch.searchAllByCategory(
                category,
                requestDTO.getType(),
                requestDTO.getKeyword(),
                pageable
        );

        List<BoardDTO> dtoList = result.getContent().stream()
                .map(board -> {
                    int replyCount = commentRepository.countByBoard(board);
                    Long likeCount = boardLikesRepository.countByBoard(board);
                    List<UploadFile> uploadFiles = uploadFileRepository.findByBoardOrderByFileOrderAsc(board);

                    List<UploadFileDTO> uploadFileDTOS = modelMapper.map(
                            uploadFiles,
                            new TypeToken<List<UploadFileDTO>>() {
                            }.getType());

                    BoardDTO dto = modelMapper.map(board, BoardDTO.class);
                    dto.setBookmarked(null);
                    dto.setLikeCount(likeCount);
                    dto.setReplyCount(replyCount);
                    dto.setFiles(uploadFileDTOS);
                    dto.setRemoveFiles(null);

                    return dto;
                }).collect(Collectors.toList());

        return PageResponseDTO.<BoardDTO>withAll()
                .pageRequestDTO(requestDTO)
                .dtoList(dtoList)
                .total((int)result.getTotalElements())
                .build();
    }

    @Override
    public BoardDTO read(Long bno, User user) {
        Board board = boardRepository.getOne(bno);



        BoardDTO boardDTO= modelMapper.map(board, BoardDTO.class);

        List<UploadFileDTO> fileDTOs  = uploadFileRepository.findByBoardOrderByFileOrderAsc(board)
                .stream()
                .map(file ->new UploadFileDTO(file.getSavedName(), file.getFileOrder()))
                .collect(Collectors.toList());


        if (user != null) {
            boolean bookmarked = bookmarkRepository.existsByUserAndBoard(user, board);
            boardDTO.setBookmarked(bookmarked);
        } else {
            boardDTO.setBookmarked(false);
        }


        boardDTO.setFiles(fileDTOs);
        boardDTO.setRemoveFiles(null);

        return boardDTO;
    }

    @Override
    @Transactional
    public void increaseViewCount(Long bno) {
        Board board = boardRepository.getOne(bno);
        board.setViewCount(board.getViewCount() + 1);
    }

    @Override
    public void register(BoardDTO boardDTO, MultipartFile[] files, HttpSession session) throws IOException {



        String username = boardDTO.getUser().getUsername();

        User user = (User) session.getAttribute("user");



        Board board = modelMapper.map(boardDTO, Board.class);
        board.setWriter(user);

        Board saved = boardRepository.save(board);

        if (files != null && files.length > 0) {
            List<UploadFile> uploadFiles = fileService.saveFiles(files, board);
        }

/*
        List<String> filePaths = uploadFiles.stream()
                .map(uploadFile -> uploadFile.getFilePath())
                .collect(Collectors.toList());

        BoardDTO savedDTO = modelMapper.map(saved, BoardDTO.class);

*/
    }


    @Override
    public BoardDTO modify(BoardDTO boardDTO) {
        Board board = boardRepository.findById(boardDTO.getBno())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다."));


        board.setContent(boardDTO.getContent());
        board.setTitle(boardDTO.getTitle());

        Board modified = boardRepository.save(board);
        return modelMapper.map(modified, BoardDTO.class);

    }


    @Override
    public void deleteBoard(Long bno) {
        Board board = boardRepository.findById(bno)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        List<UploadFileDTO> uploadFiles = uploadFileRepository.findByBoardOrderByFileOrderAsc(board).stream()
                .map(file -> modelMapper.map(file, UploadFileDTO.class))
                .collect(Collectors.toList());

        String[] files = uploadFiles.stream()
                .map(UploadFileDTO::getSavedName)
                .toArray(String[]::new);


        fileService.deleteLocalFile(files);

        boardRepository.delete(board);
    }


    @Override
    public List<BoardDTO> recentBoards() {

        List<Board> boards = boardRepository.findTop5ByOrderByRegDateDesc();

        return boards.stream()
                .map(board ->{

                    BoardDTO boardDTO =  modelMapper.map(board, BoardDTO.class);
                    Long likeCount = boardLikesRepository.countByBoard(board);
                    boardDTO.setLikeCount(likeCount);

                    int replyCount = commentRepository.countByBoard(board);
                    boardDTO.setReplyCount(replyCount);
                    return boardDTO;
                }).collect(Collectors.toList());



    }
}
