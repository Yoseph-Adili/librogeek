package com.librogeek.Repositories;

import com.librogeek.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByUsername(String userName);

    Optional<User> findByUsername(String username);

    Optional<Object> findByEmail(String email);

    User getUserByEmail(String email);
}
