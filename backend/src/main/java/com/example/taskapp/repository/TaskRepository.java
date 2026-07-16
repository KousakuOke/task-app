package com.example.taskapp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.taskapp.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long id);
    List<Task> findByUserIdAndDeadline(Long id, LocalDate deadline);
    List<Task> findByUserIdAndDeadlineAfterOrderByDeadlineAsc(Long id, LocalDate deadline);
    List<Task> findByProjectId(Long projectId);
}
