package com.example.taskapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.taskapp.model.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserId(Long id);
}
