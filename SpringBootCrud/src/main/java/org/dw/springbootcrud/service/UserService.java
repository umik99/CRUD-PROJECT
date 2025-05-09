package org.dw.springbootcrud.service;


import jakarta.servlet.http.HttpSession;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.UserDTO;

import java.util.Optional;

public interface UserService {

    public void signup(UserDTO userDTO);

    public Optional<User> findByUsername(UserDTO userDTO);

    public User login(UserDTO userDTO, HttpSession session);

    public UserDTO entityToDTO(User user);

    public User processOAuthPostLogin(String email , String name, HttpSession session);
}
