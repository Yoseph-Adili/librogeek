package com.librogeek.Services;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.OrdersDTO;
import com.librogeek.DTO.UsersCommentsDTO;
import com.librogeek.DTO.earningDTO;
import com.librogeek.Enums.BookType;
import com.librogeek.Enums.DeliveryStatus;
import com.librogeek.Enums.Role;
import com.librogeek.Models.*;
import com.librogeek.Repositories.*;
import com.librogeek.Requests.AddPaymentRequest;
import com.librogeek.Requests.AddShoppingInfoRequest;
import com.librogeek.Requests.CommentRequest;
import com.librogeek.Utils.ServiceResult;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ShippingService {

    private final UserService userService;
    private final TokenManager tokenManager;
    private final ShippingInfoRepository shippingInfoRepository;
    private final PaymentRepository paymentRepository;
    private final PurchasedBookRepository purchasedBookRepository;


    public ShippingService(UserService userService, TokenManager tokenManager, ShippingInfoRepository shippingInfoRepository, PaymentRepository paymentRepository, PurchasedBookRepository purchasedBookRepository) {
        this.userService = userService;
        this.tokenManager = tokenManager;
        this.shippingInfoRepository = shippingInfoRepository;
        this.paymentRepository = paymentRepository;
        this.purchasedBookRepository = purchasedBookRepository;
    }

    public ServiceResult<ShippingInfo> addShippingRequest(String token, @Valid AddShoppingInfoRequest request) {
        Integer userId;


        userId = tokenManager.getUserId(token);
        User user = userService.getUserById(userId).getData();
        if (user == null) {
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

    @Transactional
    public ServiceResult<Payment> addPayment(String token, @Valid AddPaymentRequest request) {
        Integer userId;

//        System.out.println("this is books"+request.getBooks());


        userId = tokenManager.getUserId(token);
        User user = userService.getUserById(userId).getData();
        if (user == null) {
            return ServiceResult.failure("User not found");
        }
        List<Book> books = request.getBooks();
        if (books == null || books.isEmpty()) {
            return ServiceResult.failure("Books list is empty");
        }
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Book book : books) {
            totalAmount = totalAmount.add(book.getPrice());
        }
        System.out.println("this is book id out" + books.get(0).getBookId());
        Payment payment = new Payment();
        payment.setUserId(user.getUser_id());
        payment.setShippingInfoId(request.getShippingInfoId());
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(request.getPaymentMethod());
        paymentRepository.save(payment);
        Integer paymentId = payment.getPaymentId();

        for (Book book : books) {
            System.out.println("this is book id" + book.getBookId());

            boolean bookExist = purchasedBookRepository.existsByBookIdAndUserId(book.getBookId(), user.getUser_id());
            if (bookExist) {
                continue;
            }
            if (book.getPrice() == null) {
                continue;
            }
            PurchasedBook purchasedBook = new PurchasedBook();
            purchasedBook.setUserId(user.getUser_id());
            purchasedBook.setBookId(book.getBookId());
            purchasedBook.setPaymentId(paymentId);
            purchasedBook.setShippingInfoId(request.getShippingInfoId());
            if (book.getBookType() == BookType.PDF) {
                purchasedBook.setDeliveryStatus(DeliveryStatus.DELIVERED);
            } else {
                purchasedBook.setDeliveryStatus(DeliveryStatus.PENDING);
            }
            purchasedBook.setPaidAmount(book.getPrice());
            purchasedBookRepository.save(purchasedBook);
        }

        return ServiceResult.success(payment, "Shipping request added successfully");
    }

    public ServiceResult<List<Book>> userPurchased(String token) {
        Integer userId = tokenManager.getUserId(token);
        User user = userService.getUserById(userId).getData();
        if (user == null) {
            return ServiceResult.failure("User not found");
        }
        List<Book> books = purchasedBookRepository.findPurchasedBooksByUserId(user.getUser_id());

        return ServiceResult.success(books, "User purchased books retrieved successfully");
    }

    public ServiceResult<List<earningDTO>> allUserPurchased(String token) {
        Integer userId = tokenManager.getUserId(token);
        User user = userService.getUserById(userId).getData();
        if (user == null || user.getRole() != Role.ADMIN) {
            System.out.println("user is not admin or not found: " + (user != null ? user.getRole() : "null"));
            return ServiceResult.failure("User not found");
        }

        List<earningDTO> purchasedBook = purchasedBookRepository.findEarnings();
        System.out.println("this is earning dto" + purchasedBook);
        return ServiceResult.success(purchasedBook, "User purchased books retrieved successfully");
    }

    public ServiceResult<List<OrdersDTO>> allUserOrders(String token) {
        Integer userId = tokenManager.getUserId(token);
        User user = userService.getUserById(userId).getData();
        if (user == null || user.getRole() != Role.ADMIN) {
            System.out.println("user is not admin or not found: " + (user != null ? user.getRole() : "null"));
            return ServiceResult.failure("User not found");
        }

        List<Payment> allPayment = paymentRepository.findAll();
        List<OrdersDTO> orders = new ArrayList<>();
        for (Payment payment : allPayment) {
            OrdersDTO ordersDTO = new OrdersDTO(
                    payment.getPaymentId(),
                    paymentRepository.findBooksByPaymentId(payment.getPaymentId()),
                    userService.getUserById(payment.getUserId()).getData(),
                    shippingInfoRepository.findById(payment.getShippingInfoId()).orElse(null),
                    payment.getAmount(),
                    payment.getPaymentMethod(),
                    payment.getStatus(),
                    payment.getCreatedAt()
            );

            orders.add(ordersDTO);
        }

        return ServiceResult.success(orders, "User purchased books retrieved successfully");
    }

    public ServiceResult<List<OrdersDTO>> getAllSearchUserOrders(String token, String search) {
        Integer userId = tokenManager.getUserId(token);
        User admin = userService.getUserById(userId).getData();

        if (admin == null || admin.getRole() != Role.ADMIN) {
            return ServiceResult.failure("Unauthorized access");
        }

        if (search == null || search.isEmpty()) {
            return ServiceResult.failure("Query parameter is required");
        }

        Integer searchUserId = null;

        List<User> users = userService.getAllSearchUsers(token, search).getData();

        if (users.isEmpty()) {
            return ServiceResult.failure("No users found matching the query");
        }


        List<Integer> userIds = users.stream().map(User::getUser_id).toList();

        if (userIds.isEmpty()){
            return ServiceResult.failure("No users found matching the query");
        }

        List<Payment> payments = paymentRepository.findByUserIdIn(userIds);
        if (payments.isEmpty()) {
            return ServiceResult.failure("No orders found matching the query");
        }

        Map<Integer, User> userMap = users.stream().collect(Collectors.toMap(User::getUser_id, u -> u));
        List<Integer> shippingIds = payments.stream()
                .map(Payment::getShippingInfoId)
                .filter(Objects::nonNull)
                .toList();
        Map<Integer, ShippingInfo> shippingMap = shippingInfoRepository.findAllById(shippingIds).stream()
                .collect(Collectors.toMap(ShippingInfo::getShippingInfoId, s -> s));


        List<OrdersDTO> orders = payments.stream().map(payment -> {
            List<Book> books = paymentRepository.findBooksByPaymentId(payment.getPaymentId());
            User user = userMap.get(payment.getUserId());
            ShippingInfo shipping = shippingMap.get(payment.getShippingInfoId());
            return new OrdersDTO(
                    payment.getPaymentId(),
                    books,
                    user,
                    shipping,
                    payment.getAmount(),
                    payment.getPaymentMethod(),
                    payment.getStatus(),
                    payment.getCreatedAt()
            );
        }).toList();



        return ServiceResult.success(orders, "Orders retrieved successfully");
    }

}
