package org.dw.springbootcrud.repository;


import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.QBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BoardRepositoryImpl implements BoardSearch{

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Board> searchAll(String type, String keyword, Pageable pageable){

        QBoard board = QBoard.board;

        BooleanBuilder builder = new BooleanBuilder();

        if(keyword !=null && !keyword.isEmpty()) {
            switch (type) {
                case "t":
                    builder.and(board.title.contains(keyword));
                    break;

                case "c":
                    builder.and(board.content.contains(keyword));
                    break;

                case "u":
                    builder.and(board.writer.nickname.contains(keyword));
                    break;
                default:
                    break;
            }
        }

            List<Board> results = queryFactory
                    .selectFrom(board)
                    .where(builder)
                    .offset(pageable.getOffset())
                    .limit(pageable.getPageSize())
                    .orderBy(board.bno.desc())
                    .fetch();

            return PageableExecutionUtils.getPage(results, pageable,
                    () -> queryFactory.selectFrom(board).where(builder).fetchCount());
        }

    @Override
    public Page<Board> searchAllByCategory(String category, String type, String keyword, Pageable pageable){

        QBoard board = QBoard.board;

        BooleanBuilder builder = new BooleanBuilder();


        if (category.equals("etc") || category.isBlank() || category == null){
            builder.and(board.category.isNull()
                    .or(board.category.eq("etc")));
        } else {
            builder.and(board.category.eq(category));
        }

        if(keyword !=null && !keyword.isEmpty()) {
            switch (type) {
                case "t":
                    builder.and(board.title.contains(keyword));
                    break;

                case "c":
                    builder.and(board.content.contains(keyword));
                    break;

                case "u":

                    builder.and(board.writer.nickname.contains(keyword))
                            .and(board.writer.deleted.eq(false));
                    break;
                default:
                    break;
            }
        }

        List<Board> results = queryFactory
                .selectFrom(board)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(board.bno.desc())
                .fetch();

        return PageableExecutionUtils.getPage(results, pageable,
                () -> queryFactory.selectFrom(board).where(builder).fetchCount());
    }




    }

