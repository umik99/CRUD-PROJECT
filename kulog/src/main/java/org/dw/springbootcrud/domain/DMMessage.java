package org.dw.springbootcrud.domain;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name="dm_message")
public class DMMessage {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name ="sender_id", nullable=false)
    private User sender;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name= "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false , columnDefinition = "TEXT")
    private String content;

    @Column(name = "send_at", nullable = false)
    private LocalDateTime sendAt = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean isRead = false;
}
