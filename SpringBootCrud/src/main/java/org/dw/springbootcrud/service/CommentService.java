package org.dw.springbootcrud.service;

import jakarta.servlet.http.HttpSession;
import org.dw.springbootcrud.dto.CommentDTO;
import org.dw.springbootcrud.dto.PageRequestDTO;
import org.dw.springbootcrud.dto.PageResponseDTO;

public interface CommentService {

    void register(Long bno, CommentDTO commentDTO, String username, HttpSession session);

    PageResponseDTO<CommentDTO> getList(Long bno, PageRequestDTO pageRequestDTO);

    void deleteComment(Long id);

}
