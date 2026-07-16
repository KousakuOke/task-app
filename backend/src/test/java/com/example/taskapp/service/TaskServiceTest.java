package com.example.taskapp.service;

import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.taskapp.dto.request.TaskRequest;
import com.example.taskapp.dto.response.TaskResponse;
import com.example.taskapp.exception.ResourceNotFoundException;
import com.example.taskapp.model.Task;
import com.example.taskapp.model.User;
import com.example.taskapp.repository.ProjectRepository;
import com.example.taskapp.repository.TagRepository;
import com.example.taskapp.repository.TaskRepository;
import com.example.taskapp.repository.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TaskService taskService;

    private User testUser;

    @BeforeEach
    void setUp(){
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("テストユーザー");
        testUser.setEmail("test@example.com");
    }

    @Test
    void タスク作成_成功(){
        TaskRequest req = new TaskRequest();
        req.setName("テストタスク");
        req.setDeadline(LocalDate.of(2026, 6, 1));
        req.setMemo("テストメモ");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task task = invocation.getArgument(0);
            task.setId(1L);
            return task;
        });

        TaskResponse res = taskService.createTask(1L, req);

        assertThat(res.getName()).isEqualTo("テストタスク");
        assertThat(res.getDeadline()).isEqualTo(LocalDate.of(2026, 6, 1));
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void タスク作成_例外(){
        TaskRequest req = new TaskRequest();
        req.setName("テストタスク");

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.createTask(999L, req);
        });
    }

    @Test
    void タスク削除_例外(){
        User otherUser = new User();
        otherUser.setId(2L);

        Task task = new Task();
        task.setId(1L);
        task.setUser(otherUser);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(RuntimeException.class, () -> {
            taskService.deleteTask(1L, 1L);
        });
    }

}
