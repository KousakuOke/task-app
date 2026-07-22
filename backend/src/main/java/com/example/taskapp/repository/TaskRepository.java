package com.example.taskapp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.taskapp.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // 作成日順
    @Query("SELECT DISTINCT t FROM  Task t LEFT JOIN FETCH t.tag LEFT JOIN FETCH t.project " + 
            "WHERE t.user.id = :userId ORDER BY t.createdAt DESC")
    List<Task> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    // 期日順
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.tag LEFT JOIN FETCH t.project " +
            "WHERE t.user.id = :userId ORDER BY CASE WHEN t.deadline IS NULL THEN 1 ELSE 0 END, t.deadline ASC")
    List<Task> findByUserIdOrderByDeadlineAsc(@Param("userId") Long userId);

    // タグ順
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.tag LEFT JOIN FETCH t.project " +
            "WHERE t.user.id = :userId ORDER BY CASE WHEN t.tag IS NULL THEN 1 ELSE 0 END, t.tag.name ASC")
    List<Task> findByUserIdOrderByTagName(@Param("userId") Long userId);

    // 今日期日のタスク
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.tag LEFT JOIN FETCH t.project " +
            "WHERE t.user.id = :userId AND t.deadline = :deadline")
    List<Task> findByUserIdAndDeadline(@Param("userId") Long userId, @Param("deadline") LocalDate deadline);

    // 直近のタスク
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.tag LEFT JOIN FETCH t.project " +
            "WHERE t.user.id = :userId AND t.deadline > :deadline ORDER BY t.deadline ASC")
    List<Task> findByUserIdAndDeadlineAfterOrderByDeadlineAsc(@Param("userId") Long userId, @Param("deadline") LocalDate deadline);

    // プロジェクトのタスク
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.tag WHERE t.project.id = :projectId")
    List<Task> findByProjectId(@Param("projectId") Long projectId);

}
