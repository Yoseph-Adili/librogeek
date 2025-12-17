package com.librogeek.Services;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.UsersCommentsDTO;
import com.librogeek.Models.*;
import com.librogeek.Repositories.*;
import com.librogeek.Requests.AddShoppingInfoRequest;
import com.librogeek.Requests.CommentRequest;
import com.librogeek.Utils.ServiceResult;
import jakarta.validation.Valid;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShippingService {

    private final UserService userService;
    private final TokenManager tokenManager;
    private final ShippingInfoRepository shippingInfoRepository;


    public ShippingService(UserService userService, TokenManager tokenManager,ShippingInfoRepository shippingInfoRepository) {
        this.userService = userService;
        this.tokenManager = tokenManager;
        this.shippingInfoRepository = shippingInfoRepository;
    }

    public ServiceResult<ShippingInfo> addShippingRequest(String token, @Valid AddShoppingInfoRequest request) {
        Integer userId;


            userId = tokenManager.getUserId(token);
        User user= userService.getUserById(userId).getData();
        if(user==null){
            return ServiceResult.failure("User not found");
        }

        ShippingInfo shippingInfo = new ShippingInfo();
        shippingInfo.setUserId(user.getUser_id());
        shippingInfo.setFullName(request.getFullName());
        shippingInfo.setPhoneNumber(request.getPhoneNumber());
        shippingInfo.setAddressLine1(request.getAddressLine1());
        shippingInfo.setAddressLine2(request.getAddressLine2());
        shippingInfo.setCity(request.getCity());
        shippingInfo.setCountry(request.getCountry());
        shippingInfo.setPostcode(request.getPostcode());




        shippingInfoRepository.save(shippingInfo);

        return ServiceResult.success(shippingInfo, "Shipping request added successfully");



    }
}
