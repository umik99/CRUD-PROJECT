package org.dw.springbootcrud.repository;

import jakarta.transaction.Transactional;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.Bookmark;
import org.dw.springbootcrud.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    public Optional<Bookmark> findByUserAndBoard(User user, Board board);

    public Page<Bookmark> findByUser(User user , Pageable pageable);

    public boolean existsByUserAndBoard(User user, Board board);

    @Modifying
    @Transactional
    @Query("DELETE FROM Bookmark b WHERE b.user = :user AND b.board.bno IN :bnoList")
    void deleteByUserAndBoardBnoIn(@Param("user") User user, @Param("bnoList") List<Long> bnoList);
}
