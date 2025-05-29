package org.dw.springbootcrud.repository;

import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.DMMessage;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.DMContactDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;



public interface DMRepository extends JpaRepository<DMMessage, Long> {

    @Query("SELECT m from DMMessage m " +
            "WHERE (m.sender.userid = :userA AND m.receiver.userid = :userB)" +
            "   OR (m.sender.userid = :userB AND m.receiver.userid = :userA)" +
            "ORDER BY m.sendAt ASC")
    List<DMMessage> findHistory(@Param("userA") Long userA, @Param("userB") Long userB);


    List<DMMessage> findBySenderOrReceiver(User sender, User receiver);

    List<DMMessage> findBySenderUseridAndReceiverUseridOrSenderUseridAndReceiverUseridOrderBySendAt(
            Long senderId1, Long receiverId1, Long senderId2, Long receiverId2
    );

}
