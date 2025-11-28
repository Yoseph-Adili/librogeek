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
import com.librogeek.Utils.ServiceResult;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final CommentRepository commentRepository;
    private final TagRepository tagRepository;
    private final BookShelfRepository bookShelfRepository;
    private final UserService userService;
    private final TokenManager tokenManager;

    public BookService(BookRepository bookRepository, CommentRepository commentRepository, UserService userService, TagRepository tagRepository , BookShelfRepository bookShelfRepository, TokenManager tokenManager) {

        this.bookRepository = bookRepository;
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.tagRepository = tagRepository;
        this.bookShelfRepository = bookShelfRepository;
        this.tokenManager = tokenManager;
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

    public ServiceResult<List<Book>> getMostDownloadedBooks() {
        List<Book> books = bookRepository.findAllByOrderByDownloadsDesc(PageRequest.of(0, 2));
        if (books.isEmpty()) return ServiceResult.failure("No books found");

        return ServiceResult.success(books, "Books retrieved successfully");

    }

    public ServiceResult<List<Book>> getBookByCategory(String category) {
        List<Book> books = bookRepository.findByCategory(category);
        if (books.isEmpty()) {
            return ServiceResult.failure("No books found");
        }
        return ServiceResult.success(books, "Books retrieved successfully");
    }


    public ServiceResult<List<String>> getCategories() {
        List<String> categories = bookRepository.getBookCategories();
        if (categories.isEmpty()) {
            return ServiceResult.failure("No categories found");
        }
        return ServiceResult.success(categories, "Books retrieved successfully");
    }

    public ServiceResult<BookDTO> getBookById(Integer book_id,String token) {
        Optional<Book> book = bookRepository.findById(book_id);

        if (book.isEmpty()) {
            return ServiceResult.failure("No book found");
        }


        List<Comment> comments = commentRepository.findByBookId(book_id);
        List<CommentDTO> commentDTOS = new ArrayList<>();

        for (Comment c : comments) {
            Integer userId = c.getUserId();
            User user = userService.getUserById(userId).getData();
            CommentDTO commentDTO = new CommentDTO(user.getUser_id(), user.getProfile_photo(), user.getUsername(), user.getName(), c.getContent(), c.getCreatedAt());
            commentDTOS.add(commentDTO);
        }
        boolean inBookshelf=false;
        System.out.println("service token:" + token);

        if (token != null && !token.isEmpty()) {
            try {
                Integer tokenUserId = tokenManager.getUserId(token);
                inBookshelf = bookShelfRepository.findByBookIdAndUserId(book_id, tokenUserId).isPresent();
            } catch (JWTDecodeException e) {

                inBookshelf = false;
            }
        }

        List<Tag> tags = tagRepository.findByBookId(book_id);
        BookDTO bookDTO = new BookDTO(book.get(), commentDTOS, tags,inBookshelf);

        return ServiceResult.success(bookDTO, "Books retrieved successfully");
    }

    public ServiceResult<BookDTO> addToBookshelf(Integer book_id, String token) {
        if (token == null || token.isEmpty()) {
            return ServiceResult.failure("User not logged in");
        }

        Integer tokenUserId;
        try {
            tokenUserId = tokenManager.getUserId(token);
        } catch (JWTDecodeException e) {
            return ServiceResult.failure("Invalid token");
        }

        Optional<Bookshelf> bookshelfOpt = bookShelfRepository.findByBookIdAndUserId(book_id, tokenUserId);

        if (bookshelfOpt.isPresent()) {
            bookShelfRepository.delete(bookshelfOpt.get());
        } else {
            Bookshelf newEntry = new Bookshelf();
            newEntry.setBookId(book_id);
            newEntry.setUserId(tokenUserId);
            bookShelfRepository.save(newEntry);
        }

        return ServiceResult.success(null, "Bookshelf updated successfully");
    }
    public ServiceResult<BookDTO> addTagVote(Integer tag_id, String token) {
        if (token == null || token.isEmpty()) {
            return ServiceResult.failure("User not logged in");
        }

        Optional<Tag> tag = tagRepository.findByTagId(tag_id);
        tag.get().setTagVotes(tag.get().getTagVotes()+1);
        tagRepository.save(tag.get());


        return ServiceResult.success(null, "Bookshelf updated successfully");
    }
    public ServiceResult<BookDTO> subtractTagVote(Integer tag_id, String token) {
        if (token == null || token.isEmpty()) {
            return ServiceResult.failure("User not logged in");
        }

        Optional<Tag> tag = tagRepository.findByTagId(tag_id);

        if (tag.get().getTagVotes() < 1) {
            tag.get().setTagVotes(tag.get().getTagVotes()-1);
            tagRepository.save(tag.get());
        }else {
            tagRepository.delete(tag.get());
        }



        return ServiceResult.success(null, "Bookshelf updated successfully");
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
