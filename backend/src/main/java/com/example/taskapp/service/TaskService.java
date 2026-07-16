package com.example.taskapp.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.taskapp.dto.request.TaskRequest;
import com.example.taskapp.dto.response.TaskResponse;
import com.example.taskapp.exception.ForbiddenException;
import com.example.taskapp.exception.ResourceNotFoundException;
import com.example.taskapp.model.Project;
import com.example.taskapp.model.Tag;
import com.example.taskapp.model.Task;
import com.example.taskapp.model.User;
import com.example.taskapp.repository.ProjectRepository;
import com.example.taskapp.repository.TagRepository;
import com.example.taskapp.repository.TaskRepository;
import com.example.taskapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ProjectRepository projectRepository;

    public List<TaskResponse> getAllTasks(Long userId){
        return taskRepository.findByUserId(userId)
            .stream().map(TaskResponse::from).toList();
    }

    public List<TaskResponse> getTodayTasks(Long userId){
        return taskRepository.findByUserIdAndDeadline(userId, LocalDate.now())
            .stream().map(TaskResponse::from).toList();
    }

    public List<TaskResponse> getUpcomingTasks(Long userId){
        return taskRepository.findByUserIdAndDeadlineAfterOrderByDeadlineAsc(userId, LocalDate.now())
            .stream().map(TaskResponse::from).toList();
    }

    public TaskResponse createTask(Long userId, TaskRequest req){
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));

        Task task = new Task();
        task.setName(req.getName());
        task.setDeadline(req.getDeadline());
        task.setMemo(req.getMemo());
        task.setUser(user);

        if(req.getTagId() != null){
            Tag tag = tagRepository.findById(req.getTagId())
                .orElseThrow(() -> new ResourceNotFoundException("タグが見つかりません"));
            task.setTag(tag);
        }

        if(req.getProjectId() != null){
            Project project = projectRepository.findById(req.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("プロジェクトが見つかりません"));
            task.setProject(project);
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long userId, Long taskId, TaskRequest req){
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("タスクが見つかりません"));
        
        if(!task.getUser().getId().equals(userId)){
            throw new ForbiddenException("権限がありません");
        }

        task.setName(req.getName());
        task.setDeadline(req.getDeadline());
        task.setMemo(req.getMemo());

        if(req.getTagId() != null){
            Tag tag = tagRepository.findById(req.getTagId())
                .orElseThrow(() -> new ResourceNotFoundException("タグが見つかりません"));
            task.setTag(tag);
        }else{
            task.setTag(null);
        }

        if(req.getProjectId() != null){
            Project project = projectRepository.findById(req.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("プロジェクトが見つかりません"));
            task.setProject(project);
        }else{
            task.setProject(null);
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    public void deleteTask(Long userId, Long taskId){
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("タスクが見つかりません"));
        
        if(!task.getUser().getId().equals(userId)){
            throw new ForbiddenException("権限がありません");
        }

        taskRepository.delete(task);
    }

}
