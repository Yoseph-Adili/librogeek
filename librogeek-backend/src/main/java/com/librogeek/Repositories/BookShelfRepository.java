package com.librogeek.Repositories;


import com.librogeek.Models.Book;
import com.librogeek.Models.Bookshelf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface BookShelfRepository extends JpaRepository<Bookshelf, Integer> {

    Optional<Bookshelf> findByBookIdAndUserId(Integer bookId, Integer userId);

    List<Bookshelf> findByUserId(Integer userId);
    @Query("""
       SELECT b 
       FROM Book b 
       JOIN Bookshelf h ON b.bookId = h.bookId 
       WHERE h.userId = :userId
       """)
    List<Book> findBooksByUserBookShelf(@Param("userId") Integer userId);





}
