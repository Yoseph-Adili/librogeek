package com.librogeek.Controllers;

import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.UsersCommentsDTO;
import com.librogeek.Models.*;
import com.librogeek.Requests.AddPaymentRequest;
import com.librogeek.Requests.AddShoppingInfoRequest;
import com.librogeek.Requests.CommentRequest;
import com.librogeek.Requests.RegisterRequest;
import com.librogeek.Services.BookService;
import com.librogeek.Services.CommentService;
import com.librogeek.Services.ShippingService;
import com.librogeek.Utils.ApiResponse;
import com.librogeek.Utils.ServiceResult;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    private final TokenManager tokenManager;
    private final ShippingService shippingService;

    public ShippingController( TokenManager tokenManager,  ShippingService shippingService) {
        this.tokenManager = tokenManager;
        this.shippingService = shippingService;
    }


    @PostMapping("/addShippingRequest")
    public ResponseEntity<ApiResponse> addShippingRequest(
            @RequestHeader(name = "Authorization", required = false) String authHeader,
            @Valid @RequestBody AddShoppingInfoRequest request) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid token"));
        }
        ServiceResult<ShippingInfo> result = shippingService.addShippingRequest(token,request);

        return ResponseEntity.ok(ApiResponse.success(result,"Shipping request added successfully"));
    }
    @GetMapping("/getUserShippingInfo")
    public ResponseEntity<ApiResponse> getUserShippingInfo(
            @RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid token"));
        }
        ServiceResult<List<ShippingInfo>> result = shippingService.getUserShippingInfo(token);

        return ResponseEntity.ok(ApiResponse.success(result,"Shipping request added successfully"));
    }

    @PostMapping("/addPayment")
    public ResponseEntity<ApiResponse> addPayment(
            @RequestHeader(name = "Authorization", required = false) String authHeader,
            @Valid @RequestBody AddPaymentRequest request) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid token"));
        }
        ServiceResult<Payment> result = shippingService.addPayment(token,request);

        return ResponseEntity.ok(ApiResponse.success(result,"Shipping request added successfully"));
    }

    @GetMapping("/userPurchased")
    public ResponseEntity<ApiResponse> userPurchased(
            @RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid token"));
        }
        ServiceResult<List<Book>> result = shippingService.userPurchased(token);

        return ResponseEntity.ok(ApiResponse.success(result.getData(),"purchased book get successfully"));
    }

}
