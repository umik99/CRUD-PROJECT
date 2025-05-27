package org.dw.springbootcrud.config;

import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.dto.BoardDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.internal.bytebuddy.matcher.StringMatcher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper getMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
                .setMatchingStrategy(MatchingStrategies.LOOSE);

        modelMapper.typeMap(Board.class, BoardDTO.class).addMappings(mapper -> {
            mapper.map(src -> src.getWriter().getNickname(), BoardDTO::setWriter);
        });

        modelMapper.typeMap(Board.class, BoardDTO.class)
                .addMappings(mapper -> mapper.skip(BoardDTO::setBookmarked));

        return modelMapper;


    }


}

