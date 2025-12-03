package com.librogeek.Repositories;

import com.librogeek.Models.PurchasedBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchasedBookRepository extends JpaRepository<PurchasedBook, Integer> {


    Optional<PurchasedBook> findByBookIdAndUserId(Integer bookId,Integer userId);
}
