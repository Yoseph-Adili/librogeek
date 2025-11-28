package com.librogeek.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "tags")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Integer tagId;
    @Column(name = "book_id")
    private Integer bookId;

    @Column(name = "tag")
    private String tag;
    @Column(name = "tag_votes")
    private Integer tagVotes;
    public Tag() {
    }
    public Tag(Integer tagId, Integer bookId, String tag) {
        this.tagId = tagId;
        this.bookId = bookId;
        this.tag = tag;
    }
    public Integer getTag_id() {
        return tagId;
    }
    public void setTag_id(Integer tagId) {
        this.tagId = tagId;
    }
    public Integer getBook_id() {
        return bookId;
    }
    public void setBook_id(Integer bookId) {}
    public String getTag() {
        return tag;
    }
    public void setTag(String tag) {
        this.tag = tag;
    }

    public Integer getTagVotes() {
        return tagVotes;
    }

    public void setTagVotes(Integer tagVotes) {
        this.tagVotes = tagVotes;
    }
}
