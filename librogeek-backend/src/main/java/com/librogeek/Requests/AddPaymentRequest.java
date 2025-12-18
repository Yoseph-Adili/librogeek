package com.librogeek.Requests;


import com.librogeek.Enums.PaymentMethod;
import com.librogeek.Models.Book;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;


public class AddPaymentRequest {

    @NotBlank(message = "books are required")
    private List<Book> books;

    @NotNull
    private Integer shippingInfoId;

    @NotBlank(message = "payment method is required")
    private PaymentMethod paymentMethod;

    public List<Book> getBooks() {
        return books;
    }

    public Integer getShippingInfoId() {
        return shippingInfoId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
}





