package com.librogeek.Controllers;

import com.librogeek.Component.TokenManager;
import com.librogeek.DTO.BookDTO;


import com.librogeek.DTO.TagDTO;
import com.librogeek.Models.Tag;
import com.librogeek.Requests.AddTagRequest;

import com.librogeek.Services.BookService;

import com.librogeek.Services.TagService;
import com.librogeek.Utils.ApiResponse;
import com.librogeek.Utils.ServiceResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class TagController {
    private final TagService tagService;
    private final TokenManager tokenManager;


    public TagController( TagService tagService, TokenManager tokenManager) {
        this.tagService = tagService;
        this.tokenManager = tokenManager;

    }


    @PatchMapping("/book/tag/add/{tag_id}")
    public ResponseEntity<ApiResponse> addTagVote(@PathVariable Integer tag_id, @RequestHeader(name = "Authorization", required = false) String authHeader) {
        System.out.println("authHeader:" + authHeader + "this is bookshelf");

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Please login first"));
        }
        ServiceResult<BookDTO> result = tagService.addTagVote(tag_id, token);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @PatchMapping("/book/tag/subtract/{tag_id}")
    public ResponseEntity<ApiResponse> subtractTagVote(@PathVariable Integer tag_id, @RequestHeader(name = "Authorization", required = false) String authHeader) {
        System.out.println("authHeader:" + authHeader + "this is bookshelf");

        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid or expired token"));
        }
        ServiceResult<BookDTO> result = tagService.subtractTagVote(tag_id, token);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }

    @PostMapping("/book/tag/{book_id}")
    public ResponseEntity<ApiResponse> addTag(@PathVariable Integer book_id, @RequestHeader(name = "Authorization", required = false) String authHeader, @RequestBody AddTagRequest request) {


        String token = authHeader.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Please login first"));
        }
        String tag = request.getTag();
        ServiceResult<BookDTO> result = tagService.addTag(book_id, token, tag);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }
    @GetMapping("/tags/getAllTags")
    public ResponseEntity<ApiResponse> getAllTags() {
        ServiceResult<List<TagDTO>> result = tagService.getAllTags();
        System.out.println("tags:" + result);
        return ResponseEntity.ok(ApiResponse.success(result.getData(), result.getMessage()));
    }


}
