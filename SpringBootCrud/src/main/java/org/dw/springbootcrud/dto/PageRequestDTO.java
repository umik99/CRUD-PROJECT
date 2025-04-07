package org.dw.springbootcrud.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageRequestDTO {

    @Builder.Default
    private int page=1;

    @Builder.Default
    private int size=10;

    private String type;

    private String keyword;

    public Pageable getPageable(String ... props) {
        return PageRequest.of(this.page -1, this.size, Sort.by(props).descending());
    }

}
