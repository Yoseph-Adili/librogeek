package com.librogeek.Requests;


import jakarta.validation.constraints.NotBlank;

public class AddTagRequest {


    @NotBlank(message = "Tag is required")
    private String tag;


    // getter / setter
    public String getTag() {
        return tag;
    }
    public void setTag(String tag) {
        this.tag = tag;
    }
}





