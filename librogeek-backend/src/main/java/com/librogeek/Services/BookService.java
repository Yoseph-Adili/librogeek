package com.librogeek.Services;

import com.librogeek.Models.Book;

import com.librogeek.Repositories.BookRepository;
import com.librogeek.Utils.ServiceResult;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookService {
    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public ServiceResult<Book> getBookById(Integer book_id) {
        return null;
    }


    public ServiceResult<List<Book>> getMostReadBooks() {
        Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "views"));
        List<Book> books = bookRepository.findTop5BooksByViews(pageable);


        if (books.isEmpty()) {
            return ServiceResult.failure("No books found");
        }
        return ServiceResult.success(books, "Books retrieved successfully");
    }


    public ServiceResult<List<Book>> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        if (books.isEmpty()) {
            return ServiceResult.failure("No books found");
        }
        return ServiceResult.success(books, "Books retrieved successfully");
    }

    public ServiceResult<List<Book>> getBookByCategory(String category) {
        List<Book> books = bookRepository.findByCategory(category);
        if (books.isEmpty()) {
            return ServiceResult.failure("No books found");
        }
        return ServiceResult.success(books, "Books retrieved successfully");
    }


    public ServiceResult<List<List<Book>>> getBookByMostReadCategory() {

        List<String> topCategories = bookRepository.findTop2CategoriesByTotalViews();

        if (topCategories.isEmpty()) {
            return ServiceResult.failure("No categories found");
        }

        List<List<Book>> result = new ArrayList<>();

        for (String category : topCategories) {

            List<Book> books = bookRepository.findTop6ByCategoryOrderByViewsDesc(category);

            if (books.isEmpty()) {
                return ServiceResult.failure("No books found in category: " + category);
            }

            result.add(books);
        }

        return ServiceResult.success(result, "Books retrieved successfully");
    }

}
