package com.librogeek.Repositories;

import com.librogeek.Models.Book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    @Query("SELECT b FROM Book b ORDER BY b.views DESC")
    List<Book> findTop5BooksByViews(Pageable pageable);


    List<Book> findByCategory(String category);
    List<Book> findTop6ByCategoryOrderByViewsDesc(String category);


    @Query(value = "SELECT b.category FROM books b GROUP BY b.category ORDER BY SUM(b.views) DESC LIMIT 2", nativeQuery = true)
    List<String> findTop2CategoriesByTotalViews();

}
