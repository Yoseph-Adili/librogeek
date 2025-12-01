package com.librogeek.Controllers;

import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.BookDTO;
import com.librogeek.Models.Book;
import com.librogeek.Models.Comment;
import com.librogeek.Requests.CommentRequest;
import com.librogeek.Services.BookService;
import com.librogeek.Services.CommentService;
import com.librogeek.Utils.ApiResponse;
import com.librogeek.Utils.ServiceResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books/book")
public class CommentController {
    private final BookService bookService;
    private final TokenManager tokenManager;
    private  final CommentService commentService;

    public CommentController(BookService bookService, TokenManager tokenManager, CommentService commentService) {
        this.bookService = bookService;
        this.tokenManager = tokenManager;
        this.commentService = commentService;
    }


    @PostMapping("/comment/{book_id}")
    public ResponseEntity<ApiResponse> addComment(@PathVariable Integer book_id, @RequestHeader(name = "Authorization", required = false) String authHeader, @RequestBody CommentRequest commentRequest) {
        System.out.println("authHeader:" + authHeader + "this is bookshelf");

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid or expired token"));
        }
        ServiceResult<Comment> result = commentService.addComment(book_id, token, commentRequest);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

}
