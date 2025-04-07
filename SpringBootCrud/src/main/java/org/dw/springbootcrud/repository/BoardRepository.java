package org.dw.springbootcrud.repository;

import org.dw.springbootcrud.domain.Board;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BoardRepository extends JpaRepository<Board, Long> {
    //페이징처리
    Page<Board> findAll(Pageable pageable);


}
