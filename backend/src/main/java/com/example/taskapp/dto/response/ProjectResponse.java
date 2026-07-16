package com.example.taskapp.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.taskapp.model.Project;
import com.example.taskapp.model.Task;

import lombok.Data;

@Data
public class ProjectResponse {

    private Long id;
    private String name;
    private LocalDate deadline;
    private String memo;
    private Integer progress;
    private LocalDateTime createdAt;
    private List<TaskResponse> tasks;

    public static ProjectResponse from(Project project){
        ProjectResponse res = new ProjectResponse();
        res.id = project.getId();
        res.name = project.getName();
        res.deadline = project.getDeadline();
        res.memo = project.getMemo();
        res.createdAt = project.getCreatedAt();

        List<Task> tasks = project.getTasks() 
            != null ? project.getTasks() : new ArrayList<>();

        List<TaskResponse> taskResponses = tasks.stream()
            .map(TaskResponse::from).toList();
        res.tasks = taskResponses;

        if(!taskResponses.isEmpty()){
            Long done = tasks.stream()
                .filter(t -> t.getTag() != null && t.getTag().getName()
                .equals("完了")).count();
            res.progress = (int)(done * 100 / project.getTasks().size());
        }else{
            res.progress = 0;
        }
        return res;
    }
}
