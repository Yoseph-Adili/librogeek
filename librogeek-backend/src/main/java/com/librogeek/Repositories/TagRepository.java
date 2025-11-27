package com.librogeek.Repositories;

import com.librogeek.Models.Book;
import com.librogeek.Models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {


    List<Tag> findByBookId(Integer bookId);
}
