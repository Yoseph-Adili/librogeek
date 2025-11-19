package com.librogeek.Controllers;

import com.librogeek.Component.TokenBlacklist;
import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.UserDTO;
import com.librogeek.Repositories.UserRepository;
import com.librogeek.Requests.LoginRequest;
import com.librogeek.Requests.RegisterRequest;
import com.librogeek.Services.UserService;
import com.librogeek.Utils.ApiResponse;
import com.librogeek.Models.User;
import com.librogeek.Utils.ServiceResult;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // ✅ 登录，返回 JWT
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        ServiceResult<User> result = userService.login(request);
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(result.getMessage()));
        }

        User user = result.getData();
        String token = tokenManager.generateToken(user.getUsername(), user.getRole());
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
        String token = tokenManager.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success(token, "Logged in successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || !tokenManager.isTokenValid(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid refresh token"));
        }

        String newAccessToken = tokenManager.refreshAccessToken(refreshToken);


        ResponseCookie cookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true)
                .path("/")
                .maxAge(15 * 60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
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
}
