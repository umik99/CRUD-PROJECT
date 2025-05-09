package org.dw.springbootcrud.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.dw.springbootcrud.domain.Role;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.UserDTO;
import org.dw.springbootcrud.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void signup(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 사용자입니다.");
        }
        User user = User.builder()
                .username(userDTO.getUsername())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .role(userDTO.getRole() != null ? userDTO.getRole() : Role.ROLE_USER)
                .build();
        userRepository.save(user);
    }
    public UserDTO entityToDTO(User user) {
        return UserDTO.builder()
                .username(user.getUsername())
                .userId(user.getUserid())
                .password(user.getPassword())
                .role(user.getRole())
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

        if(!passwordEncoder.matches(userDTO.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("Wrong Password");
        }

        session.setAttribute("user", user);
        return user;
    }

    @Override
    public User processOAuthPostLogin(String email, String name, HttpSession session){

        Optional<User> optionalUser = userRepository.findByEmail(email);

        User user = optionalUser
                .orElseGet(()->{
                    User newUser = User.builder()
                            .username(name)
                            .email(email)
                            .password("SOCIAL_LOGIN_USER")
                            .role(Role.ROLE_USER)
                            .build();
                    return userRepository.save(newUser);
                });

        session.setAttribute("user",user);

        return user;
    };

}
