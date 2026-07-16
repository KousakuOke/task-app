package com.example.taskapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskapp.dto.request.TaskRequest;
import com.example.taskapp.dto.response.TaskResponse;
import com.example.taskapp.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    
    private Long getCurrentUserId(){
        UsernamePasswordAuthenticationToken auth = 
            (UsernamePasswordAuthenticationToken)SecurityContextHolder
            .getContext().getAuthentication();
        return (Long)auth.getCredentials();
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(@RequestParam(defaultValue = "createdAt") String sort) {
        return ResponseEntity.ok(taskService.getAllTasks(getCurrentUserId(), sort));
    }
    
    @GetMapping("/today")
    public ResponseEntity<List<TaskResponse>> getTodayTasks() {
        return ResponseEntity.ok(taskService.getTodayTasks(this.getCurrentUserId()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<TaskResponse>> getUpcomingTasks() {
        return ResponseEntity.ok(taskService.getUpcomingTasks(this.getCurrentUserId()));
    }
    
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest req) {
        //TODO: process POST request
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(taskService.createTask(this.getCurrentUserId(), req));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long taskId, @Valid @RequestBody TaskRequest req) {
        //TODO: process PUT request
        return ResponseEntity.ok(taskService.updateTask(this.getCurrentUserId(), taskId, req));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId){
        taskService.deleteTask(this.getCurrentUserId(), taskId);
        return ResponseEntity.noContent().build();
    }
}
