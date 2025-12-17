package com.librogeek.Controllers;

import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.UsersCommentsDTO;
import com.librogeek.Models.Comment;
import com.librogeek.Models.ShippingInfo;
import com.librogeek.Models.User;
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




        System.out.println("fullName: " + request.getFullName());
        System.out.println("phoneNumber: " + request.getPhoneNumber());
        System.out.println("addressLine1: " + request.getAddressLine1());
        System.out.println("addressLine2: " + request.getAddressLine2());
        System.out.println("city: " + request.getCity());
        System.out.println("country: " + request.getCountry());
        System.out.println("postcode: " + request.getPostcode());




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

}
