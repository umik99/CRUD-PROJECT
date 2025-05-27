package org.dw.springbootcrud.repository;

import org.dw.springbootcrud.domain.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardSearch  {
    Page<Board> searchAll(String type, String keyword,Pageable pageable);

    public Page<Board> searchAllByCategory(String Category, String type, String keyword, Pageable pageable);

}
