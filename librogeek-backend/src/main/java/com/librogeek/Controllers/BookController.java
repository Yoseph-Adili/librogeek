package com.librogeek.Controllers;

import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.BookDTO;
import com.librogeek.Models.Book;
import com.librogeek.Services.BookService;
import com.librogeek.Utils.ApiResponse;
import com.librogeek.Utils.ServiceResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;
    private final TokenManager tokenManager;

    public BookController(BookService bookService, TokenManager tokenManager) {
        this.bookService = bookService;
        this.tokenManager = tokenManager;
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

    @GetMapping("/getMostReadCategory")
    public ResponseEntity<ApiResponse> mostReadCategory() {
        ServiceResult<List<List<Book>>> result = bookService.getBookByMostReadCategory();
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @GetMapping("/getMostDownloaded")
    public ResponseEntity<ApiResponse> mostDownloaded() {
        ServiceResult<List<Book>> result = bookService.getMostDownloadedBooks();
        System.out.println("books:" + result);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @GetMapping("/getCategories")
    public ResponseEntity<ApiResponse> getCategories() {
        ServiceResult<List<String>> result = bookService.getCategories();
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @GetMapping("/book/{book_id}")
    public ResponseEntity<ApiResponse> getBookById(@PathVariable Integer book_id, @RequestHeader(name = "Authorization", required = false) String authHeader) {
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            if (!tokenManager.isTokenValid(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid or expired token"));
            }
        }
        System.out.println("token:" + token);
        ServiceResult<BookDTO> result = bookService.getBookById(book_id, token);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @PatchMapping("/book/bookshelf/{book_id}")
    public ResponseEntity<ApiResponse> bookshelf(@PathVariable Integer book_id, @RequestHeader(name = "Authorization", required = false) String authHeader) {
        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid or expired token"));
        }
        ServiceResult<BookDTO> result = bookService.addToBookshelf(book_id, token);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @PatchMapping("/book/tag/add/{tag_id}")
    public ResponseEntity<ApiResponse> addTagVote(@PathVariable Integer tag_id, @RequestHeader(name = "Authorization", required = false) String authHeader) {
        System.out.println("authHeader:" + authHeader + "this is bookshelf");

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid or expired token"));
        }
        ServiceResult<BookDTO> result = bookService.addTagVote(tag_id, token);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }
    @PatchMapping("/book/tag/subtract/{tag_id}")
    public ResponseEntity<ApiResponse> subtractTagVote(@PathVariable Integer tag_id, @RequestHeader(name = "Authorization", required = false) String authHeader) {
        System.out.println("authHeader:" + authHeader + "this is bookshelf");

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid or expired token"));
        }
        ServiceResult<BookDTO> result = bookService.subtractTagVote(tag_id, token);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

}
