package com.example.taskapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.taskapp.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.tasks t " +
            "LEFT JOIN FETCH t.tag WHERE p.user.id = :userId")
    List<Project> findByUserId(@Param("userId") Long userId);
}
