package com.example.taskapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskapp.dto.request.TagRequest;
import com.example.taskapp.dto.response.TagResponse;
import com.example.taskapp.service.TagService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    private Long getCurrentUserId(){
        UsernamePasswordAuthenticationToken auth = 
            (UsernamePasswordAuthenticationToken)SecurityContextHolder
            .getContext().getAuthentication();
        return (Long)auth.getCredentials();
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags(getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<TagResponse> createTag(@Valid @RequestBody TagRequest req) {
        //TODO: process POST request
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(tagService.createTag(getCurrentUserId(), req));
    }

    @DeleteMapping("/{tagId}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long tagId){
        tagService.deleteTag(this.getCurrentUserId(), tagId);
        return ResponseEntity.noContent().build();
    }
    
}
