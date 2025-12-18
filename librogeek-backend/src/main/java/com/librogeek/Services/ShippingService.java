package com.librogeek.Services;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.UsersCommentsDTO;
import com.librogeek.Enums.BookType;
import com.librogeek.Enums.DeliveryStatus;
import com.librogeek.Models.*;
import com.librogeek.Repositories.*;
import com.librogeek.Requests.AddPaymentRequest;
import com.librogeek.Requests.AddShoppingInfoRequest;
import com.librogeek.Requests.CommentRequest;
import com.librogeek.Utils.ServiceResult;
import jakarta.validation.Valid;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShippingService {

    private final UserService userService;
    private final TokenManager tokenManager;
    private final ShippingInfoRepository shippingInfoRepository;
    private final PaymentRepository paymentRepository;
    private final PurchasedBookRepository purchasedBookRepository;


    public ShippingService(UserService userService, TokenManager tokenManager,ShippingInfoRepository shippingInfoRepository, PaymentRepository paymentRepository, PurchasedBookRepository purchasedBookRepository) {
        this.userService = userService;
        this.tokenManager = tokenManager;
        this.shippingInfoRepository = shippingInfoRepository;
        this.paymentRepository = paymentRepository;
        this.purchasedBookRepository = purchasedBookRepository;
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

    public ServiceResult<List<ShippingInfo>> getUserShippingInfo(String token) {
        Integer userId = tokenManager.getUserId(token);
        User user = userService.getUserById(userId).getData();
        if (user == null) {
            return ServiceResult.failure("User not found");
        }
        List<ShippingInfo> shippingInfos = shippingInfoRepository.findAllByUserId(user.getUser_id());
        return ServiceResult.success(shippingInfos, "User shipping info retrieved successfully");
    }
    public ServiceResult<Payment> addPayment(String token, @Valid AddPaymentRequest request) {
        Integer userId;

//        System.out.println("this is books"+request.getBooks());


        userId = tokenManager.getUserId(token);
        User user= userService.getUserById(userId).getData();
        if(user==null){
            return ServiceResult.failure("User not found");
        }
        List<Book>books= request.getBooks();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Book book : books) {
            totalAmount = totalAmount.add(book.getPrice());
        }
        System.out.println("this is book id out"+ books.get(0).getBookId());
        Payment payment = new Payment();
        payment.setUserId(user.getUser_id());
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(request.getPaymentMethod());
        paymentRepository.save(payment);
        Integer paymentId = payment.getPaymentId();

        for (Book book : books) {
            System.out.println("this is book id"+book.getBookId());
            PurchasedBook purchasedBook = new PurchasedBook();
            purchasedBook.setUserId(user.getUser_id());
            purchasedBook.setBookId(book.getBookId());
            purchasedBook.setPaymentId(paymentId);
            purchasedBook.setShippingInfoId(request.getShippingInfoId());
            if (book.getBookType()== BookType.PDF) {
                purchasedBook.setDeliveryStatus(DeliveryStatus.DELIVERED);
            } else {
                purchasedBook.setDeliveryStatus(DeliveryStatus.PENDING);
            }
            purchasedBook.setPaidAmount(book.getPrice());
            purchasedBookRepository.save(purchasedBook);
        }

        return ServiceResult.success(payment, "Shipping request added successfully");
    }
}
