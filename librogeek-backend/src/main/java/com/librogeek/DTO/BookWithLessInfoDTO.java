package com.librogeek.DTO;

import com.librogeek.Enums.BookType;
import com.librogeek.Models.Book;
import com.librogeek.Models.Tag;

import java.util.List;

public record BookWithLessInfoDTO(
        Integer book_id,
        String title,
        String author,
        String description,
        String file_path,
        String cover_image,
        String category,
        BookType book_type,
        Integer uploaded_by,
        Integer views,
        Integer downloads,
        Float price,
        List<Tag> tags,
        String created_at
) {

    public BookWithLessInfoDTO(Book book, List<Tag> tags) {
        this(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDescription(),
                book.getFile_path(),
                book.getCover_image(),
                book.getCategory(),
                book.getBookType(),
                book.getUploaded_by(),
                book.getViews(),
                book.getDownloads(),
                book.getPrice() != null ? book.getPrice() : 0.0f,
                tags,
                book.getCreated_at()
        );
    }


}
