package com.librogeek.Services;

import com.librogeek.Component.VerificationCodeManager;
import com.librogeek.Models.User;
import com.librogeek.Repositories.UserRepository;

import com.librogeek.Requests.ChangeNamesRequest;
import com.librogeek.Requests.ChangePasswordRequest;
import com.librogeek.Requests.LoginRequest;
import com.librogeek.Requests.RegisterRequest;
import com.librogeek.Utils.ServiceResult;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.IOException;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final EmailService emailService;
    private final VerificationCodeManager verificationCodeManager;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService, VerificationCodeManager verificationCodeManager) {


        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.verificationCodeManager = verificationCodeManager;

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

    public ServiceResult<User> logout() {

        return ServiceResult.success(null, "Logout successful");

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

    public ServiceResult<User> changeUserNames(Integer user_id, @Valid ChangeNamesRequest request) {
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            return ServiceResult.failure("Username is required");
        }
        User user = userRepository.findById(user_id)
                .orElse(null);
        if (user == null) {
            return ServiceResult.failure("User not found");
        }
        if (user_id != user.getUser_id()) {
            return ServiceResult.failure("Unauthorized");
        }
        if (userRepository.existsByUsername(request.getUsername()) && !user.getUsername().equals(request.getUsername())) {
            return ServiceResult.failure("Username already exists");
        }
        System.out.println("this is user:" + user);
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        userRepository.save(user);
        return ServiceResult.success(user, "User names changed successfully");
    }

    public ServiceResult<User> changeUserPassword(Integer user_id, @Valid ChangePasswordRequest request) {
        User user = userRepository.findById(user_id)
                .orElse(null);
        if (user == null) {
            return ServiceResult.failure("User not found");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ServiceResult.failure("Current password is incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ServiceResult.failure("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ServiceResult.success(user, "User passwords changed successfully");
    }

    public ServiceResult<User> changeUserEmail(Integer user_id, @RequestParam String email) throws MessagingException {
        User user = userRepository.findById(user_id)
                .orElse(null);
        if (user == null) {
            return ServiceResult.failure("User not found");
        }

        String code = verificationCodeManager.generateCode(Long.valueOf(user_id), email);

        emailService.sendHtmlEmail(
                email,
                "Verify your email",
                user.getName(), // name 参数
                code
        );


        return ServiceResult.success(null, "Verification email sent successfully");
    }

    public ServiceResult<User> verifiedEmail(Integer user_id, @RequestParam String code) {
        User user = userRepository.findById(user_id)
                .orElse(null);
        if (user == null) {
            return ServiceResult.failure("User not found");
        }

        String email = verificationCodeManager.verifyCode(Long.valueOf(user_id), code);
        if (email == null) {
            return ServiceResult.failure("Invalid verification code");
        }
        user.setEmail(email);
        userRepository.save(user);

        return ServiceResult.success(null, "Email verified and updated successfully");
    }

    public ServiceResult<User> uploadPhoto(Integer user_id, @Valid MultipartFile imageFile) {

        User user = userRepository.findById(user_id)
                .orElse(null);
        if (user == null) {
            return ServiceResult.failure("User not found");
        }
        if (imageFile.isEmpty()) {
            return ServiceResult.failure("No image file provided");
        }
        if (!imageFile.getContentType().startsWith("image/")) {
            return ServiceResult.failure("Invalid image file type");
        }
        try {

            try {
                if (user.getProfile_photo() != null && !user.getProfile_photo().isEmpty()) {
                    Path oldFile = Paths.get("librogeek-backend/uploads/profiles/")
                            .resolve(user.getProfile_photo().replace("profile/", ""));
                    Files.deleteIfExists(oldFile);
                }
            } catch (Exception err) {
                System.out.println("Failed to delete old file: " + err.getMessage());
            }


            String filename = "profile_" + user_id + "_" + System.currentTimeMillis() + imageFile.getOriginalFilename().substring(imageFile.getOriginalFilename().lastIndexOf("."));


            Path uploadPath = Paths.get("librogeek-backend/uploads/profiles/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created directory: " + uploadPath.toAbsolutePath());
            }
            Path filePath = uploadPath.resolve(filename);


            try (InputStream input = imageFile.getInputStream()) {
                Files.copy(input, filePath, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("COPY SUCCESS: " + filePath.toAbsolutePath());
            } catch (Exception e) {
                System.out.println("COPY FAILED: " + e.getMessage());
                e.printStackTrace();
            }

            System.out.println("Saving to path: " + filePath.toAbsolutePath());


            user.setProfile_photo("profile/" + filename);
            userRepository.save(user);

            return ServiceResult.success(user, "Profile photo updated successfully");

        } catch (IOException e) {
            e.printStackTrace();
            return ServiceResult.failure("Failed to save image: " + e.getMessage());
        }
    }

    public ServiceResult<User> loginUserByEmail(@RequestParam String email) throws MessagingException {
        User user = (User) userRepository.findByEmail(email)
                .orElse(null);
        if (user == null) {
            return ServiceResult.failure("User not found");
        }

        String code = verificationCodeManager.generateCode(Long.valueOf(user.getUser_id()), email);

        emailService.sendHtmlEmail(
                email,
                "Verify your email",
                user.getName(),
                code
        );


        return ServiceResult.success(null, "Verification email sent successfully");
    }

    public ServiceResult<User> loginUserByEmailVerify(@RequestParam String code) {

        String email = verificationCodeManager.verifyCodeWith(code);
        if (email == null) {
            return ServiceResult.failure("Invalid verification code");
        }
        User user = userRepository.getUserByEmail(email);


        return ServiceResult.success(user, "user login successfully");
    }

}

