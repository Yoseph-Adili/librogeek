package com.librogeek.DTO;

import com.librogeek.Enums.BookType;
import com.librogeek.Models.Book;
import com.librogeek.Models.Tag;

import java.util.List;

public record BookDTO(
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
        List<?> userComments,
        List<Tag> tags,
        boolean inBookShelf,
        String created_at
) {

    public BookDTO(Book book, List<?> userComments , List<Tag> tags, boolean inBookShelf) {
        this(
                book.getBook_id(),
                book.getTitle(),
                book.getAuthor(),
                book.getDescription(),
                book.getFile_path(),
                book.getCover_image(),
                book.getCategory(),
                book.getBook_type(),
                book.getUploaded_by(),
                book.getViews(),
                book.getDownloads(),
                userComments,
                tags,
                inBookShelf,
                book.getCreated_at()
        );
    }


}
