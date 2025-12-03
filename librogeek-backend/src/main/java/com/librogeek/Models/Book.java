package com.librogeek.Models;

import com.librogeek.Enums.BookType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer book_id;
    @NotEmpty
    private String title;
    private String author;
    private String description;
    @NotEmpty
    private String file_path;
    private String cover_image;
    @NotEmpty
    private String category;
    @NotEmpty
    @Enumerated(EnumType.STRING)
    private BookType book_type;
    @NotEmpty
    private Integer uploaded_by;
    private Integer views;
    private Integer downloads;
    private Float price;
    private String created_at;

    public Book() {
    }

    public Book(Integer book_id, String title, String author, String description, String file_path, String cover_image, String category, BookType book_type, Integer uploaded_by, Integer views, Integer downloads, Float price, String created_at) {
        this.book_id = book_id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.file_path = file_path;
        this.cover_image = cover_image;
        this.category = category;
        this.book_type = book_type;
        this.uploaded_by = uploaded_by;
        this.views = views;
        this.downloads = downloads;
        this.price = price;
        this.created_at = created_at;
    }

    public Integer getBook_id() {
        return book_id;
    }

    public void setBook_id(Integer book_id) {
        this.book_id = book_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFile_path() {
        return file_path;
    }

    public void setFile_path(String file_path) {
        this.file_path = file_path;
    }

    public String getCover_image() {
        return cover_image;
    }

    public void setCover_image(String cover_image) {
        this.cover_image = cover_image;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BookType getBook_type() {
        return book_type;
    }

    public void setBook_type(BookType book_type) {
        this.book_type = book_type;
    }

    public Integer getUploaded_by() {
        return uploaded_by;
    }

    public void setUploaded_by(Integer uploaded_by) {
        this.uploaded_by = uploaded_by;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public Integer getDownloads() {
        return downloads;
    }

    public void setDownloads(Integer downloads) {
        this.downloads = downloads;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }


}
