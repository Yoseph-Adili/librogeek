package com.librogeek.Services;

import com.librogeek.DTO.BookDTO;

import com.librogeek.DTO.TagDTO;
import com.librogeek.Models.Book;
import com.librogeek.Models.Tag;
import com.librogeek.Repositories.BookRepository;
import com.librogeek.Repositories.TagRepository;
import com.librogeek.Utils.ServiceResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TagService {
    private final BookRepository bookRepository;

    private final TagRepository tagRepository;


    public TagService(BookRepository bookRepository,TagRepository tagRepository) {

        this.bookRepository = bookRepository;

        this.tagRepository = tagRepository;

    }

    public ServiceResult<BookDTO> addTagVote(Integer tag_id, String token) {
        if (token == null || token.isEmpty()) {
            return ServiceResult.failure("User not logged in");
        }

        Optional<Tag> tag = tagRepository.findByTagId(tag_id);
        tag.get().setTagVotes(tag.get().getTagVotes() + 1);
        tagRepository.save(tag.get());


        return ServiceResult.success(null, "Bookshelf updated successfully");
    }

    public ServiceResult<BookDTO> subtractTagVote(Integer tag_id, String token) {
        if (token == null || token.isEmpty()) {
            return ServiceResult.failure("User not logged in");
        }

        Optional<Tag> tag = tagRepository.findByTagId(tag_id);

        if (tag.get().getTagVotes() < 1) {
            tag.get().setTagVotes(tag.get().getTagVotes() - 1);
            tagRepository.save(tag.get());
        } else {
            tagRepository.delete(tag.get());
        }


        return ServiceResult.success(null, "Bookshelf updated successfully");
    }

    public ServiceResult<BookDTO> addTag(Integer book_id, String token, String tag) {
        if (token == null || token.isEmpty()) {
            return ServiceResult.failure("User not logged in");
        }

        Optional<Book> book = bookRepository.findById(book_id);
        if (book.isEmpty()) {
            return ServiceResult.failure("Book not found");
        }
        Optional<Tag> existTag = tagRepository.findByTagAndBookId(tag, book_id);
        if (existTag.isPresent()) {
            existTag.get().setTagVotes(existTag.get().getTagVotes() + 1);
            tagRepository.save(existTag.get());
        } else {
            Tag newTag = new Tag();
            newTag.setBook_id(book_id);
            newTag.setTag(tag);
            newTag.setTagVotes(1);
            tagRepository.save(newTag);
        }

        return ServiceResult.success(null, "Tag added successfully");
    }
    public ServiceResult<List<TagDTO>> getAllTags() {
        List<TagDTO> tags = tagRepository.findAllWithVotes();
        if (tags.isEmpty()) {
            return ServiceResult.failure("No tags found");
        }
        return ServiceResult.success(tags, "Books retrieved successfully");
    }

}
