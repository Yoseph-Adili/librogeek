package com.librogeek.Models;

import com.librogeek.Enums.DeliveryStatus;
import com.librogeek.Enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;

import java.math.BigDecimal;

@Entity
@Table(name = "purchased_books")
public class PurchasedBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer purchasedBookId;
    @NotEmpty
    private Integer userId;
    @NotEmpty
    private Integer bookId;
    @NotEmpty
    private Integer paymentId;
    @NotEmpty
    private Integer shippingInfoId;
    @Enumerated(EnumType.STRING)
    private DeliveryStatus deliveryStatus = DeliveryStatus.PENDING;
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal paidAmount;
    private String purchaseAt;

    public Integer getPurchasedBookId() {
        return purchasedBookId;
    }

    public void setPurchasedBookId(Integer purchasedBookId) {
        this.purchasedBookId = purchasedBookId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getBookId() {
        return bookId;
    }

    public void setBookId(Integer bookId) {
        this.bookId = bookId;
    }

    public Integer getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }

    public Integer getShippingInfoId() {
        return shippingInfoId;
    }

    public void setShippingInfoId(Integer shippingInfoId) {
        this.shippingInfoId = shippingInfoId;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getPurchaseAt() {
        return purchaseAt;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }
}
