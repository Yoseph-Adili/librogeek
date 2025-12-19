package com.librogeek.Repositories;

import com.librogeek.DTO.TagDTO;
import com.librogeek.Models.Book;
import com.librogeek.Models.PurchasedBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchasedBookRepository extends JpaRepository<PurchasedBook, Integer> {


    Optional<PurchasedBook> findByBookIdAndUserId(Integer bookId, Integer userId);

    boolean existsByBookIdAndUserId(Integer bookId, Integer tokenUserId);

    List<PurchasedBook> findAllByUserId(Integer userId);

    @Query("""
                SELECT b
                FROM Book b
                JOIN PurchasedBook pb ON pb.bookId = b.bookId
                WHERE pb.userId = :userId
            """)
    List<Book> findPurchasedBooksByUserId(@Param("userId") Integer userId);


}
