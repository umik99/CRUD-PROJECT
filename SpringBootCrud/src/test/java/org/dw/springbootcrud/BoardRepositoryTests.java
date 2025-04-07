package org.dw.springbootcrud;


import org.dw.springbootcrud.domain.Board;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.service.UserService;
import org.dw.springbootcrud.service.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.dw.springbootcrud.repository.BoardRepository;

import java.util.stream.IntStream;

@SpringBootTest
@Log4j2
public class BoardRepositoryTests {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserService userService;

    @Test
    public void testInsert(){
        IntStream.rangeClosed(1,3).forEach(i -> {
            Board board = Board.builder()
                    .title("제목 테스트 더미 게시글"+i)
                    .content("콘텐츠 테스트 더미 게시글"+i)
                    .build();

            Board result = boardRepository.save(board);
        });


    }


}
