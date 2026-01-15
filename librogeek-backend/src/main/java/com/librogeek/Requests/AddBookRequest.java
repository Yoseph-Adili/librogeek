package com.librogeek.Requests;

import com.librogeek.Enums.BookType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class AddBookRequest {

    @NotEmpty(message = "title is required")
    private String title;

    @NotEmpty(message = "author is required")
    private String author;


    private BigDecimal price;

    @NotNull(message = "bookType is required")
    private BookType bookType;

    @NotEmpty(message = "category is required")
    private String category;

    @NotEmpty(message = "description is required")
    private String description;

    // ===== getter & setter =====
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BookType getBookType() { return bookType; }
    public void setBookType(BookType bookType) { this.bookType = bookType; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }



    public AddBookRequest() {}
}
