package com.librogeek.Requests;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChangeNamesRequest {

    private String name;

    @NotBlank(message = "Username is required")
    private String username;





    // getter / setter

    @Override
    public String toString() {
        return "LoginRequest{" +
                "username='" + username + '\'' +
                '}';
    }



    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

}

