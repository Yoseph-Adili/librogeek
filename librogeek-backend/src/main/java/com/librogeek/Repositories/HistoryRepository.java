package com.librogeek.Repositories;


import com.librogeek.Models.Book;
import com.librogeek.Models.History;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface HistoryRepository extends JpaRepository<History, Integer> {

    Optional<History> findByBookIdAndUserId(Integer bookId,Integer userId);

    List<History> findByUserId(Integer userId);


    @Query("""
       SELECT b 
       FROM Book b 
       JOIN History h ON b.bookId = h.bookId 
       WHERE h.userId = :userId
       """)
    List<Book> findBooksByUserHistory(@Param("userId") Integer userId);
}
