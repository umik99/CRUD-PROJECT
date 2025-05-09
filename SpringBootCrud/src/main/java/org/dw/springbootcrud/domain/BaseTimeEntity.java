package org.dw.springbootcrud.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Locale;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseTimeEntity {

    @CreatedDate
    @Column(name="regDate", updatable = false)
    @DateTimeFormat(pattern="yyyy-MM-dd/HH:mm:ss")
    private LocalDateTime regDate;


    @LastModifiedDate
    @Column(name="modDate")
    @DateTimeFormat(pattern="yyyy-MM-dd/HH:mm:ss")
    private LocalDateTime modDate;
}
