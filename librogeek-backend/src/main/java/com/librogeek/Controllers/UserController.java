package com.librogeek.Controllers;

import com.librogeek.Component.TokenBlacklist;
import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.UserDTO;
import com.librogeek.Repositories.UserRepository;
import com.librogeek.Requests.ChangeNamesRequest;
import com.librogeek.Requests.ChangePasswordRequest;
import com.librogeek.Requests.LoginRequest;
import com.librogeek.Requests.RegisterRequest;
import com.librogeek.Services.EmailService;
import com.librogeek.Services.UserService;
import com.librogeek.Utils.ApiResponse;
import com.librogeek.Models.User;
import com.librogeek.Utils.ServiceResult;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final TokenManager tokenManager;


    public UserController(UserService userService, UserRepository userRepository, TokenManager tokenManager) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.tokenManager = tokenManager;

    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable Integer id) {
        ServiceResult<User> result = userService.getUserById(id);
        ApiResponse response = result.isSuccess()
                ? ApiResponse.success(result.getData(), result.getMessage())
                : ApiResponse.error(result.getMessage());
        return ResponseEntity.status(result.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND)
                .body(response);
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        ServiceResult<User> result = userService.login(request);
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(result.getMessage()));
        }

        User user = result.getData();
        String token = tokenManager.generateToken(user.getUser_id(), user.getUsername(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success(token, "Logged in successfully"));
    }


    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        ServiceResult<User> serviceResult = userService.register(request);
        if (!serviceResult.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(serviceResult.getMessage()));
        }

        User user = serviceResult.getData();
        String token = tokenManager.generateToken(user.getUser_id(), user.getUsername(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success(token, "Logged in successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refreshToken(@RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        String token = authHeader.substring(7);
        String newAccessToken = tokenManager.refreshAccessToken(token);

        return ResponseEntity.ok()
                .body(ApiResponse.success(newAccessToken, "Access token refreshed"));
    }


    @GetMapping("/status")
    public ResponseEntity<ApiResponse> status(@RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }



        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired token"));
        }

        String username = tokenManager.getUsername(token);
        ServiceResult<User> result = userService.getUserByUsername(username);
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not found"));
        }
        UserDTO dto = new UserDTO(result.getData());


        return ResponseEntity.ok(ApiResponse.success(dto, "Logged in"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }
        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired token"));
        }
        tokenManager.addTokenToBlackList(token);


        return ResponseEntity.ok(ApiResponse.success(null, "User logout successfully"));
    }

    @PostMapping("/uploadPhoto/{user_id}")
    public ResponseEntity<ApiResponse> uploadPhoto(@PathVariable Integer user_id, @Valid @RequestPart MultipartFile imageFile, @RequestHeader(name = "Authorization", required = false) String authHeader) {


        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }
        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired token"));
        }
        Integer tokenUserId = tokenManager.getUserId(token);

        if (!tokenUserId.equals(user_id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("You cannot modify another user's account"));
        }
        ServiceResult<User> result = userService.uploadPhoto(user_id, imageFile);

        if (!result.isSuccess()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));

    }

    @PatchMapping("/changeUserNames/{user_id}")
    public ResponseEntity<ApiResponse> changeUserNames(@PathVariable Integer user_id, @Valid @RequestBody ChangeNamesRequest request, @RequestHeader(name = "Authorization", required = false) String authHeader) {
        System.out.println("this is user:" + request.getUsername());
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }
        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired token"));
        }
        Integer tokenUserId = tokenManager.getUserId(token);

        if (!tokenUserId.equals(user_id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("You cannot modify another user's account"));
        }
        ServiceResult<User> result = userService.changeUserNames(user_id, request);

        if (!result.isSuccess()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));

    }

    @PatchMapping("/changeUserPassword/{user_id}")
    public ResponseEntity<ApiResponse> changeUserPassword(
            @PathVariable Integer user_id,
            @Valid @RequestBody ChangePasswordRequest request,
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        String token = authHeader.substring(7);

        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired token"));
        }
        Integer tokenUserId = tokenManager.getUserId(token);

        if (!tokenUserId.equals(user_id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("You cannot modify another user's account"));
        }

        ServiceResult<User> result = userService.changeUserPassword(user_id, request);

        if (!result.isSuccess()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }

        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @PatchMapping("/changeUserEmail/{user_id}")
    public ResponseEntity<ApiResponse> changeUserEmail(
            @PathVariable Integer user_id,
            @RequestParam String email,
            @RequestHeader(name = "Authorization", required = false) String authHeader) throws MessagingException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        String token = authHeader.substring(7);

        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired token"));
        }
        Integer tokenUserId = tokenManager.getUserId(token);

        if (!tokenUserId.equals(user_id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("You cannot modify another user's account"));
        }

        ServiceResult<User> result = userService.changeUserEmail(user_id, email);

        if (!result.isSuccess()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }

        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @PatchMapping("/verifiedEmail/{user_id}")
    public ResponseEntity<ApiResponse> verifiedEmail(
            @PathVariable Integer user_id,
            @RequestParam String code,
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        String token = authHeader.substring(7);

        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired token"));
        }
        Integer tokenUserId = tokenManager.getUserId(token);

        if (!tokenUserId.equals(user_id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("You cannot modify another user's account"));
        }

        ServiceResult<User> result = userService.verifiedEmail(user_id, code);

        if (!result.isSuccess()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }

        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @GetMapping("/loginUserByEmail")
    public ResponseEntity<ApiResponse> loginUserByEmail(@RequestParam String email) throws MessagingException {


        ServiceResult<User> result = userService.loginUserByEmail(email);

        if (!result.isSuccess()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }

        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @PatchMapping("/loginUserByEmailVerify")
    public ResponseEntity<ApiResponse> loginUserByEmailVerify(@RequestParam String code,@RequestParam String password) throws MessagingException {


        ServiceResult<User> result = userService.loginUserByEmailVerify(code,password);

        if (!result.isSuccess()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }

        return ResponseEntity.ok(ApiResponse.success(null, "password changed successfully"));
    }
}
