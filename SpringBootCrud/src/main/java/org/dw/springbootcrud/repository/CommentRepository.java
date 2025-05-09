package org.dw.springbootcrud.repository;


import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    int countByBoard(Board board);  // 이 메서드 추가!

    Page<Comment> findByBoard(Board board, Pageable pageable);
}
