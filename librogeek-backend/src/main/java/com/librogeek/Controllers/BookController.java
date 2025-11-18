package com.librogeek.Controllers;

import com.librogeek.Models.Book;
import com.librogeek.Services.BookService;
import com.librogeek.Utils.ApiResponse;
import com.librogeek.Utils.ServiceResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/mostRead")
    public ResponseEntity<ApiResponse> mostReadBooks() {
        ServiceResult<List<Book>> result = bookService.getMostReadBooks();
    return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> allBooks() {
        ServiceResult<List<Book>> result = bookService.getAllBooks();
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }
    @GetMapping("/{category}")
    public ResponseEntity<ApiResponse> findBooksByCategory(@PathVariable String category) {
        ServiceResult<List<Book>> result = bookService.getBookByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }
    @GetMapping("/getMostReadCategory" )
    public ResponseEntity<ApiResponse> mostReadCategory() {
        ServiceResult<List<List<Book>>> result = bookService.getBookByMostReadCategory();
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

}
