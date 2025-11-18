package com.librogeek.DTO;

import com.librogeek.Enums.Role;
import com.librogeek.Models.User;

public record UserDTO(
        Integer user_id,
        String username,
        String name,
        String profile_photo,
        Role role,
        String email

) {
    public UserDTO(User user) {
        this(
                user.getUser_id(),
                user.getUsername(),
                user.getName(),
                user.getProfile_photo(),
                user.getRole(),
                user.getEmail()
        );
    }
}