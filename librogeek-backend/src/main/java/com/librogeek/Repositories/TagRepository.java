package com.librogeek.Repositories;

import com.librogeek.Models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {


    List<Tag> findByBookId(Integer bookId);

    Optional<Tag> findByTagId(Integer tagId);

    Optional<Tag> findByTagAndBookId(String tag, Integer bookId);
}
