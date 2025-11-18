package com.librogeek.Models;

import com.librogeek.Enums.Role;
import jakarta.persistence.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

@Entity
@Table(name = "users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer user_id;
    @NotEmpty
    private String username;
    private String profile_photo;
    private String name;
    @NotEmpty
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    @NotEmpty
    @Email
    private String email;

    public User() {
    }

    public User(Integer user_id, String username, String profile_photo, String name, String password, Role role, String email) {
        this.user_id = user_id;
        this.username = username;
        this.profile_photo = profile_photo;
        this.name = name;
        this.password = password;
        this.role = role;
        this.email = email;
    }

    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
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

    public String getProfile_photo() {
        return profile_photo;
    }

    public void setProfile_photo(String profile_photo) {
        this.profile_photo = profile_photo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
