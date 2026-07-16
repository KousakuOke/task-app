package com.example.taskapp.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.taskapp.dto.request.ProjectRequest;
import com.example.taskapp.dto.response.ProjectResponse;
import com.example.taskapp.exception.ForbiddenException;
import com.example.taskapp.exception.ResourceNotFoundException;
import com.example.taskapp.model.Project;
import com.example.taskapp.model.User;
import com.example.taskapp.repository.ProjectRepository;
import com.example.taskapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<ProjectResponse> getAllProjects(Long userId){
        return projectRepository.findByUserId(userId)
            .stream().map(ProjectResponse::from).toList();
    }

    public ProjectResponse createProject(Long userId, ProjectRequest req){
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));
        
        Project project = new Project();
        project.setName(req.getName());
        project.setDeadline(req.getDeadline());
        project.setMemo(req.getMemo());
        project.setUser(user);

        return ProjectResponse.from(projectRepository.save(project));
    }

    public ProjectResponse updateProject(Long userId, Long projectId, ProjectRequest req){
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("プロジェクトが見つかりません"));
        
        if(!project.getUser().getId().equals(userId)){
            throw new ForbiddenException("権限がありません");
        }

        project.setName(req.getName());
        project.setDeadline(req.getDeadline());
        project.setMemo(req.getMemo());

        return ProjectResponse.from(projectRepository.save(project));
    }

    public void deleteProject(Long userId, Long projectId){
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("プロジェクトが見つかりません"));
        
        if(!project.getUser().getId().equals(userId)){
            throw new ForbiddenException("権限がありません");
        }

        projectRepository.delete(project);
    }

}
