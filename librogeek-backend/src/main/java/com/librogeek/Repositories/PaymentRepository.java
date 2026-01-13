package com.librogeek.Repositories;


import com.librogeek.Models.Book;
import com.librogeek.Models.Payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {


    @Query("""
    SELECT b
    FROM Book b
    JOIN PurchasedBook pb ON pb.bookId = b.bookId
    WHERE pb.paymentId = :paymentId
""")
    List<Book> findBooksByPaymentId(@Param("paymentId") Integer paymentId);



    List<Payment> findByUserIdIn(List<Integer> userIds);

}
