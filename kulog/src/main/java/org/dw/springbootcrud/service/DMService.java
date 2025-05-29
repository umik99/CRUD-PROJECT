package org.dw.springbootcrud.service;

import jakarta.transaction.Transactional;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.DMContactDTO;
import org.dw.springbootcrud.dto.DMMessageDTO;
import org.dw.springbootcrud.domain.DMMessage;
import org.dw.springbootcrud.repository.DMRepository;
import org.dw.springbootcrud.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DMService {
    private final DMRepository dmRepository;
    private final UserRepository userRepository;

    public void sendMessage(DMMessageDTO dto){

        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(()-> new IllegalArgumentException("보낸 유저 없음"));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(()->new IllegalArgumentException("받는 유저 없음"));

        DMMessage message = DMMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(dto.getContent())
                .sendAt(LocalDateTime.now())
                .isRead(false)
                .build();

        dmRepository.save(message);
    }

    @Transactional
    public List<DMMessageDTO> getHistory(Long meId, Long otherId){

        List<DMMessage> messages = dmRepository.findBySenderUseridAndReceiverUseridOrSenderUseridAndReceiverUseridOrderBySendAt(meId, otherId, otherId, meId);


        for(DMMessage msg : messages){
            if(msg.getReceiver().getUserid().equals(meId) && !Boolean.TRUE.equals(msg.getIsRead())){
                msg.setIsRead(true);
            }
        }

        return messages.stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }


    public List<DMContactDTO> getContacts(User me, Long receiverId){
        List<DMMessage> messages = dmRepository.findBySenderOrReceiver(me, me);
        Map<Long, LocalDateTime> latestMessageMap = new HashMap<>();

        Map<Long, Integer> unreadMap = new HashMap<>();

        for (DMMessage msg : messages) {
            User other = msg.getSender().getUserid().equals(me.getUserid())? msg.getReceiver(): msg.getSender();
            if (msg.getReceiver().getUserid().equals(me.getUserid()) && !Boolean.TRUE.equals(msg.getIsRead())) {

                unreadMap.put(other.getUserid(),unreadMap.getOrDefault(other.getUserid(),0) + 1);
            }
        }


        for(DMMessage m : messages){
            User other = m.getSender().getUserid().equals(me.getUserid()) ? m.getReceiver() : m.getSender();
            LocalDateTime sendAt = m.getSendAt();
            latestMessageMap.merge(
                    other.getUserid(),
                    sendAt,
                    (oldTime, newTime) -> newTime.isAfter(oldTime) ? newTime : oldTime
            );
        }

        Set<Long> contactIds = new HashSet<>();
        List<DMContactDTO > contacts = new ArrayList<>();

        for(DMMessage m : messages){
            User other = m.getSender().getUserid().equals(me.getUserid()) ? m.getReceiver() : m.getSender();
            if(contactIds.add(other.getUserid())){
                contacts.add(new DMContactDTO(
                        other.getUserid(), other.getNickname(),
                        other.getProfileImage(),
                        other.getUuid(),
                        latestMessageMap.get(other.getUserid()),
                        unreadMap.getOrDefault(other.getUserid(),0),
                        other.isDeleted()

                ));
            }
        }

        if (receiverId != null & contacts.stream().noneMatch(c -> c.getUserid().equals(receiverId))){
            userRepository.findById(receiverId).ifPresent(user -> {
                contacts.add(new DMContactDTO(
                        user.getUserid(),
                        user.getNickname(),
                        user.getProfileImage(),
                        user.getUuid(),
                        null,
                        0,
                        false
                ));
            });
        }

        contacts.sort((a,b)->{
            LocalDateTime timeA = latestMessageMap.getOrDefault(a.getUserid(),LocalDateTime.MIN);
            LocalDateTime timeB = latestMessageMap.getOrDefault(b.getUserid(),LocalDateTime.MIN);
            return timeB.compareTo(timeA);
        });
        return contacts;
    }


    private DMMessageDTO entityToDTO(DMMessage entity){
        return DMMessageDTO.builder()
                .id(entity.getId())
                .senderId(entity.getSender().getUserid())
                .receiverId(entity.getReceiver().getUserid())
                .content(entity.getContent())
                .isRead(entity.getIsRead())
                .sendAt(entity.getSendAt())
                .build();
    }



}
