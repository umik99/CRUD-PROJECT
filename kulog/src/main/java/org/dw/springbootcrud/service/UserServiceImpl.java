package org.dw.springbootcrud.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.dw.springbootcrud.domain.OauthProvider;
import org.dw.springbootcrud.domain.Role;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.UserDTO;
import org.dw.springbootcrud.repository.BookmarkRepository;
import org.dw.springbootcrud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {

    @Autowired
    private final FileService fileService;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private BookmarkService bookmarkService;
    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Override
    public void signup(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 사용자입니다.");
        }
        User user = User.builder()
                .username(userDTO.getUsername())
                .nickname(userDTO.getUsername())
                .oauthProvider(OauthProvider.LOCAL)
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .uuid(UUID.randomUUID().toString())
                .role(userDTO.getRole() != null ? userDTO.getRole() : Role.ROLE_USER)
                .build();
        userRepository.save(user);
    }
    public UserDTO entityToDTO(User user) {
        return UserDTO.builder()
                .username(user.getUsername())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .uuid(user.getUuid())
                .password(user.getPassword())
                .role(user.getRole())
                .oauthProvider(user.getOauthProvider())
                .build();
    }

    @Override
    public Optional<User> findByUsername(UserDTO userDTO) {
        return userRepository.findByUsername(userDTO.getUsername());


    }

    @Override
    public User login(UserDTO userDTO, HttpSession session){


        User user = userRepository.findByUsername(userDTO.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        if (user.isDeleted()) {
            throw new RuntimeException("탈퇴한 사용자입니다.");
        }

        if(!passwordEncoder.matches(userDTO.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("아이디 또는 패스워드가 일치하지 않습니다.");
        }

        return user;
    }

    @Override
    public User processOAuthPostLogin(String email, String name, HttpSession session){

        Optional<User> optionalUser = userRepository.findByEmail(email);

        User user = optionalUser
                .orElseGet(()->{
                    User newUser = User.builder()
                            .username(name)
                            .nickname(name)
                            .email(email)
                            .password("SOCIAL_LOGIN_USER")
                            .role(Role.ROLE_USER)
                            .uuid(UUID.randomUUID().toString())
                            .oauthProvider(OauthProvider.SOCIAL)
                            .build();
                    return userRepository.save(newUser);
                });

        user.setDeleted(false);
        userRepository.save(user);
        session.setAttribute("user",user);

        return user;
    };

    @Override
    public void updateNickname(User loggedinUser, String nickname){
        Optional<User> optionalUser = userRepository.findByUsername(loggedinUser.getUsername());

        User user = optionalUser.orElseThrow(()->new UsernameNotFoundException("User Not Found"));

        user.setNickname(nickname);

        userRepository.save(user);
    }

    @Override
    public void updatePassword(User loggedinUser, String currentPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findByUsername(loggedinUser.getUsername());
        User user = optionalUser.orElseThrow(()->new UsernameNotFoundException("User Not Found"));

        if(!passwordEncoder.matches(currentPassword, user.getPassword())){
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다. ");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public UserDTO updateProfileImage(User user, MultipartFile file) throws IOException{


        String oldImage = user.getProfileImage();
        if (oldImage  != null && !oldImage.isBlank() ){
           fileService.deleteProfileImage(oldImage);

        }


        String savedname  = fileService.saveProfileImage(file,user);

        if(savedname != null){
            user.setProfileImage(savedname);
            userRepository.save(user);
        }

        return UserDTO.builder()
                .username(user.getUsername())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .build();
    }

    @Override
    public void deleteProfileImage(User user, String oldPath) {
        if (oldPath != null && !oldPath.contains("default")) {
            fileService.deleteProfileImage(oldPath);

        }
        user.setProfileImage(null);
        userRepository.save(user);

    }

    @Override
    public void deleteUser(User user) {
        user.setDeleted(true);
        userRepository.save(user);
        bookmarkRepository.deleteByUser(user);

    }


}
