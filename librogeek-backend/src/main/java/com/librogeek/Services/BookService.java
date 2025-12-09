package com.librogeek.Services;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.*;
import com.librogeek.Models.*;

import com.librogeek.Repositories.*;
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
    private final PurchasedBookRepository purchasedBookRepository;
    private final HistoryRepository historyRepository;

    public BookService(BookRepository bookRepository, CommentRepository commentRepository, UserService userService, TagRepository tagRepository, BookShelfRepository bookShelfRepository, TokenManager tokenManager, PurchasedBookRepository purchasedBookRepository, HistoryRepository historyRepository) {

        this.bookRepository = bookRepository;
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.tagRepository = tagRepository;
        this.bookShelfRepository = bookShelfRepository;
        this.tokenManager = tokenManager;
        this.purchasedBookRepository = purchasedBookRepository;
        this.historyRepository = historyRepository;
    }


    public ServiceResult<List<Book>> getMostReadBooks() {
        Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "views"));
        List<Book> books = bookRepository.findTop5BooksByViews(pageable);


        if (books.isEmpty()) {
            return ServiceResult.failure("No books found");
        }
        return ServiceResult.success(books, "Books retrieved successfully");
    }


    public ServiceResult<List<BookWithLessInfoDTO>> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        if (books.isEmpty()) {
            return ServiceResult.failure("No books found");
        }
        List<BookWithLessInfoDTO> bookResult= new ArrayList<>();
        books.forEach(book -> {
            List<Tag> tags = tagRepository.findByBookId(book.getBook_id());
            BookWithLessInfoDTO bookWithLessInfoDTO = new BookWithLessInfoDTO(book, tags);
            bookResult.add(bookWithLessInfoDTO);
        });
        return ServiceResult.success(bookResult, "Books retrieved successfully");
    }

    public ServiceResult<List<BookWithLessInfoDTO>> getMostDownloadedBooks() {
        List<Book> books = bookRepository.findAllByOrderByDownloadsDesc(PageRequest.of(0, 2));
        if (books.isEmpty()) return ServiceResult.failure("No books found");
        List<BookWithLessInfoDTO> bookResult= new ArrayList<>();
        books.forEach(book -> {
            List<Tag> tags = tagRepository.findByBookId(book.getBook_id());
            BookWithLessInfoDTO bookWithLessInfoDTO = new BookWithLessInfoDTO(book, tags);
            bookResult.add(bookWithLessInfoDTO);
        });
        return ServiceResult.success(bookResult, "Books retrieved successfully");

    }

    public ServiceResult<List<BookWithLessInfoDTO>> getBookByCategory(String category) {
        List<Book> books = bookRepository.findByCategory(category);
        if (books.isEmpty()) {
            return ServiceResult.failure("No books found");
        }
        List<BookWithLessInfoDTO> bookResult= new ArrayList<>();
        books.forEach(book -> {
            List<Tag> tags = tagRepository.findByBookId(book.getBook_id());
            BookWithLessInfoDTO bookWithLessInfoDTO = new BookWithLessInfoDTO(book, tags);
            bookResult.add(bookWithLessInfoDTO);
        });
        return ServiceResult.success(bookResult, "Books retrieved successfully");
    }


    public ServiceResult<List<String>> getCategories() {
        List<String> categories = bookRepository.getBookCategories();
        if (categories.isEmpty()) {
            return ServiceResult.failure("No categories found");
        }
        return ServiceResult.success(categories, "Books retrieved successfully");
    }

    public ServiceResult<BookDTO> getBookById(Integer book_id, String token) {
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
        boolean inBookshelf = false;
        boolean ableToRead = true;

        if (book.get().getPrice() > 0) {
            ableToRead = false;
        }

        if (token != null && !token.isEmpty()) {
            try {
                Integer tokenUserId = tokenManager.getUserId(token);
                inBookshelf = bookShelfRepository.findByBookIdAndUserId(book_id, tokenUserId).isPresent();
                if (book.get().getPrice() > 0) {
                    Optional<PurchasedBook> purchasedBook = purchasedBookRepository.findByBookIdAndUserId(book_id, tokenUserId);
                    ableToRead = purchasedBook.isPresent();
                }


            } catch (JWTDecodeException e) {

                inBookshelf = false;
                ableToRead = false;
            }
        }
        System.out.println("this is "+ableToRead);
        List<Tag> tags = tagRepository.findByBookId(book_id);
        BookDTO bookDTO = new BookDTO(book.get(), commentDTOS, tags, inBookshelf, ableToRead);

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

    public ServiceResult<String> getBookPdfById(Integer book_id, String token) {

        Optional<Book> book = bookRepository.findById(book_id);


        if (book.isEmpty()) {
            return ServiceResult.failure("No book found");
        }
        Float price = book.get().getPrice();
        if (price != null && price > 0) {
            Integer userId = tokenManager.getUserId(token);
            ServiceResult<User> user = userService.getUserById(userId);
            if (token == null || token.isEmpty() || user.getData() == null) {
                return ServiceResult.failure("Book is paid. Please login to access.");
            }
            Optional<PurchasedBook> purchasedBook = purchasedBookRepository.findByBookIdAndUserId(book_id, userId);
            if (purchasedBook.isEmpty()) {
                return ServiceResult.failure("please purchase the book to access the pdf.");
            }
        }
        if (token != null && !token.isEmpty() && tokenManager.isTokenValid(token)) {
            Integer userId = tokenManager.getUserId(token);

            Optional<History> existingHistory =
                    historyRepository.findByBookIdAndUserId(book_id, userId);

            if (existingHistory.isEmpty()) {
                History history = new History();
                history.setBookId(book_id);
                history.setUserId(userId);
                history.setPage(1);
                historyRepository.save(history);
            }
        }

        return ServiceResult.success(book.get().getFile_path(), "Book retrieved successfully");

    }

    public ServiceResult<Integer> getBookPageAccess(Integer book_id, String token) {

        Integer userId = tokenManager.getUserId(token);
        ServiceResult<User> user = userService.getUserById(userId);
        Optional<Book> book = bookRepository.findById(book_id);
        if (book.isEmpty()) {
            return ServiceResult.failure("No book found");
        }
        if (user.getData() == null) {
            return ServiceResult.failure("User not found");
        }
        Optional<History> history = historyRepository.findByBookIdAndUserId(book_id, userId);
        if (history.isPresent()) {
            return ServiceResult.success(history.get().getPage(), "User has access to the book");
        } else {
            return ServiceResult.success(1, "User does not have access to the book");
        }
    }

    public ServiceResult<Integer> setBookPageAccess(Integer book_id, String token, Integer page) {

        Integer userId = tokenManager.getUserId(token);
        ServiceResult<User> user = userService.getUserById(userId);
        Optional<Book> book = bookRepository.findById(book_id);
        if (book.isEmpty()) {
            return ServiceResult.failure("No book found");
        }
        if (user.getData() == null) {
            return ServiceResult.failure("User not found");
        }
        Optional<History> history = historyRepository.findByBookIdAndUserId(book_id, userId);
        if (history.isPresent()) {
            History existingHistory = history.get();
            existingHistory.setPage(page);
            historyRepository.save(existingHistory);
        } else {
            History newHistory = new History();
            newHistory.setBookId(book_id);
            newHistory.setUserId(userId);
            newHistory.setPage(page);
            historyRepository.save(newHistory);
        }

        return ServiceResult.success(null, "User does not have access to the book");

    }
}