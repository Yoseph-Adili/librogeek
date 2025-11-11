package com.librogeek.Services;

import com.librogeek.Models.User;
import com.librogeek.Repositories.UserRepository;

import com.librogeek.Utils.ServiceResult;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public ServiceResult<User> getUserById(Integer userId) {
        return userRepository.findById(userId)
                .map(user -> ServiceResult.success(user, "User retrieved successfully"))
                .orElseGet(() -> ServiceResult.failure("User not found"));
    }


    public ServiceResult<User> register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ServiceResult.failure("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return ServiceResult.success(savedUser, "User created successfully");
    }
}

