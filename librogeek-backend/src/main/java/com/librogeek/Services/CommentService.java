package com.librogeek.Services;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.BookDTO;
import com.librogeek.DTO.CommentDTO;
import com.librogeek.Models.*;
import com.librogeek.Repositories.BookRepository;
import com.librogeek.Repositories.BookShelfRepository;
import com.librogeek.Repositories.CommentRepository;
import com.librogeek.Repositories.TagRepository;
import com.librogeek.Requests.CommentRequest;
import com.librogeek.Utils.ServiceResult;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    private final BookRepository bookRepository;
    private final CommentRepository commentRepository;
    private final TagRepository tagRepository;
    private final BookShelfRepository bookShelfRepository;
    private final UserService userService;
    private final TokenManager tokenManager;

    public CommentService(BookRepository bookRepository, CommentRepository commentRepository, UserService userService, TagRepository tagRepository, BookShelfRepository bookShelfRepository, TokenManager tokenManager) {

        this.bookRepository = bookRepository;
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.tagRepository = tagRepository;
        this.bookShelfRepository = bookShelfRepository;
        this.tokenManager = tokenManager;
    }

    public ServiceResult<Comment> addComment(Integer book_id, String token, CommentRequest commentRequest) {
        Book book = bookRepository.findById(book_id).orElse(null);
        if (book == null) {
            return ServiceResult.failure("Book not found");
        }
        Integer userId;
        try {
            userId = tokenManager.getUserId(token);
        } catch (JWTDecodeException e) {
            return ServiceResult.failure("Invalid token");
        }
        Comment comment = new Comment();
        comment.setBookId(book_id);
        comment.setUserId(userId);
        comment.setContent(commentRequest.getComment());
        commentRepository.save(comment);
        return ServiceResult.success(comment, "Comment added successfully");
    }

}
