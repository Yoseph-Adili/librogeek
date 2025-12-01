package com.librogeek.Requests;



import jakarta.validation.constraints.NotEmpty;

public class CommentRequest {

    @NotEmpty(message = "you must provide a comment")
    private String comment;

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}

