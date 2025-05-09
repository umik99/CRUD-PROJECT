package org.dw.springbootcrud.repository;


import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.BoardLikes;
import org.dw.springbootcrud.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface BoardLikesRepository extends JpaRepository<BoardLikes, Long> {

    Optional<BoardLikes> findByUserAndBoard(User user, Board board);

    Long countByBoard(Board board);

    void deleteByUserAndBoard(User user, Board board);
}
