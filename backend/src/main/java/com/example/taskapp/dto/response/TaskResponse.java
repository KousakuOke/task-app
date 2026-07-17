package com.example.taskapp.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.taskapp.model.Task;

import lombok.Data;

@Data
public class TaskResponse {

    private Long id;
    private String name;
    private LocalDate deadline;
    private String memo;
    private Long tagId;
    private String tagName;
    private String tagColor;
    private Long projectId;
    private String projectName;
    private LocalDateTime createdAt;

    public static TaskResponse from(Task task){
        TaskResponse res = new TaskResponse();
        res.id = task.getId();
        res.name = task.getName();
        res.deadline = task.getDeadline();
        res.memo = task.getMemo();
        res.tagId = task.getTag() != null ? task.getTag().getId() : null;
        res.tagName = task.getTag() != null ? task.getTag().getName() : null;
        res.tagColor = task.getTag() != null ? task.getTag().getColor() : null;
        res.projectId = task.getProject() != null ? task.getProject().getId() : null;
        res.projectName = task.getProject() != null ? task.getProject().getName() : null;
        res.createdAt = task.getCreatedAt();
        return res;
    }
}
