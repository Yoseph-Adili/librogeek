package com.librogeek.DTO;

import com.librogeek.Enums.BookType;
import com.librogeek.Enums.PaymentMethod;
import com.librogeek.Enums.Status;
import com.librogeek.Models.Book;
import com.librogeek.Models.ShippingInfo;
import com.librogeek.Models.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


public record OrdersDTO(
        Integer paymentId,
        List<Book> books,
        User user,
        ShippingInfo shippingInfo,
        BigDecimal totalAmount,
        PaymentMethod paymentMethod,
        Status paymentStatus,
        LocalDateTime createdAt
) {
}
