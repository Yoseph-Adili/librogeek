package com.librogeek.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer commentId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "book_id")
    private Integer bookId;

    @NotEmpty
    private String content;


    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    // getters & setters
    public Comment() {
    }
    public Comment( Integer userId, Integer bookId, String content) {

        this.userId = userId;
        this.bookId = bookId;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }

    public Integer getCommentId() {
        return commentId;
    }

    public void setCommentId(Integer commentId) {
        this.commentId = commentId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getBookId() {
        return bookId;
    }

    public void setBookId(Integer bookId) {
        this.bookId = bookId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


}
