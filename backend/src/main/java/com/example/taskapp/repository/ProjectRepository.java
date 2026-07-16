package com.example.taskapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.taskapp.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUserId(Long id);
}
