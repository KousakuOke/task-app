package com.example.taskapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskapp.dto.request.ProjectRequest;
import com.example.taskapp.dto.response.ProjectResponse;
import com.example.taskapp.service.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    private Long getCurrentUserId(){
        UsernamePasswordAuthenticationToken auth = 
            (UsernamePasswordAuthenticationToken)SecurityContextHolder
            .getContext().getAuthentication();
        return (Long)auth.getCredentials();
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects(this.getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest req) {
        //TODO: process POST request
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(projectService.createProject(this.getCurrentUserId(), req));
    }
    
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long projectId, @Valid @RequestBody ProjectRequest req) {
        //TODO: process PUT request
        return ResponseEntity.ok(projectService.updateProject(this.getCurrentUserId(), projectId, req));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId){
        projectService.deleteProject(this.getCurrentUserId(), projectId);
        return ResponseEntity.noContent().build();
    }
    
}
