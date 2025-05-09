package org.dw.springbootcrud.service;


import jakarta.servlet.http.HttpSession;

public interface BoardLikesService {

    public boolean toogleLike(Long bno, String username, HttpSession session);

    public Long getLikesCount(Long bno);


}
