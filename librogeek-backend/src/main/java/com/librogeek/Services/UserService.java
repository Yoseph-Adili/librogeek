package com.librogeek.Services;

import com.librogeek.Models.User;
import com.librogeek.Repositories.UserRepository;

import com.librogeek.Requests.LoginRequest;
import com.librogeek.Requests.RegisterRequest;
import com.librogeek.Utils.ServiceResult;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {


        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;


    }

    public ServiceResult<User> getUserById(Integer userId) {
        return userRepository.findById(userId).map(user -> ServiceResult.success(user, "User retrieved successfully")).orElseGet(() -> ServiceResult.failure("User not found"));
    }

    public ServiceResult<User> login(LoginRequest request) {

        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            return ServiceResult.failure("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ServiceResult.failure("Password is required");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);
        if (user == null) {
            return ServiceResult.failure("User not found");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ServiceResult.failure("Password is incorrect");
        }

        return ServiceResult.success(user, "Login successful");
    }



    public ServiceResult<User> register(RegisterRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ServiceResult.failure("Passwords do not match");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return ServiceResult.failure("Username already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());

        User savedUser = userRepository.save(user);
        return ServiceResult.success(savedUser, "User created successfully");

    }
    public ServiceResult<User> getUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ServiceResult.failure("User not found");
        }
        return ServiceResult.success(user.get(), "User found successfully");
    }


}

