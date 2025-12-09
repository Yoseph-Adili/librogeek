package com.librogeek.Repositories;

import com.librogeek.DTO.TagDTO;
import com.librogeek.Models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {

    @Query("SELECT new com.librogeek.DTO.TagDTO(t.tag, COALESCE(SUM(t.tagVotes), 0)) " +
            "FROM Tag t " +
            "GROUP BY t.tag")
    List<TagDTO> findAllWithVotes();


    List<Tag> findByBookId(Integer bookId);

    Optional<Tag> findByTagId(Integer tagId);

    Optional<Tag> findByTagAndBookId(String tag, Integer bookId);
}
