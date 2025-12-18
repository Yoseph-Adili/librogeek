package com.librogeek.Requests;


import com.librogeek.Enums.PaymentMethod;
import com.librogeek.Models.Book;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;


public class AddPaymentRequest {

    @NotEmpty(message = "books are required")
    private List<Book> books;

    @NotNull
    private Integer shippingInfoId;

    @NotNull(message = "Payment method is required")
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





