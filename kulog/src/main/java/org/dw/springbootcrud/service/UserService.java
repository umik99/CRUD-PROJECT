package org.dw.springbootcrud.service;


import jakarta.servlet.http.HttpSession;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.dto.UserDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface UserService {

    public void signup(UserDTO userDTO);

    public Optional<User> findByUsername(UserDTO userDTO);

    public User login(UserDTO userDTO, HttpSession session);

    public UserDTO entityToDTO(User user);

    public User processOAuthPostLogin(String email , String name, HttpSession session);

    public void updateNickname(User loggedinUser, String nickname);

    public void updatePassword(User loggedinUser, String currentPassword, String newPassword);

    public UserDTO updateProfileImage(User user, MultipartFile file) throws IOException;

    public void deleteProfileImage(User user, String oldPath);

    public void deleteUser(User user);
}
