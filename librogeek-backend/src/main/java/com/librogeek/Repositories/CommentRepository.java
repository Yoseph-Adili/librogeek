package com.librogeek.Repositories;



import com.librogeek.Models.Book;
import com.librogeek.Models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {


    List<Comment> findByBookId(Integer bookId);


    @Query("""
       SELECT DISTINCT b
       FROM Book b
       JOIN Comment h ON b.bookId = h.bookId
       WHERE h.userId = :userId
       """)
    List<Book> findBooksByUserComments(@Param("userId") Integer userId);

}
