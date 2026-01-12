package com.librogeek.Repositories;

import com.librogeek.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByUsername(String userName);

    Optional<User> findByUsername(String username);

    Optional<Object> findByEmail(String email);

    User getUserByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
    SELECT u FROM User u
    WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%'))
       OR (:userId IS NOT NULL AND u.user_id = :userId)
""")
    List<User> searchUsers(@Param("query") String query, @Param("userId") Integer userId);




}
