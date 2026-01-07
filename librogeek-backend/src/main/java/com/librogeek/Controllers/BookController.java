package com.librogeek.Controllers;

import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.BookCountDTO;
import com.librogeek.DTO.BookDTO;
import com.librogeek.DTO.BookWithLessInfoDTO;
import com.librogeek.DTO.earningDTO;
import com.librogeek.Models.Book;
import com.librogeek.Requests.AddTagRequest;
import com.librogeek.Services.BookService;
import com.librogeek.Utils.ApiResponse;
import com.librogeek.Utils.ServiceResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;
    private final TokenManager tokenManager;
    @Value("${file.pdfs.path}")
    private String pdfsPath;

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
    public ResponseEntity<ApiResponse> findBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String tags, // tags=tag1,tag2
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer limit
    ) {
        List<String> tagList = new ArrayList<>();
        if (tags != null && !tags.isEmpty()) {
            tagList = Arrays.asList(tags.split(","));
        }

        ServiceResult<Map<String, Object>> result = bookService.getBooksByFilter(search, category, type, tagList, page, limit);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }



    @GetMapping("/getMostReadCategory")
    public ResponseEntity<ApiResponse> mostReadCategory() {
        ServiceResult<List<List<Book>>> result = bookService.getBookByMostReadCategory();
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @GetMapping("/getMostDownloaded")
    public ResponseEntity<ApiResponse> mostDownloaded() {
        ServiceResult<List<BookWithLessInfoDTO>> result = bookService.getMostDownloadedBooks();
        System.out.println("books:" + result);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @GetMapping("/getCategories")
    public ResponseEntity<ApiResponse> getCategories() {
        ServiceResult<List<String>> result = bookService.getCategories();
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }
    @GetMapping("/getAllTypes")
    public ResponseEntity<ApiResponse> getAllTypes() {
        ServiceResult<List<String>> result = bookService.getAllTypes();
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @GetMapping("/book/{book_id}")
    public ResponseEntity<ApiResponse> getBookById(@PathVariable Integer book_id, @RequestHeader(name = "Authorization", required = false) String authHeader) {
        String token = null;
        System.out.println("authHeader:" + authHeader);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7).trim();
            if (token.isEmpty() || token.equalsIgnoreCase("null") || !tokenManager.isTokenValid(token)) {
                token = null;
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
    @GetMapping("/book/pdf/{book_id}")
    public ResponseEntity<Resource> getBookPdfById(
            @PathVariable Integer book_id,
            @RequestHeader(name = "Authorization", required = false) String authHeader) throws IOException {


        String token = null;
        if (authHeader != null || !authHeader.startsWith("Bearer ") || authHeader.equalsIgnoreCase("Bearer null")) {
            token = authHeader.substring(7).trim();
            if (token.isEmpty() || token.equalsIgnoreCase("null") || !tokenManager.isTokenValid(token)) {
                token = null;
            }
        }


        ServiceResult<String> result = bookService.getBookPdfById(book_id, token);

        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.println("pdf failed:" + result.getMessage());
        System.out.println("pdf file name:" + result.getData());
        File file = new File(pdfsPath + result.getData());

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }


        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(file.length())
                .body(resource);
    }

    @GetMapping("/book/bookPage/{book_id}")
    public ResponseEntity<ApiResponse> getBookPage(
            @PathVariable Integer book_id,
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")
                || authHeader.equalsIgnoreCase("Bearer null")) {
            System.out.println("no auth header");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Please login first"));
        }
        String token = authHeader.substring(7).trim();
        if (token.isEmpty() || !tokenManager.isTokenValid(token)) {
            System.out.println("invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Please login first"));

        }
        ServiceResult<Integer> result = bookService.getBookPageAccess(book_id, token);

        return ResponseEntity.ok(
                ApiResponse.success(result.getData(), result.getMessage())
        );
    }

    @PatchMapping("/book/bookPage/{book_id}")
    public ResponseEntity<ApiResponse> changeBookPage(
            @PathVariable Integer book_id,
            @RequestHeader(name = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Integer> body
    ) {
        Integer pageNumber = body.get("page");
        if (authHeader == null
                || !authHeader.startsWith("Bearer ")
                || authHeader.equalsIgnoreCase("Bearer null")) {
            System.out.println("no auth header");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Please login first"));
        }
        String token = authHeader.substring(7).trim();
        if (token.isEmpty() || !tokenManager.isTokenValid(token)) {
            System.out.println("invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Please login first"));

        }
        ServiceResult<Integer> result = bookService.setBookPageAccess(book_id, token, pageNumber);

        return ResponseEntity.ok(
                ApiResponse.success(result.getData(), result.getMessage())
        );
    }

    @GetMapping("/userBookShelf")
    public ResponseEntity<ApiResponse> userBookShelf(
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")
                || authHeader.equalsIgnoreCase("Bearer null")) {
            System.out.println("no auth header");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Please login first"));
        }
        String token = authHeader.substring(7).trim();
        if (token.isEmpty() || !tokenManager.isTokenValid(token)) {
            System.out.println("invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Please login first"));

        }
        ServiceResult<List<Book>> result = bookService.userBookShelf(token);

        return ResponseEntity.ok(
                ApiResponse.success(result.getData(), result.getMessage())
        );
    }

    @GetMapping("/userHistory")
    public ResponseEntity<ApiResponse> userHistory(
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")
                || authHeader.equalsIgnoreCase("Bearer null")) {
            System.out.println("no auth header");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Please login first"));
        }
        String token = authHeader.substring(7).trim();
        if (token.isEmpty() || !tokenManager.isTokenValid(token)) {
            System.out.println("invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Please login first"));

        }
        ServiceResult<List<Book>> result = bookService.userHistory(token);

        return ResponseEntity.ok(
                ApiResponse.success(result.getData(), result.getMessage())
        );
    }
    @GetMapping("/allBooksCount")
    public ResponseEntity<ApiResponse> allBooksCount(
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("No token provided"));
        }

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid token"));
        }
        ServiceResult<List<BookCountDTO>> result = bookService.allBooksCount(token);

        return ResponseEntity.ok(ApiResponse.success(result.getData(),""));
    }
}
