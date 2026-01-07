package com.librogeek.Repositories;

import com.librogeek.DTO.BookCountDTO;
import com.librogeek.DTO.BookWithLessInfoDTO;
import com.librogeek.Enums.BookType;
import com.librogeek.Models.Book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    @Query("SELECT b FROM Book b ORDER BY b.views DESC")
    List<Book> findTop5BooksByViews(Pageable pageable);


    List<Book> findByCategory(String category);
    List<Book> findTop6ByCategoryOrderByViewsDesc(String category);

    List<Book> findAllByOrderByDownloadsDesc(Pageable pageable);


    @Query(value = "SELECT b.category FROM books b GROUP BY b.category ORDER BY SUM(b.views) DESC LIMIT 2", nativeQuery = true)
    List<String> findTop2CategoriesByTotalViews();

    @Query("SELECT DISTINCT b.category FROM Book b")
    List<String> getBookCategories();

    @Query("SELECT DISTINCT b.bookType FROM Book b")
    List<String> getAllTypes();



    @Query("SELECT b FROM Book b WHERE (:category IS NULL OR b.category = :category) AND (:type IS NULL OR b.bookType = :type)")
    List<Book> findBooksByCategoryAndType(@Param("category") String category, @Param("type") BookType bookType);

    List<Book> findBooksByCategory(String category);

    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author);

    List<Book> findBooksByBookType(BookType bookType);

    @Query("SELECT b.category, COUNT(b) FROM Book b GROUP BY b.category")
    List<Object[]> countBooksGroupByType();

}
