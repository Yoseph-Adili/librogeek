package com.librogeek.Models;


import com.librogeek.Enums.PaymentMethod;
import com.librogeek.Enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer PaymentId;
    @NotNull
    private Integer userId;
    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private Status status= Status.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt;


    public Integer getPaymentId() {
        return PaymentId;
    }

    public void setPaymentId(Integer paymentId) {
        PaymentId = paymentId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

}
