package com.librogeek.DTO;

import com.librogeek.Enums.BookType;
import com.librogeek.Models.Book;
import com.librogeek.Models.Comment;
import com.librogeek.Models.Tag;

import java.util.List;

public record UsersCommentsDTO(
        Integer book_id,
        String title,
        String author,
        String description,
        String cover_image,
        String category,
        BookType book_type,
        Integer views,
        Integer downloads,
        Float price,
        List<Tag> tags,
        List<Comment> comments
) {

    public UsersCommentsDTO(Book book, List<Tag> tags, List<Comment> comments) {
        this(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDescription(),
                book.getCover_image(),
                book.getCategory(),
                book.getBookType(),
                book.getViews(),
                book.getDownloads(),
                book.getPrice() != null ? book.getPrice() : 0.0f,
                tags,
                comments
        );
    }
}
