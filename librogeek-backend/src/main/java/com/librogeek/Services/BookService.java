package com.librogeek.Services;

import com.librogeek.DTO.BookDTO;
import com.librogeek.DTO.CommendDTO;
import com.librogeek.Models.Book;

import com.librogeek.Models.Comment;
import com.librogeek.Models.Tag;
import com.librogeek.Models.User;
import com.librogeek.Repositories.BookRepository;
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
    private final UserService userService;

    public BookService(BookRepository bookRepository, CommentRepository commentRepository, UserService userService, TagRepository tagRepository) {

        this.bookRepository = bookRepository;
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.tagRepository = tagRepository;
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

    public ServiceResult<BookDTO> getBookById(Integer book_id) {
        Optional<Book> book = bookRepository.findById(book_id);

        if (book.isEmpty()) {
            return ServiceResult.failure("No book found");
        }

        List<Comment> comments = commentRepository.findByBookId(book_id);
        List<CommendDTO> commendDTOS = new ArrayList<>();

        for (Comment c : comments) {
            Integer userId = c.getUserId();
            User user = userService.getUserById(userId).getData();
            CommendDTO commendDTO = new CommendDTO(user.getUser_id(), user.getProfile_photo(), user.getUsername(), user.getName(), c.getContent(), c.getCreatedAt());
            commendDTOS.add(commendDTO);
        }
        List<Tag> tags = tagRepository.findByBookId(book_id);
        BookDTO bookDTO = new BookDTO(book.get(), commendDTOS, tags);

        return ServiceResult.success(bookDTO, "Books retrieved successfully");
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
