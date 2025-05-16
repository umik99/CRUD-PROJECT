package org.dw.springbootcrud.repository;

import org.dw.springbootcrud.domain.Board;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface BoardRepository extends JpaRepository<Board, Long> {
    //페이징처리

    List<Board> findTop5ByOrderByRegDateDesc();

}
